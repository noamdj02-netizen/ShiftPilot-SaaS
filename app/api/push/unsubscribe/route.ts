import { type NextRequest } from "next/server"
import { createErrorResponse, createSuccessResponse, checkRateLimit } from "@/lib/api-utils"
import path from "path"
import fs from "fs/promises"

const SUBSCRIPTIONS_FILE = path.join(process.cwd(), "data", "push_subscriptions.json")

export async function POST(request: NextRequest) {
  try {
    await checkRateLimit(request)

    const body = await request.json()
    const { subscription } = body

    if (!subscription || !subscription.endpoint) {
      return createErrorResponse(new Error("Subscription invalide"), undefined, 400)
    }

    let subscriptions: any[] = []
    try {
      const data = await fs.readFile(SUBSCRIPTIONS_FILE, "utf-8")
      subscriptions = JSON.parse(data)
    } catch {
      return createSuccessResponse({ success: true, message: "Désabonnement réussi" })
    }

    // Remove subscription
    subscriptions = subscriptions.filter(
      (sub: any) => sub.endpoint !== subscription.endpoint
    )

    await fs.writeFile(SUBSCRIPTIONS_FILE, JSON.stringify(subscriptions, null, 2))

    return createSuccessResponse({
      success: true,
      message: "Désabonnement réussi",
    })
  } catch (error) {
    return createErrorResponse(error)
  }
}

