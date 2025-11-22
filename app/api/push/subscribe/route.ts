import { type NextRequest } from "next/server"
import { createErrorResponse, createSuccessResponse, checkRateLimit } from "@/lib/api-utils"
import { requireAuth } from "@/lib/auth"
import path from "path"
import fs from "fs/promises"

const SUBSCRIPTIONS_FILE = path.join(process.cwd(), "data", "push_subscriptions.json")

async function saveSubscription(subscription: any, userId?: string, userType?: string) {
  await fs.mkdir(path.dirname(SUBSCRIPTIONS_FILE), { recursive: true })

  let subscriptions: any[] = []
  try {
    const data = await fs.readFile(SUBSCRIPTIONS_FILE, "utf-8")
    subscriptions = JSON.parse(data)
  } catch {
    subscriptions = []
  }

  // Remove existing subscription for this user
  subscriptions = subscriptions.filter(
    (sub: any) => sub.endpoint !== subscription.endpoint
  )

  // Add new subscription
  subscriptions.push({
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    subscription,
    userId,
    userType,
    createdAt: new Date().toISOString(),
  })

  await fs.writeFile(SUBSCRIPTIONS_FILE, JSON.stringify(subscriptions, null, 2))
}

export async function POST(request: NextRequest) {
  try {
    await checkRateLimit(request)

    const body = await request.json()
    const { subscription, userId, userType } = body

    if (!subscription || !subscription.endpoint) {
      return createErrorResponse(new Error("Subscription invalide"), undefined, 400)
    }

    // Optionally require auth
    let authenticatedUserId = userId
    try {
      const user = await requireAuth(request)
      if (user) {
        authenticatedUserId = user.id
      }
    } catch {
      // Allow subscription without auth for employees
    }

    await saveSubscription(subscription, authenticatedUserId, userType)

    return createSuccessResponse({
      success: true,
      message: "Abonnement push enregistré avec succès",
    })
  } catch (error) {
    return createErrorResponse(error)
  }
}

