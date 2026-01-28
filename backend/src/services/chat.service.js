import { ai } from "../lib/llm.js";

export async function interviewChat({
  resumeText,
  role,
  previousMessages,
  userMessage
}) {
  const prompt = `
You are a strict technical interviewer.

Rules:
- Ask deep follow-up questions.
- Challenge weak answers.
- Ask project-based questions.
- Give feedback.
- Keep interview realistic.

Resume:
${resumeText}

Target Role:
${role}

Conversation so far:
${previousMessages}

Candidate answer:
${userMessage}

Respond with next interview question and feedback.
`;

  const res = await ai.chat.completions.create({
    model: "deepseek/deepseek-chat",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7
  });

  return res.choices[0].message.content;
}
