import { type NextRequest } from "next/server"
import { createErrorResponse, createSuccessResponse, checkRateLimit } from "@/lib/api-utils"
import { requireAuth } from "@/lib/auth"
import { promises as fs } from "fs"
import path from "path"
import { z } from "zod"

const locationsFile = path.join(process.cwd(), "data", "locations.json")

async function readLocations() {
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

async function writeLocations(locations: any[]): Promise<void> {
  await fs.writeFile(locationsFile, JSON.stringify(locations, null, 2), "utf-8")
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await checkRateLimit(request)
    const user = await requireAuth(request)
    if (!user) {
      return createErrorResponse(new Error("Non authentifié"), undefined, 401)
    }

    const { id } = await params
    const locations = await readLocations()
    const location = locations.find((l: any) => l.id === id && l.userId === user.id)

    if (!location) {
      return createErrorResponse(new Error("Établissement introuvable"), undefined, 404)
    }

    return createSuccessResponse({ location })
  } catch (error) {
    return createErrorResponse(error)
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await checkRateLimit(request)
    const user = await requireAuth(request)
    if (!user) {
      return createErrorResponse(new Error("Non authentifié"), undefined, 401)
    }

    const { id } = await params
    const body = await request.json()
    const locations = await readLocations()

    const locationIndex = locations.findIndex((l: any) => l.id === id && l.userId === user.id)

    if (locationIndex === -1) {
      return createErrorResponse(new Error("Établissement introuvable"), undefined, 404)
    }

    locations[locationIndex] = {
      ...locations[locationIndex],
      ...body,
      updatedAt: new Date().toISOString(),
    }

    await writeLocations(locations)

    return createSuccessResponse({
      success: true,
      location: locations[locationIndex],
      message: "Établissement mis à jour avec succès",
    })
  } catch (error) {
    return createErrorResponse(error)
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await checkRateLimit(request)
    const user = await requireAuth(request)
    if (!user) {
      return createErrorResponse(new Error("Non authentifié"), undefined, 401)
    }

    const { id } = await params
    const locations = await readLocations()

    const filteredLocations = locations.filter((l: any) => !(l.id === id && l.userId === user.id))

    if (filteredLocations.length === locations.length) {
      return createErrorResponse(new Error("Établissement introuvable"), undefined, 404)
    }

    await writeLocations(filteredLocations)

    return createSuccessResponse({
      success: true,
      message: "Établissement supprimé avec succès",
    })
  } catch (error) {
    return createErrorResponse(error)
  }
}

