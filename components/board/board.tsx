'use client'

import { useState } from 'react'
import { signOut } from 'next-auth/react'
import { motion, AnimatePresence } from 'motion/react'
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

  const pendingCount = tasks.filter((t) => t.status !== 'DONE').length
  const urgentCount = tasks.filter((t) => t.isOverdue && t.status !== 'DONE').length
  const doneCount = tasks.filter((t) => t.status === 'DONE').length

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

  const handleComplete = async (id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status: 'DONE' as TaskStatus, isOverdue: false } : t
      )
    )

    try {
      await fetch(`/api/tasks/${id}/move`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'DONE' }),
      })
    } catch {
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status: tasks.find((x) => x.id === id)?.status as TaskStatus, isOverdue: tasks.find((x) => x.id === id)?.isOverdue ?? false } : t)))
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
    <div className="flex flex-col h-screen w-full overflow-hidden bg-gray-50/50">
      <BoardToolbar
        search={search}
        onSearchChange={setSearch}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        onAddTask={handleOpenModal}
        onLogout={handleLogout}
        pendingCount={pendingCount}
        urgentCount={urgentCount}
        doneCount={doneCount}
      />

      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <div className="h-full p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 h-full min-w-0">
            {STATUS_COLUMNS.map((status) => (
              <Column
                key={status}
                status={status}
                tasks={filteredTasks}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onComplete={handleComplete}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onAddTask={handleOpenModal}
              />
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
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
        )}
      </AnimatePresence>
    </div>
  )
}
