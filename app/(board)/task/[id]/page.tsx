import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { serializeTask } from '@/lib/serialize-task'
import { TaskDetailView } from '@/components/task/task-detail-view'
import type { Task } from '@/types/task'

interface TaskPageProps {
  params: Promise<{ id: string }>
}

export default async function TaskPage({ params }: TaskPageProps) {
  const { id } = await params
  
  const task = await prisma.task.findUnique({
    where: { id },
    include: {
      subtasks: {
        where: { deletedAt: null }, // Solo subtareas activas
        orderBy: { createdAt: 'asc' }
      },
      activities: {
        orderBy: { createdAt: 'desc' },
        take: 50
      }
    }
  })

  if (!task) {
    notFound()
  }

  const serializedTask = serializeTask(task) as Task
  
  // Serializar subtareas y actividades
  const subtasks = task.subtasks.map((st) => ({
    ...st,
    status: st.status as 'TODO' | 'IN_PROGRESS' | 'DONE',
    createdAt: st.createdAt.toISOString(),
    updatedAt: st.updatedAt.toISOString(),
    deletedAt: st.deletedAt?.toISOString() || null
  }))
  
  const activities = task.activities.map((act) => ({
    ...act,
    createdAt: act.createdAt.toISOString()
  }))

  return (
    <TaskDetailView 
      task={serializedTask} 
      initialSubtasks={subtasks}
      initialActivities={activities}
    />
  )
}
