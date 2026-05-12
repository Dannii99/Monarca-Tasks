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
  isMobile?: boolean
}

export function TaskCard({ task, onEdit, onDelete, onComplete, onDragStart, isMobile }: TaskCardProps) {
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
        draggable={!isMobile}
        onDragStart={(e) => onDragStart(e, task.id)}
        className={`
          group relative rounded-2xl border bg-[var(--bg-surface)] cursor-grab active:cursor-grabbing 
          hover:shadow-lg transition-all duration-200
          ${isDone 
            ? 'border-[var(--border-default)] opacity-75' 
            : 'border-[var(--border-default)] hover:border-[var(--border-strong)]'
          }
          ${isMobile ? 'p-4 shadow-sm' : 'p-4'}
        `}
      >
        <div className="flex items-start gap-3">
          {/* Drag handle - solo desktop */}
          {!isMobile && (
            <div className="hidden lg:block mt-0.5 text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing shrink-0">
              <GripVertical size={16} />
            </div>
          )}

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h4 className={`
              font-semibold text-[var(--text-primary)] leading-snug
              ${isMobile ? 'text-base' : 'text-sm'}
              ${isDone ? 'line-through text-[var(--text-muted)]' : ''}
            `}>
              {task.title}
            </h4>

            {task.description && (
              <p className={`
                mt-2 text-[var(--text-secondary)] line-clamp-2 leading-relaxed
                ${isMobile ? 'text-sm' : 'text-sm'}
              `}>
                {task.description}
              </p>
            )}

            {/* Meta row */}
            <div className={`
              flex flex-wrap items-center gap-2
              ${isMobile ? 'mt-4' : 'mt-3'}
            `}>
              <CategoryBadge category={task.category} isMobile={isMobile} />
              <PriorityIndicator priority={task.priority} isMobile={isMobile} />

              {task.dueDate && (
                <span className={`
                  inline-flex items-center gap-1.5 font-medium rounded-lg
                  ${task.isOverdue 
                    ? 'text-[var(--color-error)] bg-[var(--color-error)]/10' 
                    : 'text-[var(--text-secondary)] bg-[var(--bg-muted)]'
                  }
                  ${isMobile ? 'text-xs px-2.5 py-1.5' : 'text-xs px-2 py-1'}
                `}>
                  <Calendar size={isMobile ? 14 : 12} />
                  {task.dueDateLabel}
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className={`
            flex flex-col gap-1 shrink-0
            ${isMobile ? 'opacity-100' : 'sm:opacity-0 sm:group-hover:opacity-100'}
            transition-opacity
          `}>
            {!isDone && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`
                      text-[var(--color-success)] hover:opacity-80 hover:bg-[var(--color-success)]/10 rounded-xl
                      ${isMobile ? 'h-10 w-10' : 'h-8 w-8 rounded-lg'}
                    `}
                    onClick={() => onComplete(task.id)}
                    aria-label="Complete task"
                  >
                    <CheckCircle2 size={isMobile ? 20 : 16} />
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
                      className={`
                        text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)]
                        ${isMobile ? 'h-10 w-10 rounded-xl' : 'h-8 w-8 rounded-lg'}
                      `}
                      aria-label="More actions"
                    >
                      <MoreVertical size={isMobile ? 20 : 16} />
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent>Opciones</TooltipContent>
              </Tooltip>
              <DropdownMenuContent 
                align="end" 
                className="w-44 bg-[var(--bg-surface)] border-[var(--border-default)]"
              >
                <DropdownMenuItem 
                  onClick={() => onEdit(task)} 
                  className="gap-3 text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] py-2.5"
                >
                  <Pencil size={16} />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="gap-3 text-[var(--color-error)] focus:text-[var(--color-error)] focus:bg-[var(--color-error)]/10 py-2.5"
                  onClick={() => onDelete(task.id)}
                >
                  <Trash2 size={16} />
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
