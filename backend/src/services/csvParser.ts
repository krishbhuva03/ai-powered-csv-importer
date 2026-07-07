import { parse } from 'csv-parse/sync';
import { Readable } from 'stream';

export interface ParsedCsv {
  columns: string[];
  rows: Record<string, string>[];
}

export function parseCsvBuffer(buffer: Buffer): ParsedCsv {
  const raw = parse(buffer, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    bom: true,
    relax_column_count: true,
    relax_quotes: true,
  });

  const rows: Record<string, string>[] = raw.map((row: Record<string, string>) => {
    const cleaned: Record<string, string> = {};
    for (const [key, value] of Object.entries(row)) {
      const trimmedKey = key.trim();
      cleaned[trimmedKey] = (value || '').trim();
    }
    return cleaned;
  });

  const columns = rows.length > 0 ? Object.keys(rows[0]) : [];

  return { columns, rows };
}

export function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}
