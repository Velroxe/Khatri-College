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