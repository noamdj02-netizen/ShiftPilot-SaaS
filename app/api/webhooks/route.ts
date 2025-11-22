import { type NextRequest } from "next/server"
import { createErrorResponse, createSuccessResponse, checkRateLimit } from "@/lib/api-utils"
import { requireAuth } from "@/lib/auth"
import { promises as fs } from "fs"
import path from "path"
import { z } from "zod"
import crypto, { randomUUID } from "crypto"

const webhooksFile = path.join(process.cwd(), "data", "webhooks.json")

interface Webhook {
  id: string
  userId: string
  url: string
  secret: string
  events: string[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

async function readWebhooks(): Promise<Webhook[]> {
  try {
    const data = await fs.readFile(webhooksFile, "utf-8")
    return JSON.parse(data)
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      await fs.writeFile(webhooksFile, JSON.stringify([], null, 2), "utf-8")
      return []
    }
    throw error
  }
}

async function writeWebhooks(webhooks: Webhook[]): Promise<void> {
  await fs.writeFile(webhooksFile, JSON.stringify(webhooks, null, 2), "utf-8")
}

export async function sendWebhook(webhook: Webhook, event: string, data: any) {
  try {
    const payload = JSON.stringify({
      event,
      data,
      timestamp: new Date().toISOString(),
    })

    const signature = crypto
      .createHmac("sha256", webhook.secret)
      .update(payload)
      .digest("hex")

    const response = await fetch(webhook.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-ShiftPilot-Signature": signature,
        "X-ShiftPilot-Event": event,
      },
      body: payload,
    })

    return response.ok
  } catch (error) {
    console.error(`Webhook error for ${webhook.url}:`, error)
    return false
  }
}

const webhookSchema = z.object({
  url: z.string().url(),
  events: z.array(z.string()).min(1),
})

export async function POST(request: NextRequest) {
  try {
    await checkRateLimit(request)
    const user = await requireAuth(request)
    if (!user) {
      return createErrorResponse(new Error("Non authentifié"), undefined, 401)
    }

    const body = await webhookSchema.parseAsync(await request.json())

    const webhooks = await readWebhooks()
    const secret = crypto.randomBytes(32).toString("hex")

    const newWebhook: Webhook = {
      id: randomUUID(),
      userId: user.id,
      url: body.url,
      secret,
      events: body.events,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    webhooks.push(newWebhook)
    await writeWebhooks(webhooks)

    return createSuccessResponse({
      success: true,
      webhook: {
        ...newWebhook,
        secret, // Return secret only once for user to save
      },
      message: "Webhook créé avec succès",
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return createErrorResponse(new Error("Données invalides"), error.errors, 400)
    }
    return createErrorResponse(error)
  }
}

export async function GET(request: NextRequest) {
  try {
    await checkRateLimit(request)
    const user = await requireAuth(request)
    if (!user) {
      return createErrorResponse(new Error("Non authentifié"), undefined, 401)
    }

    const webhooks = await readWebhooks()
    const userWebhooks = webhooks
      .filter((w) => w.userId === user.id)
      .map(({ secret, ...webhook }) => webhook) // Don't return secrets

    return createSuccessResponse({
      webhooks: userWebhooks,
      total: userWebhooks.length,
    })
  } catch (error) {
    return createErrorResponse(error)
  }
}

