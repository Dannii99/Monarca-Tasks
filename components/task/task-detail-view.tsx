'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'motion/react'
import { ArrowLeft, CheckCircle2, Circle, Loader2 } from 'lucide-react'
import { Task, TaskStatus } from '@/types/task'
import { Button } from '@/components/ui/button'
import { EditableTitle } from './editable-title'
import { TaskDescription } from './task-description'
import { TaskSidebar } from './task-sidebar'
import { SubtasksList } from './subtasks-list'
import { ActivityLog } from './activity-log'
import { useLoading } from '@/components/ui/loading'

interface TaskDetailViewProps {
  task: Task
  initialSubtasks: Array<{
    id: string
    title: string
    status: 'TODO' | 'IN_PROGRESS' | 'DONE'
    deletedAt: string | null
    createdAt: string
    updatedAt: string
  }>
  initialActivities: Array<{
    id: string
    action: string
    details: string | null
    createdAt: string
  }>
}

const statusConfig: Record<TaskStatus, { icon: typeof Circle; color: string; bg: string; label: string }> = {
  TODO: {
    icon: Circle,
    color: 'text-slate-600',
    bg: 'bg-slate-100',
    label: 'Por hacer'
  },
  IN_PROGRESS: {
    icon: Loader2,
    color: 'text-orange-600',
    bg: 'bg-orange-100',
    label: 'En progreso'
  },
  DONE: {
    icon: CheckCircle2,
    color: 'text-emerald-600',
    bg: 'bg-emerald-100',
    label: 'Completada'
  }
}

export function TaskDetailView({ task, initialSubtasks, initialActivities }: TaskDetailViewProps) {
  const router = useRouter()
  const { startLoading, stopLoading } = useLoading()
  const [currentTask, setCurrentTask] = useState<Task>(task)
  const [subtasks, setSubtasks] = useState(initialSubtasks)
  const [activities, setActivities] = useState(initialActivities)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleUpdate = useCallback(async (updates: Partial<Task>) => {
    setIsUpdating(true)
    
    // Optimistic update
    setCurrentTask(prev => ({ ...prev, ...updates }))
    
    try {
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })
      
      if (res.ok) {
        const updated = await res.json()
        setCurrentTask(updated)
        
        // Agregar actividad
        const activityRes = await fetch(`/api/tasks/${task.id}/activities`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'updated',
            details: Object.keys(updates).join(', ')
          })
        })
        
        if (activityRes.ok) {
          const newActivity = await activityRes.json()
          setActivities(prev => [newActivity, ...prev])
        }
      }
    } catch (error) {
      console.error('Error updating task:', error)
      // Revert optimistic update
      setCurrentTask(task)
    } finally {
      setIsUpdating(false)
    }
  }, [task])

  const handleTitleUpdate = useCallback(async (newTitle: string) => {
    if (newTitle.trim() === currentTask.title) return
    await handleUpdate({ title: newTitle.trim() })
  }, [currentTask.title, handleUpdate])

  const handleDescriptionUpdate = useCallback(async (newDescription: string) => {
    if (newDescription === currentTask.description) return
    await handleUpdate({ description: newDescription })
  }, [currentTask.description, handleUpdate])

  const handleDelete = useCallback(async () => {
    startLoading('Eliminando tarea...')
    try {
      await fetch(`/api/tasks/${task.id}`, { method: 'DELETE' })
      router.push('/')
      router.refresh()
    } finally {
      stopLoading()
    }
  }, [task.id, router, startLoading, stopLoading])

  const StatusIcon = statusConfig[currentTask.status].icon

  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[var(--bg-surface)]/80 backdrop-blur-xl border-b border-[var(--border-default)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/')}
                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al board
              </Button>
            </div>
            
            <div className="flex items-center gap-3">
              <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${statusConfig[currentTask.status].bg}`}>
                <StatusIcon className={`w-4 h-4 ${statusConfig[currentTask.status].color}`} />
                <span className={statusConfig[currentTask.status].color}>
                  {statusConfig[currentTask.status].label}
                </span>
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title Section */}
            <section className="bg-[var(--bg-surface)] rounded-2xl p-6 border border-[var(--border-default)]">
              <EditableTitle 
                title={currentTask.title} 
                onSave={handleTitleUpdate}
                isDone={currentTask.status === 'DONE'}
              />
            </section>

            {/* Description Section */}
            <section className="bg-[var(--bg-surface)] rounded-2xl p-6 border border-[var(--border-default)]">
              <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-4">
                Descripción
              </h3>
              <TaskDescription 
                description={currentTask.description || ''} 
                onSave={handleDescriptionUpdate}
              />
            </section>

            {/* Subtasks Section */}
            <section className="bg-[var(--bg-surface)] rounded-2xl p-6 border border-[var(--border-default)]">
              <SubtasksList 
                taskId={task.id}
                subtasks={subtasks}
                onSubtasksChange={setSubtasks}
                onActivityAdd={(activity) => setActivities(prev => [activity, ...prev])}
              />
            </section>

            {/* Activity Log */}
            <section className="bg-[var(--bg-surface)] rounded-2xl p-6 border border-[var(--border-default)]">
              <ActivityLog activities={activities} />
            </section>
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1">
            <TaskSidebar 
              task={currentTask}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          </div>
        </motion.div>
      </main>
    </div>
  )
}
