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

export type CrmStatus = 'GOOD_LEAD_FOLLOW_UP' | 'DID_NOT_CONNECT' | 'BAD_LEAD' | 'SALE_DONE';
export type DataSource = 'leads_on_demand' | 'meridian_tower' | 'eden_park' | 'varah_swamy' | 'sarjapur_plots' | '';

export interface ImportResult {
  success: CrmRecord[];
  skipped: { row: number; reason: string }[];
  totalParsed: number;
  totalImported: number;
  totalSkipped: number;
}

export interface UploadResponse {
  columns: string[];
  rows: Record<string, string>[];
  totalRows: number;
}

export interface ImportResponse {
  success: boolean;
  data?: ImportResult;
  error?: string;
}
