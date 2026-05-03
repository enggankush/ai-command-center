export type KeywordData = {
  matched: string[];
  missing: string[];
};

export type Sections = {
  skills: boolean;
  education: boolean;
  experience: boolean;
};

export type AnalysisResult = {
  score: number;
  keywords: KeywordData;
  sections: Sections;
  suggestions: string[];
  feedback: string[];
  aiResult: any;
};

export interface SavedResumeResult {
  id?: string;
  fileName?: string;
  jobDescription?: string;
  resumeText?: string;
  userId?: string;
  compareHash?: string;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  static?: {
    score?: number;
    keywords?: KeywordData;
    sections?: Sections;

    suggestions?: string[];
    feedback?: string[];
  };
  aiResult?: any;
  cached?: boolean;
  cachedAt?: Date | null;
}
