export interface User {
  id: number;
  email: string;
  fullName: string;
  domain?: string;
  experienceLevel?: string;
  cvText?: string;
  cvFileName?: string;
  skillsJson?: string[];
  neuralProfile?: {
    skills: string[];
    experience: string;
    education: string[];
    domains: string[];
    strengths: string[];
    careerGoals: string[];
    matchingKeywords: string[];
    analyzedAt: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Opportunity {
  id: number;
  title: string;
  organization: string;
  type: "INTERNSHIP" | "FELLOWSHIP" | "STUDY_ABROAD" | "GRANT";
  description: string;
  location?: string;
  country?: string;
  deadline?: string;
  salary?: string;
  requirements?: string;
  skills?: string[];
  matchingCriteria?: string[];
  applicationUrl?: string;
  isActive: boolean;
  createdAt: string;
}

export interface UserOpportunityMatch {
  id: number;
  userId: number;
  opportunityId: number;
  matchPercentage: string;
  aiReasoning?: string;
  status: "suggested" | "saved" | "applied" | "rejected";
  createdAt: string;
  opportunity: Opportunity;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatSession {
  id: number;
  userId: number;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}
