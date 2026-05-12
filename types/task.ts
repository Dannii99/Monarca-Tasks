export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE'
export type TaskCategory = 'WORK' | 'HOME' | 'PERSONAL'
export type TaskPriority = 'HIGH' | 'MEDIUM' | 'LOW'

export interface Task {
  id: string
  title: string
  description: string | null
  status: TaskStatus
  category: TaskCategory
  priority: TaskPriority
  dueDate: string | null
  createdAt: string
  updatedAt: string
  isOverdue: boolean
  dueDateLabel: string
}
