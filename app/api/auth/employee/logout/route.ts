import { type NextRequest } from "next/server"
import { createSuccessResponse } from "@/lib/api-utils"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  const cookieStore = await cookies()
  cookieStore.delete("employee_session")

  return createSuccessResponse({
    success: true,
    message: "Déconnexion réussie",
  })
}

