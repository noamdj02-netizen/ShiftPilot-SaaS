import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth-token")
  const employeeSession = request.cookies.get("employee_session")
  const { pathname } = request.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = ["/", "/login", "/signup", "/auth-select", "/employee/login"]
  const isPublicRoute = publicRoutes.includes(pathname)

  // Dashboard routes require manager authentication
  const isDashboardRoute = pathname.startsWith("/dashboard")

  // Employee routes require employee authentication
  const isEmployeeRoute = pathname.startsWith("/employee") && pathname !== "/employee/login"

  // If accessing dashboard without manager token, redirect to login
  if (isDashboardRoute && !token) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // If accessing employee route without employee session, redirect to employee login
  if (isEmployeeRoute && !employeeSession) {
    const loginUrl = new URL("/employee/login", request.url)
    loginUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // If accessing login/signup with manager token, redirect to dashboard
  if ((pathname === "/login" || pathname === "/signup") && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // If accessing employee/login with employee session, redirect to employee dashboard
  if (pathname === "/employee/login" && employeeSession) {
    return NextResponse.redirect(new URL("/employee", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}

