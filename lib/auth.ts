import { cookies } from "next/headers"
import { getUserById } from "./db"

export interface SessionUser {
  id: string
  email: string
  companyName: string
}

export async function getSession(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth-token")?.value

    if (!token) {
      return null
    }

    // Decode token (simple base64 for now, use JWT in production)
    const decoded = Buffer.from(token, "base64").toString("utf-8")
    const [email, , userId] = decoded.split(":")

    if (!userId) {
      return null
    }

    // Verify user exists
    const user = await getUserById(userId)
    if (!user) {
      return null
    }

    return {
      id: user.id,
      email: user.email,
      companyName: user.companyName,
    }
  } catch (error) {
    console.error("Error getting session:", error)
    return null
  }
}

export async function requireAuth(): Promise<SessionUser> {
  const session = await getSession()
  if (!session) {
    throw new Error("Unauthorized")
  }
  return session
}

