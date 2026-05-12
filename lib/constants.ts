export const CATEGORIES = [
  { value: 'WORK', label: 'Trabajo', color: 'var(--color-work)' },
  { value: 'HOME', label: 'Hogar', color: 'var(--color-home)' },
  { value: 'PERSONAL', label: 'Personal', color: 'var(--color-personal)' },
] as const

export const PRIORITIES = [
  { value: 'HIGH', label: 'Alta' },
  { value: 'MEDIUM', label: 'Media' },
  { value: 'LOW', label: 'Baja' },
] as const

export const STATUSES = [
  { value: 'TODO', label: 'Por hacer' },
  { value: 'IN_PROGRESS', label: 'En progreso' },
  { value: 'DONE', label: 'Completadas' },
] as const

export const STATUS_COLUMNS = ['TODO', 'IN_PROGRESS', 'DONE'] as const
