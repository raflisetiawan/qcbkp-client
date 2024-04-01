export interface Plant {
  id: number;
  name: string;
  description: string;
  created_at?: string;
  updated_at?: string;
}

export interface PlantForm {
  name: string;
  description: string;
}

export interface EditedPlant {
  id: number;
  name: string;
  description: string;
}

export interface PlantSelect {
  id: string;
  name: string;
}
