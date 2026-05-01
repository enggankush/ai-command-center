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

    const resumeText = await extractTextFromFile(file);

    const keywords = matchKeywords(resumeText, jobDescription);

    const sections = detectSections(resumeText);

    const score = analyzeATS({ keywords, sections });

    const suggestions = generateSuggestions({ keywords, sections });

    const feedback = [
      "Improve action verbs in experience section",
      "Add more quantified achievements",
    ];

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

    return resHandler.success(res, {
      data: saved,
      msg: "Resume analyzed successfully",
    });
  } catch (error: any) {
    console.error(error);
    next(error);
  }
};
