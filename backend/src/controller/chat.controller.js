import { ai } from "../lib/llm.js";
import { prisma } from "../lib/prisma.js";
import { streamPrompt } from "../prompts/promts.js";
import { interviewChat } from "../services/chat.service.js";

export const chatResponse = async (req, res) => {
    try {
        const { chatId, userMessage } = req.body;

        if (!chatId || !userMessage) {
            return res.status(400).json({
                success: false,
                message: "Chat id and user message are required!"
            })
        }

        // Fetch chat history + resume
        const chat = await prisma.chat.findUnique({
            where: { id: chatId },
            include: {
                messages: { orderBy: { createdAt: "asc" } },
                resume: true
            }
        });

        if (!chat) {
            return res.status(404).json({
                success: false,
                message: "Chat not found "
            })
        }

        const history = chat.messages
            .map(m => `${m.role}: ${m.content}`)
            .join("\n");

        // Call AI
        const reply = await interviewChat({
            resumeText: chat.resume.rawText,
            role: chat.resume.role,
            previousMessages: history,
            userMessage
        });

        // Store messages
        await prisma.message.createMany({
            data: [
                { chatId, role: "user", content: userMessage },
                { chatId, role: "assistant", content: reply }
            ]
        });

        res.json({ success: true, reply });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
}

export const createChat = async (req, res) => {
    const { resumeId } = req.body;

    if (!resumeId) {
        return res.status(400).json({ success: false, message: "Invalid resumeId" });
    }
    const resume = await prisma.resume.findUnique({
        where: { id: resumeId }
    })

    if (!resume) {
        return res.status(404).json({ success: false, message: "Resume not found!" });
    }

    const chat = await prisma.chat.create({
        data: { resumeId: resume.id }
    });

    res.json({ success: true, chatId: chat.id });
}

export const streamResponse = async (req, res) => {
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Transfer-Encoding", "chunked");

    const { chatId, message } = req.body;

    const chat = await prisma.chat.findUnique({
        where: { id: chatId },
        include: {
            messages: { orderBy: { createdAt: "asc" } },
            resume: true
        }
    });

    if (!chat) {
        return res.status(404).end("Invalid chat session");
    }

    await prisma.message.create({
        data: {
            chatId,
            role: "user",
            content: message
        }
    })


    const history = chat.messages
        .map(m => `${m.role}: ${m.content}`)
        .join("\n");

    const prompt=streamPrompt(chat.resume.rawText,history,message);

    const stream = await ai.chat.completions.create({
        model: "deepseek/deepseek-chat",
        messages: [{ role: "user", content: prompt }],
        stream: true
    });
    let fullResponse = "";

    for await (const chunk of stream) {
        const token = chunk.choices?.[0]?.delta?.content || "";
        fullResponse += token;
        res.write(token);
    }

    await prisma.message.create({
        data: {
            chatId,
            role: "assistant",
            content: fullResponse
        }
    })
    res.end();
}

export const getChatHistory = async (req, res) => {
    try {

        const { chatId } = req.params;

        const chat = await prisma.chat.findUnique({
            where: { id: chatId },
            include: {
                messages: { orderBy: { createdAt: "asc" } },
            },
        })
        if (!chat) {
            return res.status(404).json({
                success: false,
                message: "Invalid or expired chat session",
            });
        }
        return res.json({
            success: true,
            messages: chat.messages,
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
}