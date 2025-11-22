import { promises as fs } from "fs"
import path from "path"

const DATA_DIR = path.join(process.cwd(), "data")
const USERS_FILE = path.join(DATA_DIR, "users.json")
const EMPLOYEES_FILE = path.join(DATA_DIR, "employees.json")
export const SCHEDULES_FILE = path.join(DATA_DIR, "schedules.json")

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR)
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true })
  }
}

// Initialize files if they don't exist
async function initFile(filePath: string, defaultValue: any[] = []) {
  try {
    await fs.access(filePath)
  } catch {
    await fs.writeFile(filePath, JSON.stringify(defaultValue, null, 2), "utf-8")
  }
}

// Initialize all data files
export async function initDatabase() {
  await ensureDataDir()
  await initFile(USERS_FILE, [
    {
      id: "1",
      email: "demo@shiftpilot.com",
      password: "Demo1234!", // In production, hash this
      companyName: "Brasserie Le Central",
      settings: {
        profile: {
          email: "demo@shiftpilot.com",
          companyName: "Brasserie Le Central",
        },
        company: {
          name: "Brasserie Le Central",
          country: "France",
          email: "demo@shiftpilot.com",
        },
        notifications: {
          emailReports: true,
          emailAlerts: true,
          emailScheduleChanges: true,
          emailMarketing: false,
          pushNotifications: true,
        },
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ])
  await initFile(EMPLOYEES_FILE, [])
  await initFile(SCHEDULES_FILE, [])
}

// Generic read function
export async function readData<T>(filePath: string): Promise<T[]> {
  await initDatabase()
  try {
    const data = await fs.readFile(filePath, "utf-8")
    return JSON.parse(data) as T[]
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error)
    return []
  }
}

// Generic write function
export async function writeData<T>(filePath: string, data: T[]): Promise<void> {
  await initDatabase()
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8")
}

// Users
export async function getUsers() {
  return readData<{
    id: string
    email: string
    password: string
    companyName: string
    createdAt: string
  }>(USERS_FILE)
}

export async function getUserByEmail(email: string) {
  const users = await getUsers()
  return users.find((u) => u.email === email)
}

export async function getUserById(id: string) {
  const users = await getUsers()
  return users.find((u) => u.id === id)
}

export async function createUser(user: {
  email: string
  password: string
  companyName: string
}) {
  const users = await getUsers()
  const newUser = {
    id: Date.now().toString(),
    ...user,
    phone: undefined as string | undefined,
    settings: {
      profile: {
        email: user.email,
        companyName: user.companyName,
        phone: undefined,
      },
      company: {
        name: user.companyName,
        address: undefined,
        city: undefined,
        postalCode: undefined,
        country: "France",
        phone: undefined,
        email: user.email,
        website: undefined,
      },
      notifications: {
        emailReports: true,
        emailAlerts: true,
        emailScheduleChanges: true,
        emailMarketing: false,
        pushNotifications: true,
      },
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  users.push(newUser)
  await writeData(USERS_FILE, users)
  return newUser
}

export async function updateUser(
  id: string,
  updates: Partial<{
    email: string
    companyName: string
    phone?: string
    settings?: {
      profile?: {
        email?: string
        companyName?: string
        phone?: string
      }
      company?: {
        name?: string
        address?: string
        city?: string
        postalCode?: string
        country?: string
        phone?: string
        email?: string
        website?: string
      }
      notifications?: {
        emailReports?: boolean
        emailAlerts?: boolean
        emailScheduleChanges?: boolean
        emailMarketing?: boolean
        pushNotifications?: boolean
      }
    }
  }>
) {
  const users = await getUsers()
  const index = users.findIndex((u) => u.id === id)
  if (index === -1) throw new Error("User not found")
  
  const updatedUser = {
    ...users[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  }
  
  users[index] = updatedUser as any // Type assertion needed due to complex nested types
  await writeData(USERS_FILE, users)
  return updatedUser
}

// Employees
export async function getEmployees() {
  return readData<{
    id: string
    firstName: string
    lastName: string
    email?: string
    phone?: string
    role: string
    contractType?: string
    weeklyHours?: number
    hourlyRate?: number
    startDate?: string
    notes?: string
    notificationPreferences?: {
      emailEnabled?: boolean
      smsEnabled?: boolean
    }
    createdAt: string
    updatedAt: string
  }>(EMPLOYEES_FILE)
}

export async function getEmployeeById(id: string) {
  const employees = await getEmployees()
  return employees.find((e) => e.id === id)
}

export async function createEmployee(employee: {
  firstName: string
  lastName: string
  email?: string
  phone?: string
  role: string
  contractType?: string
  weeklyHours?: number
  hourlyRate?: number
  startDate?: string
  notes?: string
  notificationPreferences?: {
    emailEnabled?: boolean
    smsEnabled?: boolean
  }
}) {
  const employees = await getEmployees()
  const newEmployee = {
    id: Date.now().toString(),
    ...employee,
    notificationPreferences: {
      emailEnabled: employee.email ? true : false,
      smsEnabled: employee.phone ? true : false,
      ...employee.notificationPreferences,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  employees.push(newEmployee)
  await writeData(EMPLOYEES_FILE, employees)
  return newEmployee
}

export async function updateEmployee(
  id: string,
  updates: Partial<{
    firstName: string
    lastName: string
    email: string
    phone: string
    role: string
    contractType: string
    weeklyHours: number
    hourlyRate: number
    startDate: string
    notes: string
    notificationPreferences?: {
      emailEnabled?: boolean
      smsEnabled?: boolean
    }
  }>
) {
  const employees = await getEmployees()
  const index = employees.findIndex((e) => e.id === id)
  if (index === -1) throw new Error("Employee not found")
  
  employees[index] = {
    ...employees[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  } as any
  await writeData(EMPLOYEES_FILE, employees)
  return employees[index]
}

export async function deleteEmployee(id: string) {
  const employees = await getEmployees()
  const filtered = employees.filter((e) => e.id !== id)
  await writeData(EMPLOYEES_FILE, filtered)
  return true
}

// Schedules
export async function getSchedules() {
  return readData<{
    id: string
    name: string
    startDate: string
    endDate: string
    status: "draft" | "generating" | "completed" | "published"
    shifts: any[]
    minHoursPerEmployee?: number
    maxHoursPerEmployee?: number
    constraints?: string
    respectPreferences: boolean
    balanceWorkload: boolean
    minimizeCosts: boolean
    createdAt: string
    updatedAt: string
  }>(SCHEDULES_FILE)
}

export async function getScheduleById(id: string) {
  const schedules = await getSchedules()
  return schedules.find((s) => s.id === id)
}

export async function createSchedule(schedule: {
  name: string
  startDate: string
  endDate: string
  status?: "draft" | "generating" | "completed" | "published"
  shifts?: any[]
  minHoursPerEmployee?: number
  maxHoursPerEmployee?: number
  constraints?: string
  respectPreferences?: boolean
  balanceWorkload?: boolean
  minimizeCosts?: boolean
}) {
  const schedules = await getSchedules()
  const newSchedule = {
    id: Date.now().toString(),
    status: "draft" as const,
    shifts: [],
    respectPreferences: true,
    balanceWorkload: true,
    minimizeCosts: false,
    ...schedule,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  schedules.push(newSchedule as any) // Type assertion needed
  await writeData(SCHEDULES_FILE, schedules)
  return newSchedule
}

export async function updateSchedule(
  id: string,
  updates: Partial<{
    name: string
    status: "draft" | "generating" | "completed" | "published"
    shifts: any[]
    updatedAt: string
  }>
) {
  const schedules = await getSchedules()
  const index = schedules.findIndex((s) => s.id === id)
  if (index === -1) throw new Error("Schedule not found")
  
  // Don't allow changing status of published schedules
  if (schedules[index].status === "published" && updates.status && updates.status !== "published") {
    throw new Error("Cannot change status of published schedule")
  }
  
  schedules[index] = {
    ...schedules[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  }
  await writeData(SCHEDULES_FILE, schedules)
  return schedules[index]
}

