import { ClerkUserPayload, createUser, deleteUser, updateUser } from "@/lib/actions/user.actions";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest } from "next/server";

export const POST: (req: NextRequest) => Promise<Response> = async (req: NextRequest) => {
  try {
    const evt = await verifyWebhook(req);
    
    const eventType = evt.type;
    const data = evt.data as ClerkUserPayload;
    console.log("Data :", data);
    switch (eventType) {
      case "user.created":
        await createUser(data);
        console.log("User created:", data);
        break;

      case "user.updated":
        await updateUser(data);
        console.log("User updated:", data);
        break;

      case "user.deleted":
        await deleteUser(data);
        console.log("User deleted:", data.id);
        break;

      default:
        console.log(`Unhandled Clerk event type: ${eventType}`);
    }

    return new Response('Webhook received', { status: 200 });
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error verifying webhook', { status: 400 });
  }
};