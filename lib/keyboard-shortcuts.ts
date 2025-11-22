/**
 * Raccourcis clavier globaux pour ShiftPilot
 */

export type KeyboardShortcut = {
  keys: string[]
  description: string
  action: () => void
  global?: boolean // Si true, fonctionne partout dans l'app
}

export const keyboardShortcuts = {
  search: {
    keys: ["Meta", "K"],
    description: "Ouvrir la recherche",
    global: true,
  },
  newSchedule: {
    keys: ["Meta", "N"],
    description: "Nouveau planning",
    global: true,
  },
  newEmployee: {
    keys: ["Meta", "E"],
    description: "Nouvel employé",
    global: true,
  },
  dashboard: {
    keys: ["Meta", "D"],
    description: "Aller au dashboard",
    global: true,
  },
  escape: {
    keys: ["Escape"],
    description: "Fermer modals/menus",
    global: true,
  },
} as const

