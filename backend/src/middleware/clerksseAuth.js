import { clerkClient } from "@clerk/clerk-sdk-node";

export const clerkSseAuth = async (req, res, next) => {
  try {
    const token = req.query.token;

    if (!token) {
      return res.status(401).end();
    }

    const session = await clerkClient.verifyToken(token);

    if (!session?.sub) {
      return res.status(401).end();
    }

    req.auth = {
      userId: session.sub,
    };

    next();
  } catch (err) {
    console.error("SSE auth error:", err);
    next(err);
  }
};
