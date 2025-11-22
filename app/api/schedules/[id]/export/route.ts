import { type NextRequest } from "next/server"
import { createErrorResponse, createSuccessResponse, checkRateLimit } from "@/lib/api-utils"
import { getScheduleById } from "@/lib/db"
import { requireAuth } from "@/lib/auth"
import { format } from "date-fns"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth()

    const { id } = await params
    const { searchParams } = new URL(request.url)
    const formatType = searchParams.get("format") || "pdf"

    const schedule = await getScheduleById(id)

    if (!schedule) {
      return createErrorResponse(new Error("Planning non trouvé"), "Schedule not found")
    }

    // Rate limiting
    const clientId = request.headers.get("x-forwarded-for") || request.ip || "unknown"
    const rateLimit = checkRateLimit(`schedules:export:${clientId}`, 10, 60000)

    if (!rateLimit.allowed) {
      return createErrorResponse(
        new Error("Trop de requêtes. Veuillez réessayer dans quelques instants."),
        "Rate limit exceeded"
      )
    }

    if (formatType === "ical") {
      return generateICal(schedule)
    } else if (formatType === "pdf") {
      return generatePDF(schedule)
    } else {
      return createErrorResponse(new Error("Format non supporté"), "Unsupported format")
    }
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return createErrorResponse(error, "Non autorisé")
    }
    return createErrorResponse(error, "Erreur lors de l'export")
  }
}

function generateICal(schedule: any) {
  const startDate = new Date(schedule.startDate)
  const endDate = new Date(schedule.endDate)

  let ical = "BEGIN:VCALENDAR\n"
  ical += "VERSION:2.0\n"
  ical += "PRODID:-//ShiftPilot//Schedule//EN\n"
  ical += "CALSCALE:GREGORIAN\n"
  ical += "METHOD:PUBLISH\n"

  // Add schedule as an event
  ical += "BEGIN:VEVENT\n"
  ical += `UID:schedule-${schedule.id}@shiftpilot.com\n`
  ical += `DTSTART:${format(startDate, "yyyyMMdd")}\n`
  ical += `DTEND:${format(endDate, "yyyyMMdd")}\n`
  ical += `SUMMARY:${schedule.name}\n`
  ical += `DESCRIPTION:Planning ${schedule.name}\n`
  ical += "END:VEVENT\n"

  // Add individual shifts
  if (schedule.shifts && schedule.shifts.length > 0) {
    schedule.shifts.forEach((shift: any, index: number) => {
      ical += "BEGIN:VEVENT\n"
      ical += `UID:shift-${schedule.id}-${index}@shiftpilot.com\n`
      
      const shiftDate = new Date(shift.date)
      const [startHour, startMin] = (shift.startTime || "09:00").split(":")
      const [endHour, endMin] = (shift.endTime || "17:00").split(":")
      
      const shiftStart = new Date(shiftDate)
      shiftStart.setHours(parseInt(startHour), parseInt(startMin))
      
      const shiftEnd = new Date(shiftDate)
      shiftEnd.setHours(parseInt(endHour), parseInt(endMin))

      ical += `DTSTART:${format(shiftStart, "yyyyMMdd'T'HHmmss")}\n`
      ical += `DTEND:${format(shiftEnd, "yyyyMMdd'T'HHmmss")}\n`
      ical += `SUMMARY:Shift - ${shift.role || "Travail"}\n`
      ical += `DESCRIPTION:Planning: ${schedule.name}\n`
      ical += "END:VEVENT\n"
    })
  }

  ical += "END:VCALENDAR"

  return new Response(ical, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="planning-${schedule.id}.ics"`,
    },
  })
}

function generatePDF(schedule: any) {
  // Simple HTML representation (in production, use react-pdf or jspdf)
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Planning ${schedule.name}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        h1 { color: #333; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
      </style>
    </head>
    <body>
      <h1>${schedule.name}</h1>
      <p><strong>Période:</strong> ${format(new Date(schedule.startDate), "d MMMM yyyy")} - ${format(new Date(schedule.endDate), "d MMMM yyyy")}</p>
      <p><strong>Statut:</strong> ${schedule.status}</p>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Heure début</th>
            <th>Heure fin</th>
            <th>Rôle</th>
          </tr>
        </thead>
        <tbody>
          ${schedule.shifts?.map((shift: any) => `
            <tr>
              <td>${format(new Date(shift.date), "d MMM yyyy")}</td>
              <td>${shift.startTime || "N/A"}</td>
              <td>${shift.endTime || "N/A"}</td>
              <td>${shift.role || "N/A"}</td>
            </tr>
          `).join("") || "<tr><td colspan='4'>Aucun shift</td></tr>"}
        </tbody>
      </table>
    </body>
    </html>
  `

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Disposition": `attachment; filename="planning-${schedule.id}.html"`,
    },
  })
}

