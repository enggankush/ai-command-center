import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY || "";
const model = process.env.OPENAI_MODEL || "";

const client = new OpenAI({ apiKey });

export interface AiSectionAnalysis {
  present: boolean;
  comments: string;
}

export interface AiAtsResult {
  atsScore: number; // 0-100
  overallScore?: number; // 0-100
  sectionAnalysis: {
    skills: AiSectionAnalysis;
    education: AiSectionAnalysis;
    experience: AiSectionAnalysis;
  };
  keywordAnalysis: {
    matched: string[];
    missing: string[];
  };
  suggestions: string[];
  summary?: string;
}

export const analyzeWithAI = async (
  resumeText: string,
  jobDescription: string,
): Promise<AiAtsResult | null> => {
  if (!apiKey) return null;

  const systemPrompt = `You are an assistant that evaluates a candidate resume against a job description for Applicant Tracking System (ATS) fit. Respond ONLY with valid JSON matching this schema: {"atsScore": number, "overallScore": number, "sectionAnalysis": {"skills": {"present": boolean, "comments": string}, "education": {"present": boolean, "comments": string}, "experience": {"present": boolean, "comments": string}}, "keywordAnalysis": {"matched": string[], "missing": string[]}, "suggestions": string[], "summary": string }`;

  const userPrompt = `Job description:\n
  ${jobDescription} 
  \n\n
  Resume text:\n
  ${resumeText}
  \n\n
  Provide a concise ATS-focused analysis and output only the JSON described.`;

  try {
    const resp = await client.chat.completions.create({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      max_tokens: 900,
      temperature: 0.0,
    });

    const raw =
      resp.choices?.[0]?.message?.content || resp.choices?.[0]?.message;
    const text = typeof raw === "string" ? raw : JSON.stringify(raw);

    // Try to extract JSON from possible surrounding text
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const jsonText = jsonMatch ? jsonMatch[0] : text;

    const parsed = JSON.parse(jsonText) as AiAtsResult;

    // Basic normalization
    parsed.atsScore = Math.max(0, Math.min(100, Math.round(parsed.atsScore)));

    return parsed;
  } catch (err) {
    console.error("AI analysis failed:", err);
    return null;
  }
};

export default analyzeWithAI;
