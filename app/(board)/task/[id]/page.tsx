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
    where: { id }
  })

  if (!task) {
    notFound()
  }

  const serializedTask = serializeTask(task) as Task
  
  // Por ahora usamos arrays vacíos - se integrarán con Neon después
  const subtasks: Array<{
    id: string
    title: string
    completed: boolean
    createdAt: string
    updatedAt: string
  }> = []
  
  const activities: Array<{
    id: string
    action: string
    details: string | null
    createdAt: string
  }> = [
    {
      id: '1',
      action: 'created',
      details: 'Tarea creada',
      createdAt: task.createdAt.toISOString()
    }
  ]

  return (
    <TaskDetailView 
      task={serializedTask} 
      initialSubtasks={subtasks}
      initialActivities={activities}
    />
  )
}
