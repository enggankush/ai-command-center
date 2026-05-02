import ResumeModel from "../../models/aiResume";
import {
  extractTextFromFile,
  matchKeywords,
  detectSections,
  analyzeATS,
  generateSuggestions,
} from "./customAnalyzerService";
import analyzeWithAI from "../../ai-services/aiAtsService";
import { normalizeText, mapSaved } from "./uitls";

export interface SavedResumeResult {
  id?: string;
  fileName?: string;
  jobDescription?: string;
  resumeText?: string;
  userId?: string;
  compareHash?: string;
  lastComparedAt?: Date | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  static?: {
    score?: number;
    keywords?: {
      matched?: string[];
      missing?: string[];
    };
    sections?: {
      skills?: boolean;
      education?: boolean;
      experience?: boolean;
    };
    suggestions?: string[];
    feedback?: string[];
  };
  aiResult?: any;
  cached?: boolean;
  cachedAt?: Date | null;
}

export const analyzeAndSaveResume = async (
  file: Express.Multer.File,
  jobDescription: string,
  options?: { force?: boolean },
): Promise<SavedResumeResult> => {
  const resumeText = await extractTextFromFile(file);

  const hash = normalizeText(resumeText, jobDescription);

  // check for existing record with same hash
  const existing = await ResumeModel.findOne({ compareHash: hash }).sort({
    updatedAt: -1,
  });

  if (existing && !options?.force) {
    return {
      ...mapSaved(existing),
      aiResult: existing.aiResult || null,
      cached: true,
      cachedAt: existing.lastComparedAt || existing.updatedAt,
    };
  }

  // static analysis
  let keywords = matchKeywords(resumeText, jobDescription);
  let sections = detectSections(resumeText);
  let score = analyzeATS({ keywords, sections });
  let suggestions = generateSuggestions({ keywords, sections });
  let feedback: string[] = [];
  let aiResult = null as any;

  // try AI enhanced analysis
  try {
    aiResult = await analyzeWithAI(resumeText, jobDescription);
    if (aiResult) {
      score =
        typeof aiResult.atsScore === "number"
          ? Math.max(0, Math.min(100, Math.round(aiResult.atsScore)))
          : score;
      if (aiResult.keywordAnalysis) {
        keywords = {
          matched: aiResult.keywordAnalysis.matched || [],
          missing: aiResult.keywordAnalysis.missing || [],
        };
      }
      if (aiResult.sectionAnalysis) {
        sections = {
          skills: !!aiResult.sectionAnalysis.skills?.present,
          education: !!aiResult.sectionAnalysis.education?.present,
          experience: !!aiResult.sectionAnalysis.experience?.present,
        };
      }
      suggestions = aiResult.suggestions || suggestions;
      if (aiResult.summary) feedback = [aiResult.summary];
    }
  } catch (err) {
    console.warn("AI analysis failed, falling back to static analysis", err);
  }

  const toSave: any = {
    fileName: file.originalname,
    resumeText,
    jobDescription,
    score,
    keywords,
    sections,
    suggestions,
    feedback,
    compareHash: hash,
    lastComparedAt: new Date(),
  };

  if (aiResult) {
    toSave.aiResult = {
      atsScore: aiResult.atsScore,
      overallScore: aiResult.overallScore,
      sectionAnalysis: aiResult.sectionAnalysis,
      keywordAnalysis: aiResult.keywordAnalysis,
      suggestions: aiResult.suggestions,
      summary: aiResult.summary,
      raw: aiResult,
    };
  }

  let savedDoc;
  if (existing) {
    // update existing record
    savedDoc = await ResumeModel.findByIdAndUpdate(existing._id, toSave, {
      returnDocument: "after",
    });
  } else {
    savedDoc = await ResumeModel.create(toSave);
  }

  return {
    ...mapSaved(savedDoc),
    aiResult: aiResult || null,
    cached: false,
    cachedAt: null,
  };
};

export default analyzeAndSaveResume;

export const recompareById = async (
  id: string,
  options?: { force?: boolean },
) => {
  const existing = await ResumeModel.findById(id);
  if (!existing) throw new Error("Resume not found");

  const resumeText = existing.resumeText;
  const jobDescription = existing.jobDescription;

  // reuse normalize/hash
  const hash = existing.compareHash || "";

  // run analysis (AI + static) similar to analyzeAndSaveResume
  let keywords = matchKeywords(resumeText, jobDescription);
  let sections = detectSections(resumeText);
  let score = analyzeATS({ keywords, sections });
  let suggestions = generateSuggestions({ keywords, sections });
  let feedback: string[] = [];
  let aiResult = null as any;

  try {
    aiResult = await analyzeWithAI(resumeText, jobDescription);
    if (aiResult) {
      score =
        typeof aiResult.atsScore === "number"
          ? Math.max(0, Math.min(100, Math.round(aiResult.atsScore)))
          : score;
      if (aiResult.keywordAnalysis) {
        keywords = {
          matched: aiResult.keywordAnalysis.matched || [],
          missing: aiResult.keywordAnalysis.missing || [],
        };
      }
      if (aiResult.sectionAnalysis) {
        sections = {
          skills: !!aiResult.sectionAnalysis.skills?.present,
          education: !!aiResult.sectionAnalysis.education?.present,
          experience: !!aiResult.sectionAnalysis.experience?.present,
        };
      }
      suggestions = aiResult.suggestions || suggestions;
      if (aiResult.summary) feedback = [aiResult.summary];
    }
  } catch (err) {
    console.warn("AI analysis failed during recompare", err);
  }

  const toSave: any = {
    score,
    keywords,
    sections,
    suggestions,
    feedback,
    lastComparedAt: new Date(),
  };

  if (aiResult) {
    toSave.aiResult = {
      atsScore: aiResult.atsScore,
      overallScore: aiResult.overallScore,
      sectionAnalysis: aiResult.sectionAnalysis,
      keywordAnalysis: aiResult.keywordAnalysis,
      suggestions: aiResult.suggestions,
      summary: aiResult.summary,
      raw: aiResult,
    };
  }

  const savedDoc = await ResumeModel.findByIdAndUpdate(existing._id, toSave, {
    returnDocument: "after",
  });

  return {
    ...mapSaved(savedDoc),
    aiResult: aiResult || null,
    cached: false,
    cachedAt: null,
  };
};
