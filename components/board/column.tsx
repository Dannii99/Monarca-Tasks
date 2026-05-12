'use client'

import { motion } from 'motion/react'
import { Plus, Circle, Loader2, CheckCircle2 } from 'lucide-react'
import { Task } from '@/types/task'
import { TaskCard } from './task-card'
import { EmptyState } from './empty-state'
import { STATUSES } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { staggerContainer } from '@/lib/motion'

const columnConfig: Record<string, { icon: typeof Circle; color: string; bgColor: string; borderColor: string; darkBgColor: string; darkBorderColor: string }> = {
  TODO: {
    icon: Circle,
    color: 'text-gray-600 dark:text-gray-400',
    bgColor: 'bg-gray-100',
    borderColor: 'border-gray-200',
    darkBgColor: 'dark:bg-gray-800',
    darkBorderColor: 'dark:border-gray-700',
  },
  IN_PROGRESS: {
    icon: Loader2,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-100',
    darkBgColor: 'dark:bg-blue-950/30',
    darkBorderColor: 'dark:border-blue-900/30',
  },
  DONE: {
    icon: CheckCircle2,
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-100',
    darkBgColor: 'dark:bg-green-950/30',
    darkBorderColor: 'dark:border-green-900/30',
  },
}

interface ColumnProps {
  status: string
  tasks: Task[]
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  onComplete: (id: string) => void
  onDragStart: (e: React.DragEvent, taskId: string) => void
  onDragOver: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent, status: string) => void
  onAddTask: () => void
}

export function Column({ status, tasks, onEdit, onDelete, onComplete, onDragStart, onDragOver, onDrop, onAddTask }: ColumnProps) {
  const statusConfig = STATUSES.find((s) => s.value === status)
  const columnTasks = tasks.filter((t) => t.status === status)
  const config = columnConfig[status] || columnConfig.TODO
  const Icon = config.icon

  return (
    <div
      className="flex flex-col h-full min-h-0 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm"
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, status)}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700 shrink-0">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg ${config.bgColor} ${config.darkBgColor} flex items-center justify-center`}>
            <Icon className={`w-4 h-4 ${config.color}`} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              {statusConfig?.label || status}
            </h3>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {columnTasks.length} {columnTasks.length === 1 ? 'tarea' : 'tareas'}
            </span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          onClick={onAddTask}
          aria-label="Add task"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Task list */}
      <ScrollArea className="flex-1 min-h-0">
        <motion.div 
          variants={staggerContainer} 
          initial="initial" 
          animate="animate" 
          className="flex flex-col gap-3 p-3"
        >
          {columnTasks.length === 0 ? (
            <EmptyState
              message={`No hay tareas en ${statusConfig?.label?.toLowerCase() || status}`}
              ctaLabel="Agregar tarea"
              onCta={onAddTask}
            />
          ) : (
            columnTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={onEdit}
                onDelete={onDelete}
                onComplete={onComplete}
                onDragStart={onDragStart}
              />
            ))
          )}
        </motion.div>
      </ScrollArea>
    </div>
  )
}
