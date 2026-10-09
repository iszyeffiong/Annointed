import type { LucideIcon } from "lucide-react";
import {
  Baby,
  BookOpen,
  BrainCircuit,
  Church,
  Compass,
  GraduationCap,
  HeartHandshake,
  Microscope,
  Music2,
  Palette,
  ShieldCheck,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";

export const school = {
  name: "Annointed comprehensive high school",
  shortName: "RGGA",
  logo: "/logo.svg",
  address: "Anita Street (by Basumoh Gas Plant)",
  location: "Uyo, Akwa Ibom State, Nigeria",
  phone: "+234 814 602 5178",
  email: "anointedschool@gmail.com",
  facebook: "https://facebook.com/remagga",
};

export type Programme = {
  title: string;
  ages: string;
  description: string;
  icon: LucideIcon;
  accent: string;
};

export const programmes: Programme[] = [
  {
    title: "Creche & Nursery",
    ages: "Early years",
    description: "A joyful, secure start built around purposeful play, language, discovery and care.",
    icon: Baby,
    accent: "bg-coral-soft text-coral",
  },
  {
    title: "Primary School",
    ages: "Foundational years",
    description: "Strong literacy, numeracy and character foundations, with curiosity encouraged every day.",
    icon: BookOpen,
    accent: "bg-gold-soft text-gold-deep",
  },
  {
    title: "Secondary School",
    ages: "Future-ready years",
    description: "Rigorous learning, confident expression and practical preparation for life beyond school.",
    icon: GraduationCap,
    accent: "bg-sky-soft text-sky-deep",
  },
];

export const values = [
  { title: "Faith", text: "We nurture a living sense of purpose, gratitude and service.", icon: Church },
  { title: "Excellence", text: "We set high standards and help every learner grow towards them.", icon: Trophy },
  { title: "Character", text: "We practise integrity, discipline, kindness and responsibility.", icon: ShieldCheck },
  { title: "Community", text: "We learn together, celebrate one another and serve beyond ourselves.", icon: HeartHandshake },
];

export const clubs = [
  { name: "STEM & Robotics", icon: BrainCircuit },
  { name: "Creative Arts", icon: Palette },
  { name: "Music & Choir", icon: Music2 },
  { name: "Young Scientists", icon: Microscope },
  { name: "Leadership Club", icon: Users },
  { name: "Sports & Fitness", icon: Trophy },
];

export const newsItems = [
  {
    type: "School life",
    date: "Sample date",
    title: "A new term of discovery begins",
    excerpt: "A placeholder update celebrating fresh goals, renewed friendships and a joyful return to learning.",
    motif: "books",
    image: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=800&q=80",
  },
  {
    type: "Community",
    date: "Sample date",
    title: "Family learning day",
    excerpt: "A sample invitation for families to share classroom experiences, creative work and conversations with teachers.",
    motif: "sun",
    image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80",
  },
  {
    type: "Achievement",
    date: "Sample date",
    title: "Celebrating curious minds",
    excerpt: "A placeholder story recognising pupils who showed courage, compassion and creativity in their learning.",
    motif: "star",
    image: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=800&q=80",
  },
  {
    type: "Events",
    date: "Sample date",
    title: "Arts and culture showcase",
    excerpt: "A sample event bringing together music, storytelling, colour and the rich cultural spirit of Akwa Ibom.",
    motif: "pattern",
    image: "https://images.unsplash.com/photo-1460518451285-97b6aa326961?auto=format&fit=crop&w=800&q=80",
  },
  {
    type: "Academics",
    date: "Sample date",
    title: "Learning beyond the classroom",
    excerpt: "A placeholder look at practical activities that connect classroom ideas with the world around us.",
    motif: "leaf",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80",
  },
  {
    type: "Faith & values",
    date: "Sample date",
    title: "A week of kindness",
    excerpt: "A sample reflection on thoughtful actions, gratitude and serving others in our school community.",
    motif: "heart",
    image: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80",
  },
];

export const highlights = [
  { value: "3", label: "learning stages", icon: Compass },
  { value: "1:1", label: "care for every child", icon: HeartHandshake },
  { value: "∞", label: "room to grow", icon: Sparkles },
];

export { initialBlogPosts, type BlogPost } from "./blog-storage";

export type StaffMember = {
  name: string;
  role: string;
  department: string;
  category: "Administration" | "Academic Leadership" | "Teaching Staff";
  bio: string;
  initials: string;
  accent: string;
  image: string;
};

export const administrationAndStaff: StaffMember[] = [
  {
    name: "Dr. / Pastor (Mrs.) E. Akpan",
    role: "Proprietress & Director",
    department: "Executive Management",
    category: "Administration",
    bio: "Provides visionary oversight, spiritual direction, and pastoral care to ensure the school's mission flourishes.",
    initials: "EA",
    accent: "bg-gold-soft text-gold-deep",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Mr. Bassey Udoh",
    role: "Principal / Head of School",
    department: "School Administration",
    category: "Administration",
    bio: "Leads academic governance, teacher development, and student discipline across all educational tiers.",
    initials: "BU",
    accent: "bg-sky-soft text-sky-deep",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Mrs. Grace Effiong",
    role: "Head of Early Years & Nursery",
    department: "Creche & Nursery",
    category: "Academic Leadership",
    bio: "Champions early childhood discovery, language immersion, and a warm, loving foundation for our youngest pupils.",
    initials: "GE",
    accent: "bg-coral-soft text-coral",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Mr. Aniekan Okon",
    role: "Dean of Studies & Examinations",
    department: "Secondary School",
    category: "Academic Leadership",
    bio: "Oversees curriculum implementation, continuous assessment, and high standard WAEC/BECE preparation.",
    initials: "AO",
    accent: "bg-mint-soft text-primary",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Mrs. Imaobong Inyang",
    role: "Head Teacher — Primary Section",
    department: "Primary School",
    category: "Academic Leadership",
    bio: "Fosters strong numeracy, reading literacy, and moral habits in our primary classrooms.",
    initials: "II",
    accent: "bg-gold-soft text-gold-deep",
    image: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Mr. Emeka Nwachukwu",
    role: "Lead Instructor — STEM & ICT",
    department: "Sciences & Technology",
    category: "Teaching Staff",
    bio: "Coordinates hands-on science laboratories, computer programming, and robotics initiatives.",
    initials: "EN",
    accent: "bg-sky-soft text-sky-deep",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Ms. Victoria Bassey",
    role: "Creative Arts & Cultural Director",
    department: "Arts & Humanities",
    category: "Teaching Staff",
    bio: "Cultivates artistic expression, music, storytelling, and cultural appreciation among students.",
    initials: "VB",
    accent: "bg-rose-soft text-coral",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Mr. Kufre Asuquo",
    role: "Sports & Physical Education Lead",
    department: "Athletics & Student Life",
    category: "Teaching Staff",
    bio: "Instills teamwork, athletic discipline, physical fitness, and good sportsmanship.",
    initials: "KA",
    accent: "bg-lilac-soft text-primary",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
  },
];