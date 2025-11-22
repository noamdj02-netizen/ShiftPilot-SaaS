/**
 * Système de permissions et rôles
 * Gère les niveaux d'accès pour différents types d'utilisateurs
 */

export enum UserRole {
  ADMIN = "admin",
  MANAGER = "manager",
  EMPLOYEE = "employee",
}

export enum Permission {
  // Plannings
  VIEW_SCHEDULES = "view_schedules",
  CREATE_SCHEDULES = "create_schedules",
  EDIT_SCHEDULES = "edit_schedules",
  DELETE_SCHEDULES = "delete_schedules",
  PUBLISH_SCHEDULES = "publish_schedules",
  
  // Employés
  VIEW_EMPLOYEES = "view_employees",
  CREATE_EMPLOYEES = "create_employees",
  EDIT_EMPLOYEES = "edit_employees",
  DELETE_EMPLOYEES = "delete_employees",
  
  // Analytics
  VIEW_ANALYTICS = "view_analytics",
  VIEW_FINANCIAL_ANALYTICS = "view_financial_analytics",
  
  // Paramètres
  VIEW_SETTINGS = "view_settings",
  EDIT_SETTINGS = "edit_settings",
  MANAGE_COMPANY = "manage_company",
  
  // Communication
  SEND_EMAILS = "send_emails",
  SEND_NOTIFICATIONS = "send_notifications",
  
  // Shifts
  VIEW_OWN_SHIFTS = "view_own_shifts",
  REQUEST_SHIFT_CHANGE = "request_shift_change",
  ACCEPT_SHIFT_CHANGE = "accept_shift_change",
  
  // Disponibilités
  MANAGE_AVAILABILITY = "manage_availability",
  VIEW_AVAILABILITIES = "view_availabilities",
}

const rolePermissions: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: [
    // Admin a tous les droits
    ...Object.values(Permission),
  ],
  
  [UserRole.MANAGER]: [
    Permission.VIEW_SCHEDULES,
    Permission.CREATE_SCHEDULES,
    Permission.EDIT_SCHEDULES,
    Permission.DELETE_SCHEDULES,
    Permission.PUBLISH_SCHEDULES,
    Permission.VIEW_EMPLOYEES,
    Permission.CREATE_EMPLOYEES,
    Permission.EDIT_EMPLOYEES,
    Permission.VIEW_ANALYTICS,
    Permission.VIEW_SETTINGS,
    Permission.EDIT_SETTINGS,
    Permission.SEND_EMAILS,
    Permission.SEND_NOTIFICATIONS,
    Permission.VIEW_AVAILABILITIES,
  ],
  
  [UserRole.EMPLOYEE]: [
    Permission.VIEW_OWN_SHIFTS,
    Permission.REQUEST_SHIFT_CHANGE,
    Permission.MANAGE_AVAILABILITY,
  ],
}

export function hasPermission(userRole: UserRole, permission: Permission): boolean {
  const permissions = rolePermissions[userRole] || []
  return permissions.includes(permission)
}

export function hasAnyPermission(userRole: UserRole, permissions: Permission[]): boolean {
  return permissions.some((permission) => hasPermission(userRole, permission))
}

export function hasAllPermissions(userRole: UserRole, permissions: Permission[]): boolean {
  return permissions.every((permission) => hasPermission(userRole, permission))
}

export function getRolePermissions(role: UserRole): Permission[] {
  return rolePermissions[role] || []
}

