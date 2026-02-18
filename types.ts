export interface Skill {
  name: string;
  category: 'Technical' | 'Soft' | 'Tools';
  userLevel: number; // 0-100
  targetLevel: number; // 0-100 (industry benchmark)
}

export interface RoadmapStep {
  id: string;
  title: string;
  description: string;
  duration: string;
  status: 'pending' | 'in-progress' | 'completed';
  resources: { title: string; url: string; type: 'course' | 'article' | 'project' }[];
}

export interface MarketInsight {
  role: string;
  salaryRange: { min: string; max: string; currency: string };
  demandLevel: 'High' | 'Medium' | 'Low';
  topSkills: string[];
  growthProjection: string;
}

export interface UserProfile {
  name: string;
  targetRole: string;
  experienceLevel: 'Junior' | 'Mid' | 'Senior';
  skills: Skill[];
  bio?: string;
}

export type ViewParams = 'home' | 'assessment' | 'roadmap' | 'ai-assistant' | 'resume-builder' | 'tool-hub';