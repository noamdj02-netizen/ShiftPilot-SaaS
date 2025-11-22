import { NextResponse } from "next/server"
import { ZodError } from "zod"

export interface ApiError {
  error: string
  details?: unknown
  statusCode: number
}

export function createErrorResponse(error: unknown, defaultMessage = "Une erreur est survenue"): NextResponse {
  // Log errors in development
  if (process.env.NODE_ENV === "development") {
    console.error("[API Error]", error)
  }

  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        success: false,
        error: "Erreur de validation",
        details: error.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        })),
      },
      { status: 400 }
    )
  }

  if (error instanceof Error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || defaultMessage,
      },
      { status: 500 }
    )
  }

  return NextResponse.json(
    {
      success: false,
      error: defaultMessage,
    },
    { status: 500 }
  )
}

export function createSuccessResponse<T>(data: T, status = 200): NextResponse {
  // Log success in development (optional)
  if (process.env.NODE_ENV === "development" && process.env.DEBUG_API === "true") {
    console.log("[API Success]", { status, data: typeof data === "object" ? JSON.stringify(data).slice(0, 100) : data })
  }
  
  return NextResponse.json(
    {
      success: true,
      ...(typeof data === "object" && data !== null ? data : { data }),
    },
    { status }
  )
}

// Rate limiting helper (simple in-memory version)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

export function checkRateLimit(
  identifier: string,
  maxRequests: number = 10,
  windowMs: number = 60000
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now()
  const record = rateLimitMap.get(identifier)

  if (!record || now > record.resetAt) {
    rateLimitMap.set(identifier, {
      count: 1,
      resetAt: now + windowMs,
    })
    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetAt: now + windowMs,
    }
  }

  if (record.count >= maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: record.resetAt,
    }
  }

  record.count++
  return {
    allowed: true,
    remaining: maxRequests - record.count,
    resetAt: record.resetAt,
  }
}

