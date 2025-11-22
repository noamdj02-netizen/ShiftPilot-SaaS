/**
 * Script pour créer un employé de test avec identifiants
 * Usage: npx tsx scripts/create-test-employee.ts
 */

import fs from "fs/promises"
import path from "path"
import crypto from "crypto"

const EMPLOYEES_FILE = path.join(process.cwd(), "data", "employees.json")

async function createTestEmployee() {
  try {
    // Ensure data directory exists
    const dataDir = path.join(process.cwd(), "data")
    await fs.mkdir(dataDir, { recursive: true })

    // Read existing employees
    let employees: any[] = []
    try {
      const data = await fs.readFile(EMPLOYEES_FILE, "utf-8")
      employees = JSON.parse(data)
    } catch {
      employees = []
    }

    // Check if test employee already exists
    const existingTestEmployee = employees.find(
      (e: any) => e.email === "employe@test.com"
    )

    if (existingTestEmployee) {
      console.log("✅ Employé de test existe déjà!")
      console.log("\n📧 Identifiants de connexion:")
      console.log("   Email: employe@test.com")
      console.log(`   Mot de passe: ${existingTestEmployee.password || "test1234"}`)
      console.log("\n🔗 URL de connexion: http://localhost:3000/employee/login")
      return
    }

    // Create test employee
    const testEmployee = {
      id: crypto.randomUUID(),
      firstName: "Jean",
      lastName: "Dupont",
      email: "employe@test.com",
      phone: "+33 6 12 34 56 78",
      role: "Serveur",
      contractType: "CDI",
      weeklyHours: 35,
      hourlyRate: 15,
      password: "test1234", // In production, hash this with bcrypt
      hasCredentials: true,
      credentialsGeneratedAt: new Date().toISOString(),
      notificationPreferences: {
        emailEnabled: true,
        smsEnabled: false,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    employees.push(testEmployee)
    await fs.writeFile(EMPLOYEES_FILE, JSON.stringify(employees, null, 2))

    console.log("✅ Employé de test créé avec succès!")
    console.log("\n📧 Identifiants de connexion:")
    console.log("   Email: employe@test.com")
    console.log("   Mot de passe: test1234")
    console.log("\n🔗 URL de connexion: http://localhost:3000/employee/login")
  } catch (error) {
    console.error("❌ Erreur lors de la création de l'employé de test:", error)
    process.exit(1)
  }
}

createTestEmployee()

