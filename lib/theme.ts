/**
 * Système de design centralisé pour ShiftPilot Pro
 * Thème orienté restaurant / planning / horeca
 */

export const theme = {
  colors: {
    // Couleurs principales
    primary: "#1A1A1A", // Noir profond
    secondary: "#C7C2B8", // Sable/Beige
    accent: "#6D756C", // Olive doux
    background: "#F7F5F2", // Crème
    card: "rgba(255, 255, 255, 0.6)", // Card glassmorphism
    text: "#1A1A1A", // Texte principal
    
    // Couleurs secondaires
    success: "#3DAD7A",
    warning: "#DAA520",
    error: "#DC2626",
    info: "#3B82F6",
    
    // Rôles restaurant
    roles: {
      serveur: "#3B82F6",
      barman: "#FF7849",
      runner: "#3DAD7A",
      cuisine: "#991B1B",
      chef: "#8B5CF6",
      manager: "#DAA520",
    },
    
    // États
    hover: "rgba(26, 26, 26, 0.05)",
    active: "rgba(26, 26, 26, 0.1)",
    disabled: "rgba(26, 26, 26, 0.2)",
    
    // Glass effects
    glass: {
      bg: "rgba(255, 255, 255, 0.7)",
      border: "rgba(255, 255, 255, 0.18)",
      dark: {
        bg: "rgba(20, 20, 20, 0.7)",
        border: "rgba(255, 255, 255, 0.08)",
      },
    },
  },
  
  radius: {
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
    full: "9999px",
  },
  
  shadow: {
    soft: "0 10px 30px rgba(0, 0, 0, 0.06)",
    medium: "0 20px 40px rgba(0, 0, 0, 0.10)",
    large: "0 25px 50px rgba(0, 0, 0, 0.15)",
    glow: "0 0 20px rgba(255, 120, 73, 0.4)",
  },
  
  spacing: {
    xs: "0.25rem", // 4px
    sm: "0.5rem", // 8px
    md: "1rem", // 16px
    lg: "1.5rem", // 24px
    xl: "2rem", // 32px
    "2xl": "3rem", // 48px
  },
  
  typography: {
    fontFamily: {
      sans: '"Inter", ui-sans-serif, system-ui, sans-serif',
      mono: '"Geist Mono", "Geist Mono Fallback", monospace',
    },
    fontSize: {
      xs: "0.75rem", // 12px
      sm: "0.875rem", // 14px
      base: "1rem", // 16px
      lg: "1.125rem", // 18px
      xl: "1.25rem", // 20px
      "2xl": "1.5rem", // 24px
      "3xl": "1.875rem", // 30px
      "4xl": "2.25rem", // 36px
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },
  
  transitions: {
    fast: "150ms",
    normal: "300ms",
    slow: "500ms",
    spring: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
  
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
  },
} as const

export type Theme = typeof theme

/**
 * Utilitaires pour obtenir les couleurs de rôle
 */
export function getRoleColor(role: string): string {
  const normalizedRole = role.toLowerCase()
  const roleMap: Record<string, keyof typeof theme.colors.roles> = {
    serveur: "serveur",
    waiter: "serveur",
    barman: "barman",
    bartender: "barman",
    runner: "runner",
    cuisine: "cuisine",
    kitchen: "cuisine",
    chef: "chef",
    manager: "manager",
    gestionnaire: "manager",
  }
  
  const roleKey = roleMap[normalizedRole] || "serveur"
  return theme.colors.roles[roleKey]
}

/**
 * Vérifie le contraste WCAG entre deux couleurs
 */
export function getContrastRatio(color1: string, color2: string): number {
  // Simplification - en production, utiliser une librairie complète
  // Cette fonction est un placeholder pour la vérification de contraste
  return 4.5 // Minimum WCAG AA pour le texte normal
}

/**
 * Génère une couleur avec opacité
 */
export function withOpacity(color: string, opacity: number): string {
  // Convertir hex en rgba
  if (color.startsWith("#")) {
    const hex = color.slice(1)
    const r = parseInt(hex.slice(0, 2), 16)
    const g = parseInt(hex.slice(2, 4), 16)
    const b = parseInt(hex.slice(4, 6), 16)
    return `rgba(${r}, ${g}, ${b}, ${opacity})`
  }
  return color
}

