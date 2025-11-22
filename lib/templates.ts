import { readFileSync, writeFileSync, existsSync } from "fs"
import { join } from "path"

const TEMPLATES_FILE = join(process.cwd(), "data", "templates.json")

export interface Template {
  id: string
  userId: string
  name: string
  description?: string
  scheduleId?: string // Reference to original schedule
  shifts: Array<{
    employeeId: string
    role: string
    startTime: string
    endTime: string
    date: string
  }>
  createdAt: string
  updatedAt: string
}

function ensureTemplatesFile() {
  const dir = join(process.cwd(), "data")
  if (!existsSync(dir)) {
    const fs = require("fs")
    fs.mkdirSync(dir, { recursive: true })
  }
  if (!existsSync(TEMPLATES_FILE)) {
    writeFileSync(TEMPLATES_FILE, JSON.stringify([], null, 2))
  }
}

export async function getTemplates(userId?: string): Promise<Template[]> {
  ensureTemplatesFile()
  try {
    const data = readFileSync(TEMPLATES_FILE, "utf-8")
    const templates: Template[] = JSON.parse(data)
    if (userId) {
      return templates.filter((t) => t.userId === userId)
    }
    return templates
  } catch (error) {
    return []
  }
}

export async function getTemplateById(id: string): Promise<Template | null> {
  const templates = await getTemplates()
  return templates.find((t) => t.id === id) || null
}

export async function createTemplate(template: Omit<Template, "id" | "createdAt" | "updatedAt">): Promise<Template> {
  ensureTemplatesFile()
  const templates = await getTemplates()

  const newTemplate: Template = {
    ...template,
    id: `template-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  templates.push(newTemplate)
  writeFileSync(TEMPLATES_FILE, JSON.stringify(templates, null, 2))
  return newTemplate
}

export async function deleteTemplate(id: string, userId: string): Promise<boolean> {
  ensureTemplatesFile()
  const templates = await getTemplates()
  const index = templates.findIndex((t) => t.id === id && t.userId === userId)

  if (index === -1) {
    return false
  }

  templates.splice(index, 1)
  writeFileSync(TEMPLATES_FILE, JSON.stringify(templates, null, 2))
  return true
}

