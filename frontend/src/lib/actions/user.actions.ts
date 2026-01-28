import { headers } from "next/headers";

export interface ClerkUserPayload {
  id: string;
  email_addresses?: { email_address: string }[];
  username?: string;
  profile_image_url?: string;
  first_name?: string;
  last_name?: string; 
}

export async function createUser(payload: ClerkUserPayload) {
  try {
    const newUser=await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

export async function updateUser(payload: ClerkUserPayload) {
  try {
   const updatedUser= await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/update`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    return updatedUser ? JSON.parse(JSON.stringify(updatedUser)) : null;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}

export async function deleteUser(payload: Pick<ClerkUserPayload, "id">) {
  try {
    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/delete`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: payload.id }),
    });
    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
}


// import { useAuth } from "@clerk/nextjs";

// const { getToken } = useAuth();

// const token = await getToken();

// await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/resume/upload`, {
//   method: "POST",
//   headers: {
//     "Content-Type": "application/json",
//     Authorization: `Bearer ${token}`,
//   },
//   body: JSON.stringify({ fileName, rawText }),
// });

