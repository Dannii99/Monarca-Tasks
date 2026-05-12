'use client'

import { Task } from '@/types/task'
import { TaskCard } from './task-card'
import { EmptyState } from './empty-state'
import { STATUSES } from '@/lib/constants'

interface ColumnProps {
  status: string
  tasks: Task[]
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  onDragStart: (e: React.DragEvent, taskId: string) => void
  onDragOver: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent, status: string) => void
}

export function Column({ status, tasks, onEdit, onDelete, onDragStart, onDragOver, onDrop }: ColumnProps) {
  const statusConfig = STATUSES.find((s) => s.value === status)
  const columnTasks = tasks.filter((t) => t.status === status)

  return (
    <div
      className="flex min-w-[280px] flex-1 flex-col rounded-sm bg-gray-100 p-3"
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, status)}
    >
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-wide text-gray-700">
          {statusConfig?.label || status}
        </h3>
        <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-600">
          {columnTasks.length}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2">
        {columnTasks.length === 0 ? (
          <EmptyState />
        ) : (
          columnTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
              onDragStart={onDragStart}
            />
          ))
        )}
      </div>
    </div>
  )
}
