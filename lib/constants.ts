export const CATEGORIES = [
  { value: 'WORK', label: 'Work', color: 'var(--color-work)' },
  { value: 'HOME', label: 'Home', color: 'var(--color-home)' },
  { value: 'PERSONAL', label: 'Personal', color: 'var(--color-personal)' },
] as const

export const PRIORITIES = [
  { value: 'HIGH', label: 'High' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'LOW', label: 'Low' },
] as const

export const STATUSES = [
  { value: 'TODO', label: 'To Do' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'DONE', label: 'Done' },
] as const

export const STATUS_COLUMNS = ['TODO', 'IN_PROGRESS', 'DONE'] as const
