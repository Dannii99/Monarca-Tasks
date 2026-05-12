'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'motion/react'
import { ArrowLeft, Type, AlignLeft, Tag, AlertCircle, Calendar, Check } from 'lucide-react'
import { TaskCategory, TaskPriority } from '@/types/task'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CATEGORIES, PRIORITIES } from '@/lib/constants'
import { useLoading } from '@/components/ui/loading'

const priorityConfig: Record<TaskPriority, { color: string; bg: string; border: string; label: string }> = {
  HIGH: {
    color: 'text-red-600',
    bg: 'bg-red-50',
    border: 'border-red-200',
    label: 'Alta'
  },
  MEDIUM: {
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    label: 'Media'
  },
  LOW: {
    color: 'text-green-600',
    bg: 'bg-green-50',
    border: 'border-green-200',
    label: 'Baja'
  }
}

const categoryConfig: Record<TaskCategory, { color: string; bg: string; border: string; label: string }> = {
  WORK: {
    color: 'text-[var(--color-work)]',
    bg: 'bg-[var(--badge-work-bg)]',
    border: 'border-[var(--color-work)]/20',
    label: 'Trabajo'
  },
  HOME: {
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    label: 'Hogar'
  },
  PERSONAL: {
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    label: 'Personal'
  }
}

export default function NewTaskPage() {
  const router = useRouter()
  const { startLoading, stopLoading } = useLoading()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<TaskCategory>('PERSONAL')
  const [priority, setPriority] = useState<TaskPriority>('MEDIUM')
  const [dueDate, setDueDate] = useState('')
  const [errors, setErrors] = useState<{ title?: string }>({})

  const isFormValid = title.trim().length > 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim()) {
      setErrors({ title: 'El título es obligatorio' })
      return
    }

    startLoading('Creando tarea...')

    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || null,
          category,
          priority,
          dueDate: dueDate || null
        })
      })

      if (res.ok) {
        const newTask = await res.json()
        router.push(`/task/${newTask.id}`)
        router.refresh()
      } else {
        setErrors({ title: 'Error al crear la tarea' })
      }
    } catch (error) {
      console.error('Error creating task:', error)
      setErrors({ title: 'Error al crear la tarea' })
    } finally {
      stopLoading()
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[var(--bg-surface)]/80 backdrop-blur-xl border-b border-[var(--border-default)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/')}
              className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Cancelar
            </Button>

            <h1 className="text-lg font-semibold text-[var(--text-primary)]">
              Nueva tarea
            </h1>

            <div className="w-20" /> {/* Spacer for alignment */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* Title */}
          <div className="bg-[var(--bg-surface)] rounded-2xl p-6 border border-[var(--border-default)]">
            <label className="flex items-center gap-2 text-sm font-semibold text-[var(--text-secondary)] mb-3">
              <Type className="w-4 h-4" />
              Título
              <span className="text-[var(--color-error)]">*</span>
            </label>
            <Input
              value={title}
              onChange={(e) => {
                setTitle(e.target.value)
                if (errors.title) setErrors({})
              }}
              placeholder="¿Qué necesitas hacer?"
              autoFocus
              maxLength={100}
              className={`h-14 text-xl font-semibold bg-[var(--bg-subtle)] border-2 rounded-xl px-4 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:bg-[var(--bg-surface)] transition-all ${
                errors.title 
                  ? 'border-[var(--color-error)] focus:border-[var(--color-error)]' 
                  : 'border-[var(--border-default)] focus:border-[var(--border-focus)]'
              }`}
            />
            {errors.title && (
              <p className="text-sm text-[var(--color-error)] mt-2">{errors.title}</p>
            )}
            <p className="text-xs text-[var(--text-muted)] mt-2 text-right">
              {title.length}/100
            </p>
          </div>

          {/* Description */}
          <div className="bg-[var(--bg-surface)] rounded-2xl p-6 border border-[var(--border-default)]">
            <label className="flex items-center gap-2 text-sm font-semibold text-[var(--text-secondary)] mb-3">
              <AlignLeft className="w-4 h-4" />
              Descripción
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Añade más detalles sobre la tarea..."
              rows={5}
              maxLength={500}
              className="w-full px-4 py-3 bg-[var(--bg-subtle)] border border-[var(--border-default)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:bg-[var(--bg-surface)] focus:border-[var(--border-focus)] focus:ring-2 focus:ring-[var(--border-focus)]/20 focus:outline-none resize-none transition-all"
            />
            <p className="text-xs text-[var(--text-muted)] mt-2 text-right">
              {description.length}/500
            </p>
          </div>

          {/* Settings Grid */}
          <div className="bg-[var(--bg-surface)] rounded-2xl p-6 border border-[var(--border-default)]">
            <h3 className="text-sm font-semibold text-[var(--text-secondary)] mb-4">
              Configuración
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Category */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-medium text-[var(--text-muted)] uppercase">
                  <Tag className="w-3 h-3" />
                  Categoría
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as TaskCategory)}
                  className="w-full h-12 px-3 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-default)] text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)] focus:border-transparent transition-all cursor-pointer"
                >
                  {Object.entries(categoryConfig).map(([value, config]) => (
                    <option key={value} value={value}>
                      {config.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Priority */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-medium text-[var(--text-muted)] uppercase">
                  <AlertCircle className="w-3 h-3" />
                  Prioridad
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as TaskPriority)}
                  className="w-full h-12 px-3 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-default)] text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)] focus:border-transparent transition-all cursor-pointer"
                >
                  {Object.entries(priorityConfig).map(([value, config]) => (
                    <option key={value} value={value}>
                      {config.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Due Date */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-medium text-[var(--text-muted)] uppercase">
                  <Calendar className="w-3 h-3" />
                  Fecha límite
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full h-12 px-3 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-default)] text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)] focus:border-transparent transition-all cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/')}
              className="h-12 px-6 text-[var(--text-secondary)] border-[var(--border-default)] hover:bg-[var(--bg-subtle)] rounded-xl"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={!isFormValid}
              className="h-12 px-8 bg-[var(--color-work)] hover:bg-[var(--color-active)] text-white rounded-xl shadow-lg shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Check className="w-4 h-4 mr-2" />
              Crear tarea
            </Button>
          </div>
        </motion.form>
      </main>
    </div>
  )
}
