import { Target, Brain, Zap, Shield } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const Features: Feature[] = [
  {
    icon: Target,
    title: "Role-Specific Questions",
    description: "Tailored questions based on your exact position and experience",
  },
  {
    icon: Brain,
    title: "Deep Technical Dives",
    description: "Follow-up questions that test your true understanding",
  },
  {
    icon: Zap,
    title: "Project-Based Grilling",
    description: "Deep analysis of your portfolio and past work",
  },
  {
    icon: Shield,
    title: "Weak Spot Detection",
    description: "AI identifies and helps strengthen your vulnerabilities",
  },
];


export const Outputs: string[] = [
        "Role-specific interview questions",
        "Deep technical follow-ups",
        "Project-based grilling",
        "Weak-spot detection",
        "Mock interview (chat or voice)"
    ];


export const Roles:string[] = [
        'Software Engineer',
        'Product Manager',
        'Data Scientist',
        'UI/UX Designer',
        'DevOps Engineer',
        'Frontend Developer',
        'Backend Developer',
        'Full Stack Developer',
        'Marketing Manager',
        'Sales Executive',
        'Business Analyst',
        'Project Manager',
        'Other'
    ];    