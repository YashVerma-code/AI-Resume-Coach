import { prisma } from "../lib/prisma.js"
import { roleMap } from "../lib/rolemap.js";
import { generateInterviewQA } from "../services/interviewGenerator.service.js";
import { analyzeResume } from "../services/resumeAnalyzer.service.js";

export const createUploadedFile = async (req, res) => {
    let resumeId = null;
    try {

        const { fileName, rawText, role } = req.body;
        const clerkId = req.auth.userId;
        if (!fileName || !rawText || !role) {
            return res.status(400).json({
                success: false,
                message: "fileName, rawText and role are required",
            });
        }

        const prismaRole = roleMap[role];

        if (!prismaRole) {
            return res.status(400).json({
                success: false,
                message: "Invalid role selected",
            });
        }

        const user = await prisma.user.findUnique({
            where: { clerkId },
        });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const file = await prisma.resume.create({
            data: {
                fileName,
                rawText,
                role: prismaRole,
                userId: user.id,
                status: "PROCESSING"
            },
        });

        resumeId = file.id;
        const analysis = await analyzeResume(rawText, role);

        await prisma.feedback.create({
            data: {
                resumeId: file.id,
                strengths: analysis.strengths?.join("\n"),
                weaknesses: analysis.weaknesses?.join("\n"),
                suggestions: analysis.resume_improvement_suggestions?.join("\n")
            }
        })

        const question = await generateInterviewQA(rawText, role);
        const chat = await prisma.chat.create({
            data: { resumeId: file.id }
        });

        if (!chat) {
            return res.status(400).json({ success: false, message: "Chat session is not created!" });
        }

        await prisma.message.create({
            data: {
                chatId: chat.id,
                role: "assistant",
                content: question.question
            }
        });

        await prisma.resume.update({
            where: { id: file.id },
            data: {
                status: "UPLOADED"
            },
        });

        return res.status(201).json({
            success: true,
            message: "Resume uploaded successfully",
            file,
            chatId: chat.id
        });

    } catch (error) {
        console.error("Upload error:", error);
        await prisma.resume.update({
            where: { id: resumeId },
            data: {
                status: "ERROR"
            },
        });
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const getFiles = async (req, res) => {
    try {
        const clerkId = req.auth.userId;

        if (!clerkId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const user = await prisma.user.findUnique({
            where: { clerkId }
        })
        if (!user) return res.status(404).json({ success: false, message: "User not found !" });

        const files = await prisma.resume.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' }
        })

        res.status(200).json({
            success: true,
            message: 'Successfully fetched the resumes',
            files
        })
    } catch (error) {
        console.log("Error occured: ", error.message);

        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const deleteResume = async (req, res) => {
    try {
        const { id } = req.params; // resumeId
        const clerkId = req.auth.userId; // from clerkAuth middleware

        if (!id) {
            return res.status(400).json({ success: false, message: "Resume ID missing" });
        }

        const user = await prisma.user.findUnique({
            where: { clerkId },
        });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const resume = await prisma.resume.findFirst({
            where: {
                id,
                userId: user.id,
            },
        });

        if (!resume) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to delete this resume",
            });
        }

        await prisma.resume.delete({
            where: { id },
        });

        return res.status(200).json({
            success: true,
            message: "Resume and all related data deleted successfully",
        });

    } catch (error) {
        console.error("Delete error:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const getResumeStats = async (req, res) => {
    try {
        const clerkId = req.auth.userId;

        if (!clerkId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const user = await prisma.user.findUnique({
            where: { clerkId },
        });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const resumes = await prisma.resume.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                fileName: true,
                createdAt: true,
                role: true,
                status: true,
                chat: true // enable this once role column exists
            },
        });

        //  Role Distribution (Pie Chart)
        const roleStatsRaw = await prisma.resume.groupBy({
            by: ["role"],
            where: { userId: user.id },
            _count: { role: true },
        });

        const byRole = roleStatsRaw.map(r => ({
            role: r.role,
            count: r._count.role,
        }));

        //  Upload Timeline (Bar Chart)
        const timelineRaw = await prisma.$queryRawUnsafe(`
      SELECT 
        TO_CHAR("createdAt", 'YYYY-MM-DD') AS date,
        COUNT(*)::int AS count
      FROM "Resume"
      WHERE "userId" = $1
      GROUP BY date
      ORDER BY date ASC;
    `, user.id);

        const byDate = timelineRaw.map(d => ({
            date: d.date,
            count: d.count,
        }));

        return res.status(200).json({
            success: true,
            byRole,
            byDate,
            resumes,
        });

    } catch (error) {
        console.error("Stats error:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};
