import { type NextRequest } from "next/server"
import { createErrorResponse, createSuccessResponse, checkRateLimit } from "@/lib/api-utils"
import { requireAuth } from "@/lib/auth"

interface EmailHistory {
  id: string
  employeeId: string
  employeeName: string
  employeeEmail: string
  subject: string
  message: string
  sentAt: string
  status: "sent" | "error"
  readAt?: string
}

// In production, store in database
// For now, using in-memory storage
const emailHistory: EmailHistory[] = []

export async function GET(request: NextRequest) {
  try {
    await checkRateLimit(request)
    const user = await requireAuth(request)
    if (!user) {
      return createErrorResponse(new Error("Non authentifié"), undefined, 401)
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get("limit") || "50")
    const offset = parseInt(searchParams.get("offset") || "0")

    // Filter by user (in production, add userId filter)
    const userEmails = emailHistory
      .sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime())
      .slice(offset, offset + limit)

    return createSuccessResponse({
      emails: userEmails,
      total: emailHistory.length,
      limit,
      offset,
    })
  } catch (error) {
    return createErrorResponse(error)
  }
}

// Helper function to add email to history (called from email route)
export function addEmailToHistory(email: EmailHistory) {
  emailHistory.push(email)
  // Keep only last 1000 emails in memory
  if (emailHistory.length > 1000) {
    emailHistory.shift()
  }
}

