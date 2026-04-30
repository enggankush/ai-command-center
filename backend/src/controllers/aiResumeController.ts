import { Response, NextFunction } from "express";
import ResumeModel from "../models/aiResume";
import resHandler from "../middlewares/res-hadler";
import {
  analyzeATS,
  detectSections,
  extractTextFromFile,
  generateSuggestions,
  matchKeywords,
} from "../services/resume/customAnalyzerService";

export const analyzeResume = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  try {
    const file = req.file;
    const jobDescription = req.body.jobDescription;

    if (!file) {
      return resHandler.error(res, {
        msg: "No file uploaded",
        code: 400,
      });
    }

    // 1️⃣ Extract text
    const resumeText = await extractTextFromFile(file);

    // 2️⃣ Keyword matching
    const keywords = matchKeywords(resumeText, jobDescription);

    // 3️⃣ Section detection
    const sections = detectSections(resumeText);

    // 4️⃣ ATS score
    const score = analyzeATS({ keywords, sections });

    // 5️⃣ Suggestions
    const suggestions = generateSuggestions({ keywords, sections });

    // 6️⃣ AI feedback (temporary)
    const feedback = [
      "Improve action verbs in experience section",
      "Add more quantified achievements",
    ];

    // ✅ 7️⃣ Save to DB
    const saved = await ResumeModel.create({
      fileName: file.originalname,
      resumeText,
      jobDescription,
      score,
      keywords,
      sections,
      suggestions,
      feedback,
    });

    // ✅ Return saved data
    return resHandler.success(res, {
      data: saved,
      msg: "Resume analyzed successfully",
    });
  } catch (error: any) {
    console.error(error);
    next(error);
  }
};
