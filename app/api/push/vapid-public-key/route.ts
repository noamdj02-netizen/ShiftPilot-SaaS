import { type NextRequest } from "next/server"
import { createSuccessResponse } from "@/lib/api-utils"

// En production, générer les clés VAPID une fois et les stocker dans .env
// Pour le développement, on utilise des clés de test
const VAPID_PUBLIC_KEY =
  process.env.VAPID_PUBLIC_KEY ||
  "BEl62iUYgUivxIkv69yViEuiBIa40HIeXy8kKt2QyU8xK8yK8yK8yK8yK8yK8yK8yK8yK8yK8yK8yK8yK8"

export async function GET(request: NextRequest) {
  return createSuccessResponse({
    publicKey: VAPID_PUBLIC_KEY,
  })
}

