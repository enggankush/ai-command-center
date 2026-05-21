import OpenAI from "openai";
import { AiTodoItem } from "../types/aiTodoType";

const apiKey = process.env.OPENAI_API_KEY || "";

const model = process.env.OPENAI_MODEL || "";

const client = new OpenAI({
  apiKey,
});

export const generateTodosWithAI = async (
  paragraph: string,
): Promise<AiTodoItem[]> => {
  const aiPrompt = `
You are a senior software engineering project assistant.

Your job is to convert messy developer paragraphs into clear, actionable engineering todo tasks.

IMPORTANT RULES:

1. Break the paragraph into multiple atomic tasks.

2. Every task must be actionable and implementation-focused.

3. Convert bugs/problems into fix-oriented tasks.

4. Convert vague descriptions into concrete developer actions.

5. Write todos like real software teams write Jira/Linear tasks.

6. Keep each todo short, clean, and professional.

7. Remove duplicate tasks.

8. Infer hidden engineering tasks if clearly implied.

9. Prioritize based on severity:
   - Bugs, validation, security, broken UX → high
   - Improvements/features → medium
   - Minor enhancements → low

  8. Infer hidden engineering tasks if clearly implied.

  9. Prioritize based on severity:
     - Bugs, validation, security, broken UX → high
     - Improvements/features → medium
     - Minor enhancements → low

  10. Use one of these categories: coding, study, meeting, shopping, health, personal.

  11. Return ONLY valid JSON array.

  12. No markdown.

  13. No explanations.

OUTPUT FORMAT:

[
  {
    "title": "Fix email validation on login form",
    "description": "Update the login form validator to reject invalid email addresses and show a helper message.",
    "priority": "high",
    "category": "coding",
    "dueDate": "2025-10-01",
    "completed": false,
    "source": "ai"
  }
]

USER INPUT:
"""
${paragraph}
"""
`;

  try {
    const response = await client.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content: "You generate structured developer todo tasks.",
        },
        {
          role: "user",
          content: aiPrompt,
        },
      ],
      max_tokens: 900,
      temperature: 0.2,
    });

    const raw = response.choices?.[0]?.message?.content || "";

    // extract JSON safely
    const jsonMatch = raw.match(/\[[\s\S]*\]/);

    if (!jsonMatch) {
      throw new Error("Invalid AI response format");
    }

    const parsed = JSON.parse(jsonMatch[0]) as AiTodoItem[];

    return parsed
      .map((item) => ({
        title: item.title?.trim() ?? "",
        description: item.description?.trim() ?? "",
        priority:
          item.priority === "high" ||
          item.priority === "medium" ||
          item.priority === "low"
            ? item.priority
            : "medium",
        category: item.category?.trim().toLowerCase() || "personal",
        dueDate: item.dueDate?.trim() || undefined,
        completed: false,
        source: "ai" as const,
      }))
      .filter((item) => item.title.length > 0);
  } catch (error) {
    console.error("AI Todo Generation Error:", error);

    return [];
  }
};
