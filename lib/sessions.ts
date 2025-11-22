import { readData, writeData } from "./db"
import { promises as fs } from "fs"
import path from "path"

const DATA_DIR = path.join(process.cwd(), "data")
const SESSIONS_FILE = path.join(DATA_DIR, "sessions.json")

export interface Session {
  id: string
  userId: string
  token: string
  ipAddress?: string
  userAgent?: string
  createdAt: string
  lastActiveAt: string
  expiresAt: string
}

async function ensureSessionsFile() {
  try {
    await fs.access(SESSIONS_FILE)
  } catch {
    await fs.writeFile(SESSIONS_FILE, JSON.stringify([], null, 2), "utf-8")
  }
}

export async function getSessions(): Promise<Session[]> {
  await ensureSessionsFile()
  try {
    const data = await fs.readFile(SESSIONS_FILE, "utf-8")
    return JSON.parse(data) as Session[]
  } catch (error) {
    console.error("Error reading sessions:", error)
    return []
  }
}

export async function getUserSessions(userId: string): Promise<Session[]> {
  const sessions = await getSessions()
  return sessions.filter((s) => s.userId === userId && new Date(s.expiresAt) > new Date())
}

export async function createSession(session: {
  userId: string
  token: string
  ipAddress?: string
  userAgent?: string
}): Promise<Session> {
  const sessions = await getSessions()
  const now = new Date()
  const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) // 30 days

  const newSession: Session = {
    id: Date.now().toString(),
    ...session,
    createdAt: now.toISOString(),
    lastActiveAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
  }

  sessions.push(newSession)
  await fs.writeFile(SESSIONS_FILE, JSON.stringify(sessions, null, 2), "utf-8")
  return newSession
}

export async function updateSessionLastActive(sessionId: string) {
  const sessions = await getSessions()
  const index = sessions.findIndex((s) => s.id === sessionId)

  if (index !== -1) {
    sessions[index].lastActiveAt = new Date().toISOString()
    await fs.writeFile(SESSIONS_FILE, JSON.stringify(sessions, null, 2), "utf-8")
  }
}

export async function deleteSession(sessionId: string) {
  const sessions = await getSessions()
  const filtered = sessions.filter((s) => s.id !== sessionId)
  await fs.writeFile(SESSIONS_FILE, JSON.stringify(filtered, null, 2), "utf-8")
}

export async function deleteUserSessions(userId: string, excludeToken?: string) {
  const sessions = await getSessions()
  const filtered = sessions.filter(
    (s) => s.userId !== userId || (excludeToken && s.token === excludeToken)
  )
  await fs.writeFile(SESSIONS_FILE, JSON.stringify(filtered, null, 2), "utf-8")
}

export async function getSessionByToken(token: string): Promise<Session | null> {
  const sessions = await getSessions()
  return (
    sessions.find((s) => s.token === token && new Date(s.expiresAt) > new Date()) || null
  )
}

