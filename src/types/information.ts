export interface Information {
  id?: number;
  title: string;
  information: string;
  information_date: string;
  created_at?: string;
  updated_at?: string;
}

export interface AddInformation {
  title: string;
  information: string;
  information_date: string;
}
