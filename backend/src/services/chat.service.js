import { ai } from "../lib/llm.js";
import { interviewPrompt } from "../prompts/promts.js";

export async function interviewChat({
  resumeText,
  role,
  previousMessages,
  userMessage
}) {

  const prompt=interviewPrompt( resumeText,role, previousMessages,userMessage);
  
  const res = await ai.chat.completions.create({
    model: "deepseek/deepseek-chat",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7
  });

  return res.choices[0].message.content;
}
