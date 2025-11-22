import { type NextRequest } from "next/server"
import { createErrorResponse, createSuccessResponse, checkRateLimit } from "@/lib/api-utils"
import { requireAuth } from "@/lib/auth"
import { promises as fs } from "fs"
import path from "path"
import { z } from "zod"
import { randomUUID } from "crypto"

const availabilityFile = path.join(process.cwd(), "data", "availabilities.json")

export interface Availability {
  id: string
  employeeId: string
  date: string
  type: "available" | "unavailable" | "preferred"
  startTime?: string
  endTime?: string
  reason?: string
  createdAt: string
  updatedAt: string
}

export async function readAvailabilities(): Promise<Availability[]> {
  try {
    const data = await fs.readFile(availabilityFile, "utf-8")
    return JSON.parse(data)
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      await fs.writeFile(availabilityFile, JSON.stringify([], null, 2), "utf-8")
      return []
    }
    throw error
  }
}

async function writeAvailabilities(availabilities: Availability[]): Promise<void> {
  await fs.writeFile(availabilityFile, JSON.stringify(availabilities, null, 2), "utf-8")
}

const availabilitySchema = z.object({
  employeeId: z.string(),
  date: z.string(),
  type: z.enum(["available", "unavailable", "preferred"]),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  reason: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    await checkRateLimit(request)
    const user = await requireAuth(request)
    if (!user) {
      return createErrorResponse(new Error("Non authentifié"), undefined, 401)
    }

    const body = await availabilitySchema.parseAsync(await request.json())

    const availabilities = await readAvailabilities()

    // Check if availability already exists for this date
    const existingIndex = availabilities.findIndex(
      (a) => a.employeeId === body.employeeId && a.date === body.date
    )

    const now = new Date().toISOString()

    if (existingIndex !== -1) {
      // Update existing
      availabilities[existingIndex] = {
        ...availabilities[existingIndex],
        ...body,
        updatedAt: now,
      }
    } else {
      // Create new
      const newAvailability: Availability = {
        id: randomUUID(),
        ...body,
        createdAt: now,
        updatedAt: now,
      }
      availabilities.push(newAvailability)
    }

    await writeAvailabilities(availabilities)

    return createSuccessResponse({
      success: true,
      message: "Disponibilité enregistrée avec succès",
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

    const { searchParams } = new URL(request.url)
    const employeeId = searchParams.get("employeeId")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    let availabilities = await readAvailabilities()

    if (employeeId) {
      availabilities = availabilities.filter((a) => a.employeeId === employeeId)
    }

    if (startDate && endDate) {
      availabilities = availabilities.filter(
        (a) => a.date >= startDate && a.date <= endDate
      )
    }

    return createSuccessResponse({
      availabilities,
      total: availabilities.length,
    })
  } catch (error) {
    return createErrorResponse(error)
  }
}

