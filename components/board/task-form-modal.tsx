'use client'

import { useState, useEffect } from 'react'
import { Task, TaskCategory, TaskPriority } from '@/types/task'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CATEGORIES, PRIORITIES } from '@/lib/constants'

interface TaskFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  task: Task | null
  onSave: (taskData: Partial<Task>) => void
}

export function TaskFormModal({ open, onOpenChange, task, onSave }: TaskFormModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<TaskCategory>('PERSONAL')
  const [priority, setPriority] = useState<TaskPriority>('MEDIUM')
  const [dueDate, setDueDate] = useState('')

  useEffect(() => {
    if (task) {
      setTitle(task.title)
      setDescription(task.description || '')
      setCategory(task.category)
      setPriority(task.priority)
      setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '')
    } else {
      setTitle('')
      setDescription('')
      setCategory('PERSONAL')
      setPriority('MEDIUM')
      setDueDate('')
    }
  }, [task, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    onSave({
      title: title.trim(),
      description: description.trim() || null,
      category,
      priority,
      dueDate: dueDate || null,
    })
  }

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={task ? 'Edit Task' : 'Add Task'}
    >
      <form onSubmit={handleSubmit} className="space-y-4 mt-2">
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium">
            Title <span className="text-red-600">*</span>
          </label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional description"
            rows={3}
            className="flex w-full rounded-sm border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="category" className="text-sm font-medium">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as TaskCategory)}
              className="flex h-9 w-full rounded-sm border border-gray-300 bg-transparent px-3 py-1 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="priority" className="text-sm font-medium">
              Priority
            </label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
              className="flex h-9 w-full rounded-sm border border-gray-300 bg-transparent px-3 py-1 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
            >
              {PRIORITIES.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="dueDate" className="text-sm font-medium">
            Due Date
          </label>
          <Input
            id="dueDate"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit">{task ? 'Save Changes' : 'Create Task'}</Button>
        </div>
      </form>
    </Modal>
  )
}
