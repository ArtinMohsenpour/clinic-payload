import type { Access } from 'payload'

export const hasRole = (roles: string[]): Access => {
  return ({ req: { user } }) => {
    if (!user) return false
    return roles.includes(user.role as string)
  }
}

export const adminCeoManager: Access = ({ req: { user } }) => {
  if (!user) return false
  return ['admin', 'ceo', 'manager'].includes(user.role as string)
}

export const adminCeoManagerEditor: Access = ({ req: { user } }) => {
  if (!user) return false
  return ['admin', 'ceo', 'manager', 'content-editor'].includes(user.role as string)
}

export const adminCeoManagerEditorMedical: Access = ({ req: { user } }) => {
  if (!user) return false
  return ['admin', 'ceo', 'manager', 'content-editor', 'nurse', 'doctor', 'accountant', 'stock-clerk'].includes(user.role as string)
}

export const adminCeoManagerMedical: Access = ({ req: { user } }) => {
  if (!user) return false
  return ['admin', 'ceo', 'manager', 'nurse', 'doctor', 'accountant', 'stock-clerk'].includes(user.role as string)
}

export const anyone: Access = () => true
