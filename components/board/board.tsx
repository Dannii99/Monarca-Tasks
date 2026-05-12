'use client'

import { useState } from 'react'
import { signOut } from 'next-auth/react'
import { Task, TaskStatus } from '@/types/task'
import { Column } from './column'
import { BoardToolbar } from './board-toolbar'
import { TaskFormModal } from './task-form-modal'
import { STATUS_COLUMNS } from '@/lib/constants'

interface BoardProps {
  initialTasks: Task[]
}

export function Board({ initialTasks }: BoardProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<string>('priority')
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null)

  const filteredTasks = tasks
    .filter((task) => {
      if (search && !task.title.toLowerCase().includes(search.toLowerCase()) &&
          !(task.description && task.description.toLowerCase().includes(search.toLowerCase()))) {
        return false
      }
      if (categoryFilter && task.category !== categoryFilter) {
        return false
      }
      return true
    })
    .sort((a, b) => {
      if (sortBy === 'priority') {
        const priorityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 }
        return priorityOrder[a.priority] - priorityOrder[b.priority]
      }
      if (sortBy === 'dueDate') {
        if (!a.dueDate && !b.dueDate) return 0
        if (!a.dueDate) return 1
        if (!b.dueDate) return -1
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      }
      if (sortBy === 'name') {
        return a.title.localeCompare(b.title)
      }
      return 0
    })

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTaskId(taskId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = async (e: React.DragEvent, newStatus: string) => {
    e.preventDefault()
    if (!draggedTaskId) return

    const task = tasks.find((t) => t.id === draggedTaskId)
    if (!task || task.status === newStatus) {
      setDraggedTaskId(null)
      return
    }

    setTasks((prev) =>
      prev.map((t) =>
        t.id === draggedTaskId
          ? { ...t, status: newStatus as TaskStatus, isOverdue: newStatus === 'DONE' ? false : t.isOverdue }
          : t
      )
    )

    try {
      const res = await fetch(`/api/tasks/${draggedTaskId}/move`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      const updated = await res.json()
      setTasks((prev) => prev.map((t) => (t.id === draggedTaskId ? updated : t)))
    } catch {
      setTasks((prev) =>
        prev.map((t) => (t.id === draggedTaskId ? { ...t, status: task.status as TaskStatus, isOverdue: task.isOverdue } : t))
      )
    }

    setDraggedTaskId(null)
  }

  const handleEdit = (task: Task) => {
    setEditingTask(task)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
      return
    }

    setTasks((prev) => prev.filter((t) => t.id !== id))

    try {
      await fetch(`/api/tasks/${id}`, { method: 'DELETE' })
    } catch {
      setTasks((prev) => [...prev, tasks.find((t) => t.id === id)!])
    }
  }

  const handleSave = async (taskData: Partial<Task>) => {
    if (editingTask) {
      setTasks((prev) =>
        prev.map((t) => (t.id === editingTask.id ? { ...t, ...taskData } : t))
      )

      try {
        const res = await fetch(`/api/tasks/${editingTask.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(taskData),
        })
        const updated = await res.json()
        setTasks((prev) => prev.map((t) => (t.id === editingTask.id ? updated : t)))
      } catch {
        setTasks((prev) =>
          prev.map((t) => (t.id === editingTask.id ? editingTask : t))
        )
      }
    } else {
      const now = new Date().toISOString()
      const dueDateStr = taskData.dueDate
        ? new Date(taskData.dueDate as string).toISOString()
        : null
      const dueDateObj = dueDateStr ? new Date(dueDateStr) : null
      const isOverdue = dueDateObj
        ? dueDateObj < new Date() && (taskData.status || 'TODO') !== 'DONE'
        : false
      const dueDateLabel = dueDateObj
        ? dueDateObj.toDateString() === new Date().toDateString()
          ? 'Today'
          : dueDateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        : ''

      const newTask: Task = {
        id: Date.now().toString(),
        title: taskData.title || '',
        description: taskData.description || null,
        status: 'TODO',
        category: taskData.category || 'PERSONAL',
        priority: taskData.priority || 'MEDIUM',
        dueDate: dueDateStr,
        createdAt: now,
        updatedAt: now,
        isOverdue,
        dueDateLabel,
      }

      setTasks((prev) => [newTask, ...prev])

      try {
        const res = await fetch('/api/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(taskData),
        })
        const created = await res.json()
        setTasks((prev) => prev.map((t) => (t.id === newTask.id ? created : t)))
      } catch {
        setTasks((prev) => prev.filter((t) => t.id !== newTask.id))
      }
    }

    setIsModalOpen(false)
    setEditingTask(null)
  }

  const handleOpenModal = () => {
    setEditingTask(null)
    setIsModalOpen(true)
  }

  const handleLogout = () => {
    signOut({ callbackUrl: '/login' })
  }

  return (
    <div className="flex h-full flex-col">
      <BoardToolbar
        search={search}
        onSearchChange={setSearch}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        onAddTask={handleOpenModal}
        onLogout={handleLogout}
      />

      <div className="flex-1 overflow-x-auto p-4">
        <div className="flex gap-4 min-w-fit h-full">
          {STATUS_COLUMNS.map((status) => (
            <Column
              key={status}
              status={status}
              tasks={filteredTasks}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            />
          ))}
        </div>
      </div>

      <TaskFormModal
        open={isModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsModalOpen(false)
            setEditingTask(null)
          }
        }}
        task={editingTask}
        onSave={handleSave}
      />
    </div>
  )
}
