import { extractJSON } from "../lib/extractJSON.js";
import { ai } from "../lib/llm.js";

export async function analyzeResume(rawText, role) {
  const prompt = `
You are a senior technical interviewer and resume expert.

Analyze the resume and return JSON with:
- summary
- strengths
- weaknesses
- missing_skills_for_role
- resume_improvement_suggestions

Resume:
${rawText}

Target Role: ${role}

Return only JSON.
`;

  const response = await ai.chat.completions.create({
    model: "deepseek/deepseek-chat",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.4
  });
  return extractJSON(response.choices[0].message.content);
}
