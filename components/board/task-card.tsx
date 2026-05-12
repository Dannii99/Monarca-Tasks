'use client'

import { GripVertical, Calendar, CheckCircle2, MoreVertical, Pencil, Trash2 } from 'lucide-react'
import { motion } from 'motion/react'
import { Task } from '@/types/task'
import { CategoryBadge } from '@/components/shared/category-badge'
import { PriorityIndicator } from '@/components/shared/priority-indicator'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { fadeInUp } from '@/lib/motion'

interface TaskCardProps {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  onComplete: (id: string) => void
  onDragStart: (e: React.DragEvent, taskId: string) => void
}

export function TaskCard({ task, onEdit, onDelete, onComplete, onDragStart }: TaskCardProps) {
  const isDone = task.status === 'DONE'

  return (
    <motion.div 
      initial={fadeInUp.initial} 
      animate={fadeInUp.animate} 
      exit={fadeInUp.exit} 
      transition={fadeInUp.transition} 
      layout
    >
      <div
        draggable
        onDragStart={(e) => onDragStart(e, task.id)}
        className={`group relative rounded-xl border bg-[var(--bg-surface)] p-4 cursor-grab active:cursor-grabbing hover:shadow-md transition-all duration-200 ${
          isDone 
            ? 'border-[var(--border-default)] opacity-75' 
            : 'border-[var(--border-default)] hover:border-[var(--border-strong)]'
        }`}
      >
        <div className="flex items-start gap-3">
          {/* Drag handle - hidden on mobile touch, visible on hover/desktop */}
          <div className="hidden sm:block mt-0.5 text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing shrink-0">
            <GripVertical size={16} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h4 className={`text-sm font-semibold text-[var(--text-primary)] leading-snug ${isDone ? 'line-through text-[var(--text-muted)]' : ''}`}>
              {task.title}
            </h4>

            {task.description && (
              <p className="mt-1.5 text-sm text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                {task.description}
              </p>
            )}

            {/* Meta row */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <CategoryBadge category={task.category} />
              <PriorityIndicator priority={task.priority} />

              {task.dueDate && (
                <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-md ${
                  task.isOverdue 
                    ? 'text-[var(--color-error)] bg-[var(--color-error)]/10' 
                    : 'text-[var(--text-secondary)] bg-[var(--bg-muted)]'
                }`}>
                  <Calendar size={12} />
                  {task.dueDateLabel}
                </span>
              )}
            </div>
          </div>

          {/* Actions - always visible on mobile for touch, hover on desktop */}
          <div className="flex flex-col gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shrink-0">
            {!isDone && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-[var(--color-success)] hover:opacity-80 hover:bg-[var(--color-success)]/10 rounded-lg"
                    onClick={() => onComplete(task.id)}
                    aria-label="Complete task"
                  >
                    <CheckCircle2 size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Completar</TooltipContent>
              </Tooltip>
            )}

            <DropdownMenu>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] rounded-lg"
                      aria-label="More actions"
                    >
                      <MoreVertical size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent>Opciones</TooltipContent>
              </Tooltip>
              <DropdownMenuContent align="end" className="w-40 bg-[var(--bg-surface)] border-[var(--border-default)]">
                <DropdownMenuItem onClick={() => onEdit(task)} className="gap-2 text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)]">
                  <Pencil size={14} />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="gap-2 text-[var(--color-error)] focus:text-[var(--color-error)] focus:bg-[var(--color-error)]/10"
                  onClick={() => onDelete(task.id)}
                >
                  <Trash2 size={14} />
                  Eliminar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
