// /services/resumeAnalyzer.ts
// Store this structured output into DB
const prompt_1 = `
You are an expert technical interviewer and resume analyzer.

Analyze the following resume and return structured JSON with:

1. candidate_profile_summary
2. skills (grouped by category)
3. projects (title, tech stack, explanation)
4. experience summary
5. strengths
6. weaknesses
7. missing_skills_for_role

Resume:
${resumeText}

Target Role:
${role}

Return ONLY valid JSON.
`;



// Now generate role-based corrections & suggestions.
const prompt_2 = `
You are a senior ${role} interviewer.

Given this resume analysis:

${JSON.stringify(resumeAnalysis)}

Suggest:
1. Resume improvements
2. Skills to add
3. Projects to improve
4. How to rewrite weak points
5. Career advice

Be precise and actionable.
`;


// This is where your project becomes elite.
const prompt_3 = `
You are a senior technical interviewer.

Based on this resume:

${JSON.stringify(resumeAnalysis)}

Generate:

1. 15 interview questions (easy → advanced)
2. Provide model answers
3. Follow-up questions for each
4. Tricky edge cases
5. Real-world scenarios

Role: ${role}

Return JSON.
`;


// User message
//     ↓
// Fetch Resume Context + Chat History
//     ↓
// Construct AI Prompt
//     ↓
// LLM Response
//     ↓
// Store messages in DB
//     ↓
// Return to frontend


// Prompt Engineering for Chat (This is critical)
const prompt_4 = `
You are an elite technical interviewer and mentor.

Candidate Resume Context:
${resumeSummary}

Previous Chat:
${lastMessages}

User Question:
${userMessage}

Your goals:
1. Ask intelligent follow-up questions
2. Identify weaknesses
3. Improve answers
4. Teach concepts deeply
5. Simulate real interview pressure

Be strict but supportive.
`;


// If user answer is weak:
//     ask deeper conceptual questions
// Else if user answer is good:
//     increase difficulty
// Else:
//     change topic

const prompt=`
Evaluate user's answer and decide:

1. Ask follow-up
2. Increase difficulty
3. Change topic

User answer:
${message}

Resume context:
${resumeContext}
`
