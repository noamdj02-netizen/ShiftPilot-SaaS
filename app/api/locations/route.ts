import { type NextRequest } from "next/server"
import { createErrorResponse, createSuccessResponse, checkRateLimit } from "@/lib/api-utils"
import { requireAuth } from "@/lib/auth"
import { promises as fs } from "fs"
import path from "path"
import { z } from "zod"
import { randomUUID } from "crypto"

const locationsFile = path.join(process.cwd(), "data", "locations.json")

export interface Location {
  id: string
  userId: string
  name: string
  address: string
  city: string
  postalCode: string
  country: string
  phone?: string
  email?: string
  timezone: string
  isActive: boolean
  settings: {
    defaultShiftDuration: number
    breakDuration: number
    minEmployeesPerShift: number
    maxEmployeesPerShift: number
  }
  createdAt: string
  updatedAt: string
}

async function readLocations(): Promise<Location[]> {
  try {
    const data = await fs.readFile(locationsFile, "utf-8")
    return JSON.parse(data)
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      await fs.writeFile(locationsFile, JSON.stringify([], null, 2), "utf-8")
      return []
    }
    throw error
  }
}

async function writeLocations(locations: Location[]): Promise<void> {
  await fs.writeFile(locationsFile, JSON.stringify(locations, null, 2), "utf-8")
}

const locationSchema = z.object({
  name: z.string().min(1),
  address: z.string().min(1),
  city: z.string().min(1),
  postalCode: z.string().min(1),
  country: z.string().default("France"),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  timezone: z.string().default("Europe/Paris"),
  settings: z.object({
    defaultShiftDuration: z.number().default(8),
    breakDuration: z.number().default(0.5),
    minEmployeesPerShift: z.number().default(2),
    maxEmployeesPerShift: z.number().default(10),
  }).optional(),
})

export async function POST(request: NextRequest) {
  try {
    await checkRateLimit(request)
    const user = await requireAuth(request)
    if (!user) {
      return createErrorResponse(new Error("Non authentifié"), undefined, 401)
    }

    const body = await locationSchema.parseAsync(await request.json())
    const locations = await readLocations()

    const newLocation: Location = {
      id: randomUUID(),
      userId: user.id,
      ...body,
      isActive: true,
      settings: body.settings || {
        defaultShiftDuration: 8,
        breakDuration: 0.5,
        minEmployeesPerShift: 2,
        maxEmployeesPerShift: 10,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    locations.push(newLocation)
    await writeLocations(locations)

    return createSuccessResponse({
      success: true,
      location: newLocation,
      message: "Établissement créé avec succès",
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

    const locations = await readLocations()
    const userLocations = locations.filter((l) => l.userId === user.id && l.isActive)

    return createSuccessResponse({
      locations: userLocations,
      total: userLocations.length,
    })
  } catch (error) {
    return createErrorResponse(error)
  }
}

