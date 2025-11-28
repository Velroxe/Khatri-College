import { LucideIcon } from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
}

export interface Course {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
}

export interface Faculty {
  id: string;
  name: string;
  // description: string;
  experience_years: number;
  qualifications: string;
  specialities: string;
  image_url: string;
  // created_at: string;
  // updated_at: string;
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
  // created_at: string;
  // updated_at: string;
}

export interface Stat {
  label: string;
  value: string;
  icon: LucideIcon;
}

export interface Testimonial {
  id: string;
  text: string;
  author: string;
  role: string;
}