export interface QualityIssue {
  id: number;
  user_id?: number;
  issue_id: string | string[];
  problem: string;
  machine_performance: string;
  trouble_duration_minutes: number;
  solution: string;
  impact: string;
  closed?: boolean;
}
export interface QualityIssueWithClosed {
  id: number;
  user_id?: number;
  issue_id: string | string[];
  problem: string;
  machine_performance: string;
  trouble_duration_minutes: number;
  solution: string;
  impact: string;
  closed: boolean;
}

export interface QualityIssueForm {
  id?: number;
  issue_id: string | string[];
  user_id: number;
  problem: string;
  machine_performance: string;
  trouble_duration_minutes: number;
  solution: string;
  impact: string;
  closed: boolean;
  closed_date: null;
}

export interface QualityIssueWithIssueAndUser {
  issue: {
    shift: string;
    plant_name: string | null;
    quality_control_name: string | null;
    qc_image?: string;
  };
  success: boolean;
  quality_issue: {
    id: number;
    problem: string;
    machine_performance: string;
    trouble_duration_minutes: number;
    solution: string;
    impact: string;
    user_id: number;
    shift: string;
    issue_date: string;
    user_name: string;
    todos: string;
    quality_control_verification: string;
    discovery_file?: null;
    closed: number;
    closed_date: string;
    created_at: string;
  };
}
