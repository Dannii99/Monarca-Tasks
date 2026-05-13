'use client'

import { useState, useCallback } from 'react'
import { Trash2, Briefcase, Home, User, Flame, Minus, ArrowDown, Calendar, Clock } from 'lucide-react'
import { Task, TaskCategory, TaskPriority, TaskStatus } from '@/types/task'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { CATEGORIES, PRIORITIES, STATUSES } from '@/lib/constants'

interface TaskSidebarProps {
  task: Task
  onUpdate: (updates: Partial<Task>) => void
  onDelete: () => void
}

const categoryConfig: Record<TaskCategory, { icon: typeof Briefcase; color: string; bg: string; label: string }> = {
  WORK: {
    icon: Briefcase,
    color: 'text-[var(--color-work)]',
    bg: 'bg-[var(--badge-work-bg)]',
    label: 'Trabajo'
  },
  HOME: {
    icon: Home,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    label: 'Hogar'
  },
  PERSONAL: {
    icon: User,
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    label: 'Personal'
  }
}

const priorityConfig: Record<TaskPriority, { icon: typeof Flame; color: string; bg: string; label: string }> = {
  HIGH: {
    icon: Flame,
    color: 'text-red-600',
    bg: 'bg-red-50',
    label: 'Alta'
  },
  MEDIUM: {
    icon: Minus,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    label: 'Media'
  },
  LOW: {
    icon: ArrowDown,
    color: 'text-green-600',
    bg: 'bg-green-50',
    label: 'Baja'
  }
}

const statusConfig: Record<TaskStatus, { color: string; bg: string; label: string }> = {
  TODO: {
    color: 'text-slate-600',
    bg: 'bg-slate-100',
    label: 'Por hacer'
  },
  IN_PROGRESS: {
    color: 'text-orange-600',
    bg: 'bg-orange-100',
    label: 'En progreso'
  },
  DONE: {
    color: 'text-emerald-600',
    bg: 'bg-emerald-100',
    label: 'Completada'
  }
}

export function TaskSidebar({ task, onUpdate, onDelete }: TaskSidebarProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleStatusChange = useCallback(async (newStatus: TaskStatus) => {
    setIsUpdating(true)
    await onUpdate({ status: newStatus })
    setIsUpdating(false)
  }, [onUpdate])

  const handleCategoryChange = useCallback(async (newCategory: TaskCategory) => {
    setIsUpdating(true)
    await onUpdate({ category: newCategory })
    setIsUpdating(false)
  }, [onUpdate])

  const handlePriorityChange = useCallback(async (newPriority: TaskPriority) => {
    setIsUpdating(true)
    await onUpdate({ priority: newPriority })
    setIsUpdating(false)
  }, [onUpdate])

  const handleDueDateChange = useCallback(async (newDate: string) => {
    setIsUpdating(true)
    await onUpdate({ dueDate: newDate || null })
    setIsUpdating(false)
  }, [onUpdate])

  const formatDate = (dateString: string | null) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toISOString().split('T')[0]
  }

  const formatDisplayDate = (dateString: string | null) => {
    if (!dateString) return 'Sin fecha'
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    })
  }

  return (
    <div className="space-y-4 lg:sticky lg:top-24">
      {/* Detalles Card */}
      <div className="bg-[var(--bg-surface)] rounded-2xl p-5 border border-[var(--border-default)] space-y-5">
        <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wide">
          Detalles
        </h3>

        {/* Estado */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-[var(--text-muted)] uppercase">
            Estado
          </label>
          <select
            value={task.status}
            onChange={(e) => handleStatusChange(e.target.value as TaskStatus)}
            disabled={isUpdating}
            className="w-full h-11 px-3 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-default)] text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)] focus:border-transparent transition-all cursor-pointer"
          >
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {/* Prioridad */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-[var(--text-muted)] uppercase">
            Prioridad
          </label>
          <select
            value={task.priority}
            onChange={(e) => handlePriorityChange(e.target.value as TaskPriority)}
            disabled={isUpdating}
            className="w-full h-11 px-3 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-default)] text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)] focus:border-transparent transition-all cursor-pointer"
          >
            {PRIORITIES.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        {/* Categoría */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-[var(--text-muted)] uppercase">
            Categoría
          </label>
          <select
            value={task.category}
            onChange={(e) => handleCategoryChange(e.target.value as TaskCategory)}
            disabled={isUpdating}
            className="w-full h-11 px-3 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-default)] text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)] focus:border-transparent transition-all cursor-pointer"
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {/* Fecha límite */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-[var(--text-muted)] uppercase">
            Fecha límite
          </label>
          <input
            type="date"
            value={formatDate(task.dueDate)}
            onChange={(e) => handleDueDateChange(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            disabled={isUpdating}
            className="w-full h-11 px-3 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-default)] text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)] focus:border-transparent transition-all cursor-pointer"
          />
          {task.dueDate && (
            <p className={`text-xs ${task.isOverdue ? 'text-[var(--color-error)]' : 'text-[var(--text-muted)]'}`}>
              {formatDisplayDate(task.dueDate)}
              {task.isOverdue && ' (Vencida)'}
            </p>
          )}
        </div>
      </div>

      {/* Información adicional */}
      <div className="bg-[var(--bg-surface)] rounded-2xl p-5 border border-[var(--border-default)] space-y-4">
        <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wide">
          Información
        </h3>

        <div className="flex items-center gap-3 text-sm">
          <Clock className="w-4 h-4 text-[var(--text-muted)]" />
          <div>
            <p className="text-[var(--text-muted)] text-xs">Creado</p>
            <p className="text-[var(--text-secondary)]">
              {new Date(task.createdAt).toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <Calendar className="w-4 h-4 text-[var(--text-muted)]" />
          <div>
            <p className="text-[var(--text-muted)] text-xs">Última actualización</p>
            <p className="text-[var(--text-secondary)]">
              {new Date(task.updatedAt).toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <div className={`w-2 h-2 rounded-full ${task.isOverdue ? 'bg-[var(--color-error)]' : 'bg-[var(--color-success)]'}`} />
          <div>
            <p className="text-[var(--text-muted)] text-xs">Estado de vencimiento</p>
            <p className={`${task.isOverdue ? 'text-[var(--color-error)]' : 'text-[var(--color-success)]'}`}>
              {task.isOverdue ? 'Vencida' : 'En tiempo'}
            </p>
          </div>
        </div>
      </div>

      {/* Eliminar */}
      <Button
        variant="outline"
        onClick={() => setShowDeleteDialog(true)}
        className="w-full h-11 text-[var(--color-error)] border-[var(--color-error)]/20 hover:bg-[var(--color-error)]/10 hover:text-[var(--color-error)] rounded-xl"
      >
        <Trash2 className="w-4 h-4 mr-2" />
        Eliminar tarea
      </Button>

      {/* Dialog de confirmación */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-[var(--bg-surface)] border-[var(--border-default)]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[var(--text-primary)]">
              ¿Eliminar tarea?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[var(--text-secondary)]">
              Esta acción no se puede deshacer. La tarea y todas sus subtareas serán eliminadas permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:bg-[var(--bg-muted)] border-[var(--border-default)]">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={onDelete}
              className="bg-[var(--color-error)] hover:bg-[var(--color-error)]/90 text-white"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
