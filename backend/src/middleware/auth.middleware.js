import { clerkClient } from "@clerk/clerk-sdk-node";

export const clerkAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Missing auth token" });
    }

    const token = authHeader.split(" ")[1];

    const session = await clerkClient.verifyToken(token);

    if (!session || !session.sub) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    req.auth = {
      userId: session.sub,
    };

    next();
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(401).json({ success: false, message: error.message });
  }
};
