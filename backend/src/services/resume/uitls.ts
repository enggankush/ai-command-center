import crypto from "crypto";

export const normalizeText = (resumeText: string, jd: string) => {
  const normalizeForHash = (s: string) => (s || "").replace(/\s+/g, "").trim();

  const hash = crypto
    .createHash("sha256")
    .update(normalizeForHash(resumeText) + "||" + normalizeForHash(jd || ""))
    .digest("hex");

  return hash;
};

export const mapSaved = (doc: any) => {
  if (!doc) return null;
  const base = {
    id: doc._id?.toString(),
    fileName: doc.fileName,
    jobDescription: doc.jobDescription,
    resumeText: doc.resumeText,
    userId: doc.userId,
    compareHash: doc.compareHash,
    lastComparedAt: doc.lastComparedAt,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };

  const staticPart = {
    score: doc.score,
    keywords: doc.keywords,
    sections: doc.sections,
    suggestions: doc.suggestions,
    feedback: doc.feedback,
  };

  return {
    ...base,
    static: staticPart,
  };
};
