export interface TrackRecord {
  id: number;
  problem: string;
  closed: number;
  closed_date: null;
  todos: null;
  quality_control_verification: null;
  created_at: string;
  issue_date?: string;
  discovery_file?: string | null;
}

export interface QualityIssue {
  id: number;
  issue_id: number;
  problem: string;
}

export interface TrackRecordEditForm {
  closed: boolean;
  todos: string;
  quality_control_verification: string;
  discovery_file?: null;
}
