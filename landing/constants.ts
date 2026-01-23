import { GraduationCap, Users, Trophy, BookOpen } from 'lucide-react';
import { NavItem, Course, Faculty, Stat, Testimonial, Scholar } from './types';

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/#home' },
  { label: 'About', href: '/#about' },
  { label: 'Courses', href: '/courses' },
  { label: 'Faculty', href: '/#faculty' },
  { label: 'Scholars', href: '/#scholars' },
  { label: 'Contact', href: '/#contact' },
];

export const COURSES: Course[] = [
  {
    id: '1',
    category: 'Language Skills',
    title: 'English Speaking Course',
    description:
      'A complete English communication program including Basic Grammar (3 months), Advanced English (2 months) with vocabulary, translation, writing skills, and a dedicated Speaking Course (2 months) featuring JAM sessions, interviews, debates, speeches, and listening exercises.',
    image: '/course-1.webp',
  },
  {
    id: '2',
    category: 'Foreign Language',
    title: 'French Language (Basic to Advanced)',
    description:
      'Comprehensive French language training from Basic to Advanced level covering verbs, tenses, pronouns, conditionals, vocabulary, sentence formation, and conversational fluency.',
    image: '/course-2.webp',
  },
  {
    id: '3',
    category: 'School Academics',
    title: 'Class X (All Subjects)',
    description:
      'Focused academic coaching for Class X students covering English, Mathematics, Science, and Social Science with emphasis on board exam preparation and concept clarity.',
    image: '/course-3.webp',
  },
  {
    id: '4',
    category: 'Commerce Stream',
    title: 'Classes XI & XII – Commerce',
    description:
      'Complete commerce stream coaching including Accountancy, Economics, Business Studies, Mathematics, and English for Classes XI and XII with board-focused preparation.',
    image: '/course-4.webp',
  },
  {
    id: '5',
    category: 'Junior Classes',
    title: 'Junior Classes (All Subjects)',
    description:
      'All-subject coaching for junior classes with special English speaking sessions and interactive mathematics workshops to build strong academic foundations.',
    image: '/course-1.webp',
  },
  {
    id: '6',
    category: 'Professional',
    title: 'CA Foundation',
    description:
      'Structured CA Foundation coaching with expert guidance, conceptual clarity, and exam-oriented preparation.',
    image: '/course-3.webp',
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