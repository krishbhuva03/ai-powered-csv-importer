import Groq from 'groq-sdk';
import { CrmRecord, CrmStatus, DataSource, ImportResult } from '../types';

const ALLOWED_STATUSES: CrmStatus[] = ['GOOD_LEAD_FOLLOW_UP', 'DID_NOT_CONNECT', 'BAD_LEAD', 'SALE_DONE'];
const ALLOWED_SOURCES: DataSource[] = ['leads_on_demand', 'meridian_tower', 'eden_park', 'varah_swamy', 'sarjapur_plots', ''];

const SYSTEM_PROMPT = `You are a CSV-to-CRM data extraction AI. Your job is to map CSV data into the GrowEasy CRM format.

CRM Fields to extract:
- created_at: Lead creation date (must be parseable by new Date() in JS)
- name: Lead name
- email: Primary email (if multiple, use first and append rest to crm_note)
- country_code: Country code (e.g. +91)
- mobile_without_country_code: Mobile number without country code
- company: Company name
- city: City
- state: State
- country: Country
- lead_owner: Lead owner email or name
- crm_status: One of: GOOD_LEAD_FOLLOW_UP, DID_NOT_CONNECT, BAD_LEAD, SALE_DONE
- crm_note: Remarks, follow-up notes, extra phone numbers, extra emails, any info that doesn't fit elsewhere
- data_source: One of: leads_on_demand, meridian_tower, eden_park, varah_swamy, sarjapur_plots (leave blank if none match confidently)
- possession_time: Property possession time
- description: Additional description

Rules:
1. crm_status must ONLY be one of: GOOD_LEAD_FOLLOW_UP, DID_NOT_CONNECT, BAD_LEAD, SALE_DONE
2. data_source must ONLY be one of: leads_on_demand, meridian_tower, eden_park, varah_swamy, sarjapur_plots (or empty string)
3. created_at must be a date string parseable by JavaScript's new Date()
4. If multiple emails exist, put the first in email field and rest in crm_note
5. If multiple mobile numbers exist, put the first in mobile_without_country_code and rest in crm_note
6. If a record has NEITHER email NOR mobile number, set "skip" to true with a reason
7. Each record must remain a single CSV row - no unintended line breaks
8. Use crm_note for any extra information that doesn't fit other fields

Return ONLY valid JSON. Format: { "records": [ { "created_at": "...", "name": "...", ... } ] }
If a field is not found, use empty string.
If a record should be skipped, include "skip": true and "skip_reason": "reason".`;

const BATCH_PROMPT = `Map the following CSV rows into GrowEasy CRM format. Return ONLY valid JSON with a "records" array.

Each record must have fields: created_at, name, email, country_code, mobile_without_country_code, company, city, state, country, lead_owner, crm_status, crm_note, data_source, possession_time, description.

Rules:
- crm_status: one of GOOD_LEAD_FOLLOW_UP, DID_NOT_CONNECT, BAD_LEAD, SALE_DONE
- data_source: one of leads_on_demand, meridian_tower, eden_park, varah_swamy, sarjapur_plots or leave empty
- If no email AND no mobile, set "skip": true with "skip_reason"
- First email -> email field, rest -> crm_note
- First mobile -> mobile_without_country_code, rest -> crm_note

CSV Rows:
{{ROWS}}

Return format: { "records": [ { "created_at": "...", ... } ] }`;

export class AiExtractor {
  private client: Groq;

  constructor(apiKey: string) {
    this.client = new Groq({ apiKey });
  }

  async extract(rows: Record<string, string>[]): Promise<ImportResult> {
    const success: CrmRecord[] = [];
    const skipped: { row: number; reason: string }[] = [];
    const batchSize = 10;
    const batches: Record<string, string>[][] = [];

    for (let i = 0; i < rows.length; i += batchSize) {
      batches.push(rows.slice(i, i + batchSize));
    }

    for (let batchIdx = 0; batchIdx < batches.length; batchIdx++) {
      const batch = batches[batchIdx];
      const globalStartIdx = batchIdx * batchSize;

      const rowsText = batch
        .map((row, i) => `Row ${globalStartIdx + i + 1}: ${JSON.stringify(row)}`)
        .join('\n');

      const prompt = BATCH_PROMPT.replace('{{ROWS}}', rowsText);

      let attempt = 0;
      const maxRetries = 3;

      while (attempt < maxRetries) {
        try {
          const response = await this.client.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: [
              { role: 'system', content: SYSTEM_PROMPT },
              { role: 'user', content: prompt },
            ],
            response_format: { type: 'json_object' },
            temperature: 0.1,
          });

          const content = response.choices[0]?.message?.content || '{}';
          const parsed = JSON.parse(content);
          const records: any[] = parsed.records || parsed.data || (Array.isArray(parsed) ? parsed : []);

          for (const record of records) {
            if (record.skip) {
              skipped.push({ row: globalStartIdx + (records.indexOf(record) as number) + 1, reason: record.skip_reason || 'Missing email and mobile' });
              continue;
            }
            success.push(this.normalizeRecord(record));
          }
          break;
        } catch (error) {
          attempt++;
          if (attempt === maxRetries) {
            console.error(`Batch ${batchIdx + 1} failed after ${maxRetries} retries:`, error);
            batch.forEach((_, i) => {
              skipped.push({
                row: globalStartIdx + i + 1,
                reason: 'AI extraction failed after retries',
              });
            });
          } else {
            await new Promise(r => setTimeout(r, 2000 * attempt));
          }
        }
      }
    }

    return {
      success,
      skipped,
      totalParsed: rows.length,
      totalImported: success.length,
      totalSkipped: skipped.length,
    };
  }

  private normalizeRecord(record: any): CrmRecord {
    const status = record.crm_status || '';
    const source = record.data_source || '';

    return {
      created_at: record.created_at || '',
      name: record.name || '',
      email: record.email || '',
      country_code: record.country_code || '',
      mobile_without_country_code: record.mobile_without_country_code || '',
      company: record.company || '',
      city: record.city || '',
      state: record.state || '',
      country: record.country || '',
      lead_owner: record.lead_owner || '',
      crm_status: ALLOWED_STATUSES.includes(status as CrmStatus) ? status : '',
      crm_note: record.crm_note || '',
      data_source: ALLOWED_SOURCES.includes(source as DataSource) ? source : '',
      possession_time: record.possession_time || '',
      description: record.description || '',
    };
  }
}
