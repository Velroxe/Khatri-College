import { GraduationCap, Users, Trophy, BookOpen } from 'lucide-react';
import { NavItem, Course, Faculty, Stat, Testimonial, Scholar } from './types';

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Courses', href: '#courses' },
  { label: 'Faculty', href: '#faculty' },
  { label: 'Scholars', href: '#scholars' },
  { label: 'Contact', href: '#contact' },
];

export const COURSES: Course[] = [
  {
    id: '1',
    category: 'School Foundation',
    title: 'Classes 5–10 (School Foundation)',
    description:
      'Complete foundational learning across all subjects, focusing on NCERT syllabus, concept clarity, strengthening analytical thinking, concept mastery, and preparation for board foundations.',
    image: '/course-1.webp',
  },
  {
    id: '2',
    category: 'Commerce',
    title: 'Classes 11 & 12 (Commerce ~ Maths)',
    description:
      'Comprehensive commerce curriculum including Accountancy & Business Studies, designed for in-depth understanding and complete preparation for board and competitive exams.',
    image: '/course-2.webp',
  },
  {
    id: '3',
    category: 'Professional',
    title: 'C.A. Foundation',
    description:
      'Expert CA foundation coaching with conceptual mastery & mock tests.',
    image: '/course-3.webp',
  },
  {
    id: '4',
    category: 'Professional Courses',
    title: 'Other Professional Courses',
    description:
      'Additional commerce, finance, and competitive exam specialization programs.',
    image: '/course-4.webp',
  },
];


export const FACULTY: Faculty[] = [
  {
    id: '1',
    name: 'Dr. Sarah Al-Fayed',
    experience_years: 18,
    qualifications: 'PhD in Computer Science, MSc in Artificial Intelligence',
    specialities: 'Artificial Intelligence, Machine Learning, Data Science',
    image_url: 'https://picsum.photos/id/64/400/400',
  },
  {
    id: '2',
    name: 'Prof. James Khatri',
    experience_years: 25,
    qualifications: 'PhD in Global Economics, MBA in Strategic Management',
    specialities: 'Global Business, Macroeconomics, Corporate Strategy',
    image_url: 'https://picsum.photos/id/91/400/400',
  },
  {
    id: '3',
    name: 'Dr. Elena Rossi',
    experience_years: 12,
    qualifications: 'PhD in Theoretical Physics, MSc in Quantum Mechanics',
    specialities: 'Quantum Computing, Astrophysics, Applied Mathematics',
    image_url: 'https://picsum.photos/id/338/400/400',
  },
  {
    id: '4',
    name: 'Prof. Marcus Chen',
    experience_years: 20,
    qualifications: 'Master of Architecture, PhD in Sustainable Design',
    specialities: 'Sustainable Architecture, Urban Planning, Green Tech',
    image_url: 'https://picsum.photos/id/177/400/400',
  },
  {
    id: '5',
    name: 'Dr. Anika Singh',
    experience_years: 15,
    qualifications: 'PhD in Linguistics, MA in Communication',
    specialities: 'Sociolinguistics, Phonetics, Digital Media',
    image_url: 'https://picsum.photos/id/342/400/400',
  },
  {
    id: '6',
    name: 'Prof. David Kim',
    experience_years: 22,
    qualifications: 'MSc in Robotics, PhD in Control Systems',
    specialities: 'Automation, Robotics, Mechatronics',
    image_url: 'https://picsum.photos/id/445/400/400',
  },
];

export const SCHOLARS: Scholar[] = [
  {
    id: '1',
    name: 'Aarav Patel',
    degree: 'B.Sc. Computer Science',
    image_url: 'https://picsum.photos/id/305/200/200',
    subjects: [
      { subject: 'Data Structures', marks: 98 },
      { subject: 'Algorithms', marks: 95 },
      { subject: 'Web Development', marks: 99 },
    ],
  },
  {
    id: '2',
    name: 'Priya Sharma',
    degree: 'MBA Finance',
    image_url: 'https://picsum.photos/id/325/200/200',
    subjects: [
      { subject: 'Financial Accounting', marks: 96 },
      { subject: 'Corporate Finance', marks: 94 },
      { subject: 'Economics', marks: 97 },
    ],
  },
  {
    id: '3',
    name: 'Michael O\'Connor',
    degree: 'B.Eng. Civil Engineering',
    image_url: 'https://picsum.photos/id/342/200/200',
    subjects: [
      { subject: 'Structural Analysis', marks: 92 },
      { subject: 'Fluid Mechanics', marks: 95 },
      { subject: 'Geotechnical Eng', marks: 90 },
    ],
  },
  {
    id: '4',
    name: 'Emily Chen',
    degree: 'B.Sc. Biotechnology',
    image_url: 'https://picsum.photos/id/338/200/200',
    subjects: [
      { subject: 'Genetics', marks: 95 },
      { subject: 'Microbiology', marks: 92 },
      { subject: 'Biochemistry', marks: 94 },
    ],
  },
  {
    id: '5',
    name: 'David Okonjo',
    degree: 'B.A. Psychology',
    image_url: 'https://picsum.photos/id/201/200/200',
    subjects: [
      { subject: 'Cognitive Psych', marks: 96 },
      { subject: 'Research Methods', marks: 91 },
      { subject: 'Social Psych', marks: 93 },
    ],
  },
  {
    id: '6',
    name: 'Sofia Rodriguez',
    degree: 'B.Arch Architecture',
    image_url: 'https://picsum.photos/id/433/200/200',
    subjects: [
      { subject: 'Urban Design', marks: 97 },
      { subject: 'Sustainable Arch', marks: 94 },
      { subject: 'History of Arch', marks: 92 },
    ],
  }
];

export const STATS: Stat[] = [
  { label: 'Graduates', value: '15,000+', icon: GraduationCap },
  { label: 'Expert Faculty', value: '120+', icon: Users },
  { label: 'Awards Won', value: '50+', icon: Trophy },
  { label: 'Courses', value: '85+', icon: BookOpen },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    text: "Khatri College provided me with the environment to not only learn but to innovate. The labs are world-class.",
    author: "Amit Patel",
    role: "Alumni, Class of 2021"
  },
  {
    id: '2',
    text: "The faculty here doesn't just teach; they mentor. I found my career path thanks to the guidance of Dr. Rossi.",
    author: "Jessica Wong",
    role: "Senior Student, Physics"
  }
];