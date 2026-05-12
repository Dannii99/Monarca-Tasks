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

const columnConfig: Record<string, { 
  icon: typeof Circle
  color: string 
  gradient: string
  bgGradient: string
}> = {
  TODO: {
    icon: Circle,
    color: 'text-slate-600 dark:text-slate-400',
    gradient: 'from-slate-400 to-slate-600',
    bgGradient: 'from-slate-100 to-slate-200 dark:from-slate-800/50 dark:to-slate-700/50',
  },
  IN_PROGRESS: {
    icon: Loader2,
    color: 'text-blue-600 dark:text-blue-400',
    gradient: 'from-blue-400 to-blue-600',
    bgGradient: 'from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30',
  },
  DONE: {
    icon: CheckCircle2,
    color: 'text-emerald-600 dark:text-emerald-400',
    gradient: 'from-emerald-400 to-emerald-600',
    bgGradient: 'from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/30',
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
  isMobile?: boolean
}

export function Column({ status, tasks, onEdit, onDelete, onComplete, onDragStart, onDragOver, onDrop, onAddTask, isMobile }: ColumnProps) {
  const statusConfig = STATUSES.find((s) => s.value === status)
  const columnTasks = tasks.filter((t) => t.status === status)
  const config = columnConfig[status] || columnConfig.TODO
  const Icon = config.icon

  return (
    <div
      className={`
        flex flex-col h-full rounded-3xl bg-[var(--bg-surface)] 
        border border-[var(--border-default)] shadow-sm overflow-hidden
        ${isMobile ? 'min-h-[calc(100vh-280px)]' : ''}
      `}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, status)}
    >
      {/* Header mejorado */}
      <div className={`
        flex items-center justify-between px-4 sm:px-5 py-4 
        border-b border-[var(--border-default)]
        bg-gradient-to-r ${config.bgGradient}
      `}>
        <div className="flex items-center gap-3">
          <div className={`
            w-10 h-10 rounded-xl bg-gradient-to-br ${config.gradient} 
            flex items-center justify-center shadow-lg
          `}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[var(--text-primary)]">
              {statusConfig?.label || status}
            </h3>
            <p className="text-xs text-[var(--text-muted)] font-medium">
              {columnTasks.length} {columnTasks.length === 1 ? 'tarea' : 'tareas'}
            </p>
          </div>
        </div>
        
        {!isMobile && (
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-muted)] rounded-xl transition-colors"
            onClick={onAddTask}
            aria-label="Add task"
          >
            <Plus className="w-5 h-5" />
          </Button>
        )}
      </div>

      {/* Task list */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <motion.div 
            variants={staggerContainer} 
            initial="initial" 
            animate="animate" 
            className={`
              flex flex-col gap-3 
              ${isMobile ? 'p-3' : 'p-4'}
            `}
          >
            {columnTasks.length === 0 ? (
              <EmptyState
                message={`No hay tareas ${statusConfig?.label?.toLowerCase() || status}`}
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
                  isMobile={isMobile}
                />
              ))
            )}
          </motion.div>
        </ScrollArea>
      </div>

      {/* Botón flotante para agregar en móvil */}
      {isMobile && (
        <div className="p-3 border-t border-[var(--border-default)] bg-[var(--bg-subtle)]">
          <Button
            onClick={onAddTask}
            className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-lg shadow-purple-500/20 font-semibold"
          >
            <Plus className="w-5 h-5 mr-2" />
            Agregar tarea
          </Button>
        </div>
      )}
    </div>
  )
}
