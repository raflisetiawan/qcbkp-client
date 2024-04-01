export interface User {
  id: number;
  email: string;
  name: string;
  created_at: string;
  email_verified_at?: Date | null;
  updated_at?: Date | null;
  role: string;
  image?: null | string;
}

export interface UserEditForm {
  name: string;
  image?: null | File | string;
  user_id?: number;
  _method?: string;
}

export interface ManageUser {
  id: number;
  name: string;
  approval_status: boolean;
  email: string;
  approval_status_text: string;
  role_name: string;
  role_id: number;
}
