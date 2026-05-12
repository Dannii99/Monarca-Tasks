'use client'

import { Task } from '@/types/task'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Pencil, Trash2, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TaskCardProps {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  onDragStart: (e: React.DragEvent, taskId: string) => void
}

const categoryVariantMap: Record<string, 'work' | 'home' | 'personal'> = {
  WORK: 'work',
  HOME: 'home',
  PERSONAL: 'personal',
}

const priorityVariantMap: Record<string, 'high' | 'medium' | 'low'> = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
}

export function TaskCard({ task, onEdit, onDelete, onDragStart }: TaskCardProps) {
  const categoryVariant = categoryVariantMap[task.category] || 'personal'
  const priorityVariant = priorityVariantMap[task.priority] || 'medium'

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      className="group rounded-sm border border-gray-200 bg-white p-3 shadow-sm transition-shadow hover:shadow-md cursor-grab active:cursor-grabbing"
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-sm font-semibold leading-tight flex-1">{task.title}</h4>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => onEdit(task)}
            aria-label="Edit task"
          >
            <Pencil className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-red-600 hover:text-red-700"
            onClick={() => onDelete(task.id)}
            aria-label="Delete task"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {task.description && (
        <p className="mt-1 text-xs text-gray-600 line-clamp-2">{task.description}</p>
      )}

      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        <Badge variant={categoryVariant} className="text-[10px] px-1.5 py-0">
          {task.category.replace('_', ' ')}
        </Badge>
        <Badge variant={priorityVariant} className="text-[10px] px-1.5 py-0">
          {task.priority}
        </Badge>
        {task.dueDate && (
          <span className={cn(
            'text-[10px] font-medium',
            task.isOverdue ? 'text-red-600' : 'text-gray-500'
          )}>
            {task.dueDateLabel}
          </span>
        )}
        {task.isOverdue && (
          <Badge variant="overdue" className="text-[10px] px-1.5 py-0">
            <AlertCircle className="h-2.5 w-2.5 mr-0.5" />
            Overdue
          </Badge>
        )}
      </div>
    </div>
  )
}
