import { prisma } from "../lib/prisma.js";

export async function createUser(req, res) {
    try {
        const payload = req.body;
        const User = await prisma.user.upsert({
            where: { clerkId: payload.id },
            update: {
                email: payload.email_addresses?.[0]?.email_address || "",
                username: payload.username || "",
                photo: payload.profile_image_url || "",
                firstName: payload.first_name || "",
                lastName: payload.last_name || "",
            },
            create: {
                clerkId: payload.id,
                email: payload.email_addresses?.[0]?.email_address || "",
                username: payload.username || "",
                photo: payload.profile_image_url || "",
                firstName: payload.first_name || "",
                lastName: payload.last_name || "",
            },
        })

        return res.status(201).json({ success: true, user: User });
    } catch (error) {
        console.error("Create user error:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
}

export async function updateUser(req, res) {
    try {
        const payload = req.body;

        const user = await prisma.user.update({
            where: { clerkId: payload.id },
            data: {
                email: payload.email_addresses?.[0]?.email_address || "",
                username: payload.username || "",
                photo: payload.profile_image_url || "",
                firstName: payload.first_name || "",
                lastName: payload.last_name || "",
            },
        });

        return res.json({ success: true, user: user });
    } catch (error) {
        console.error("Update user error:", error);
        return res.status(500).json({ success: false, error: "Update failed" });
    }
}

export async function deleteUser(req, res) {
    try {
        const { id } = req.body;

        await prisma.user.delete({
            where: { clerkId: id },
        });

        return res.json({ success: true });
    } catch (error) {
        console.error("Delete user error:", error);
        return res.status(500).json({ success: false, error: "Delete failed" });
    }
}

export async function getUser(req, res) {
    try {
        const { clerkId } = req.query;

        const user = await prisma.user.findUnique({
            where: { clerkId },
            include: {
                resumes: true,
            },
        });
        return res.json({ success: true, user });
    } catch (error) {
        console.error("Get user error:", error);
        return res.status(500).json({ success: false, error: "Fetch failed" });
    }
}
