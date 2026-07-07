const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface PreviewData {
  columns: string[];
  rows: Record<string, string>[];
  totalRows: number;
}

export interface CrmRecord {
  created_at: string;
  name: string;
  email: string;
  country_code: string;
  mobile_without_country_code: string;
  company: string;
  city: string;
  state: string;
  country: string;
  lead_owner: string;
  crm_status: string;
  crm_note: string;
  data_source: string;
  possession_time: string;
  description: string;
}

export interface ImportResult {
  success: CrmRecord[];
  skipped: { row: number; reason: string }[];
  totalParsed: number;
  totalImported: number;
  totalSkipped: number;
}

export async function uploadPreview(file: File): Promise<PreviewData> {
  const form = new FormData();
  form.append('file', file);
  const res = await fetch(`${API_BASE}/preview`, { method: 'POST', body: form });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Upload failed' }));
    throw new Error(err.error || 'Upload failed');
  }
  return res.json();
}

export async function importCsv(file: File): Promise<ImportResult> {
  const form = new FormData();
  form.append('file', file);
  const res = await fetch(`${API_BASE}/import`, { method: 'POST', body: form });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Import failed' }));
    throw new Error(err.error || 'Import failed');
  }
  const json = await res.json();
  return json.data;
}
