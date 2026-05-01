import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";

interface KeywordData {
  matched: string[];
  missing: string[];
}

interface Sections {
  skills: boolean;
  education: boolean;
  experience: boolean;
}

const STOPWORDS = new Set<string>([
  "the",
  "and",
  "for",
  "with",
  "from",
  "that",
  "this",
  "are",
  "have",
  "has",
  "was",
  "were",
  "will",
  "not",
  "but",
  "all",
  "any",
  "can",
  "may",
  "also",
  "such",
  "into",
  "over",
  "more",
  "than",
  "when",
  "what",
  "which",
  "who",
  "whom",
  "whose",
  "why",
  "how",
  "where",
  "because",
  "while",
  "before",
  "after",
  "during",
  "above",
  "below",
  "between",
  "among",
  "through",
  "within",
  "without",
  "about",
  "like",
  "other",
  "these",
  "those",
  "their",
  "then",
  "there",
  "here",
]);

const TECH_KEYWORDS = new Set<string>([
  "javascript",
  "typescript",
  "react",
  "node",
  "express",
  "graphql",
  "docker",
  "kubernetes",
  "aws",
  "azure",
  "gcp",
  "python",
  "java",
  "sql",
  "nosql",
  "postgresql",
  "mongodb",
  "redis",
  "git",
  "linux",
  "rest",
  "api",
  "microservices",
  "ci",
  "cd",
  "testing",
  "jest",
  "cypress",
  "webpack",
  "babel",
  "frontend",
  "backend",
  "fullstack",
  "devops",
  "security",
  "cloud",
  "machine",
  "learning",
  "ai",
  "data",
  "analytics",
]);

export const extractTextFromFile = async (file: Express.Multer.File) => {
  console.log("Parsing file:", file.originalname);

  // ✅ PDF
  if (file.mimetype === "application/pdf") {
    const parser = new PDFParse({ data: file.buffer });
    const result = await parser.getText();
    console.log(result.text);
    return result.text;
  }

  // ✅ DOCX
  if (
    file.mimetype ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const result = await mammoth.extractRawText({
      buffer: file.buffer,
    });
    return result.value;
  }

  throw new Error("Unsupported file type");
};

export const analyzeATS = ({
  keywords,
  sections,
}: {
  keywords: KeywordData;
  sections: Sections;
}): number => {
  let score = 100;

  // Keyword penalty
  score -= (keywords.missing?.length || 0) * 2;

  // Section penalty
  Object.values(sections).forEach((v: boolean) => {
    if (!v) score -= 10;
  });

  return Math.max(score, 0);
};

export const matchKeywords = (resume: string, jd: string) => {
  const cleanWords = (text: string) =>
    text
      .toLowerCase()
      .split(/\W+/)
      .filter(
        (word) =>
          word.length > 2 && !STOPWORDS.has(word) && TECH_KEYWORDS.has(word),
      );

  const resumeWords = new Set(cleanWords(resume));
  const jdWords = new Set(cleanWords(jd));

  const matched = [...jdWords].filter((word) => resumeWords.has(word));
  const missing = [...jdWords].filter((word) => !resumeWords.has(word));

  return { matched, missing };
};

export const detectSections = (text: string) => {
  const lower = text.toLowerCase();

  return {
    skills: lower.includes("skills"),
    education: lower.includes("education"),
    experience: lower.includes("experience"),
  };
};

export const generateSuggestions = ({
  keywords,
  sections,
}: {
  keywords: KeywordData;
  sections: Sections;
}): string[] => {
  const suggestions: string[] = [];

  if ((keywords.missing?.length || 0) > 0) {
    suggestions.push(
      `Add missing keywords from job description (${keywords.missing.length} missing)`,
    );
  }

  if (!sections.skills) {
    suggestions.push(
      "Add a dedicated Skills section to highlight technical abilities",
    );
  }

  if (!sections.experience) {
    suggestions.push(
      "Include a detailed work experience section with achievements",
    );
  }

  if (!sections.education) {
    suggestions.push(
      "Add an Education section with degrees and certifications",
    );
  }

  return suggestions;
};
