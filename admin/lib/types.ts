
export interface Course {
  id: string | number;
  name: string;
  description: string;
  status: "ongoing" | "completed";
  created_at: string;
  enrolled_at: string;
}

export interface Student {
  id: string | number;
  name: string;
  email: string;
  status: "active" | "suspended" | "left";
  created_at: string;
  updated_at: string;
  enrolled_at: string;
  last_login_at:string;
}

export interface Admin {
  id: string | number;
  name: string;
  email: string;
  role: string;
}

export interface DocumentType {
  id: string;
  name: string;
  public_file_id: string;
  public_url: string;
  created_at: string;
}

export interface Faculty {
  id: string;
  name: string;
  description: string;
  experience_years: number;
  qualifications: string;
  specialities: string;
  image_url: string;
  created_at: string;
  updated_at: string;
};

export interface TopSubject {
  subject: string; 
  marks: number;       
}


export interface Scholar {
  id: string;
  name: string;
  degree: string;
  subjects: TopSubject[]; 
  image_url: string | null; 
  created_at: string;
  updated_at: string;
}