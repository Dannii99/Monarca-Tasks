import { isPast, isToday, format } from 'date-fns'
import { es } from 'date-fns/locale'

interface TaskRaw {
  id: string
  title: string
  description: string | null
  status: string
  category: string
  priority: string
  dueDate: Date | null
  createdAt: Date
  updatedAt: Date
}

export function serializeTask(task: TaskRaw) {
  const dueDate = task.dueDate
  const isOverdue = dueDate ? isPast(dueDate) && task.status !== 'DONE' : false
  const dueDateLabel = dueDate
    ? isToday(dueDate)
      ? 'Hoy'
      : format(dueDate, 'd MMM', { locale: es })
    : ''

  return {
    ...task,
    dueDate: dueDate ? dueDate.toISOString() : null,
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
    isOverdue,
    dueDateLabel,
  }
}
