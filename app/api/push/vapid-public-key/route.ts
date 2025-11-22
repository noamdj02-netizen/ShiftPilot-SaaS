import { type NextRequest } from "next/server"
import { createSuccessResponse } from "@/lib/api-utils"

// VAPID keys must be set in environment variables
// Generate with: npx web-push generate-vapid-keys
const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY

export async function GET(request: NextRequest) {
  if (!VAPID_PUBLIC_KEY) {
    return Response.json(
      { error: "VAPID_PUBLIC_KEY not configured" },
      { status: 500 }
    )
  }

  return createSuccessResponse({
    publicKey: VAPID_PUBLIC_KEY,
  })
}

