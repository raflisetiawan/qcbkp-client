import { Plant } from './plant';
import { QualityIssue } from './qualityIssue';
import { QSelectOption } from 'quasar';

export interface Issue {
  id: number;
  user_id: number;
  shift: number;
  issue_date: Date;
  plant: Plant;
  closed?: boolean;
}

export interface AddIssueForm {
  shift: number;
  issue_date: string | number | null | undefined;
  plant: QSelectOption;
}
export interface AddIssueFormAdmin {
  shift: number;
  issue_date: string | number | null | undefined;
  plant: QSelectOption;
  quality_control_name: string;
  qc_image: null;
}

export interface EditedIssue {
  id: number;
  user_id: number;
  shift: number;
  issue_date: string | null | number | undefined;
  plant: QSelectOption;
  quality_control_name?: string;
}
export interface EditedIssueAdmin {
  id: number;
  user_id: number;
  shift: number;
  issue_date: string | null | number | undefined;
  plant: QSelectOption;
  quality_control_name?: string;
  qc_image?: null;
}

export interface IssueWithQualityIssue {
  id: number;
  user_id: number;
  shift: number;
  issue_date: string;
  quality_issues: QualityIssue[];
}

export interface IssueChartData {
  labels: string[];
  datasets: [{ data: string[]; backgroundColor: string[] }];
  issue: any;
}
