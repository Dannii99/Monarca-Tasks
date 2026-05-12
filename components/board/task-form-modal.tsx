'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Calendar, Flag, X, Type, AlignLeft, Tag, AlertCircle, Check } from 'lucide-react'
import { Task, TaskCategory, TaskPriority } from '@/types/task'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Field, FieldLabel } from '@/components/ui/field'
import { CATEGORIES, PRIORITIES } from '@/lib/constants'

interface TaskFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  task: Task | null
  onSave: (taskData: Partial<Task>) => void
}

const priorityConfig: Record<TaskPriority, { color: string; bg: string; border: string; icon: string }> = {
  HIGH: {
    color: 'text-red-700',
    bg: 'bg-red-50',
    border: 'border-red-200',
    icon: '🔴',
  },
  MEDIUM: {
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    icon: '🟡',
  },
  LOW: {
    color: 'text-green-700',
    bg: 'bg-green-50',
    border: 'border-green-200',
    icon: '🟢',
  },
}

const categoryConfig: Record<TaskCategory, { color: string; bg: string; border: string; icon: string }> = {
  WORK: {
    color: 'text-blue-700',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: '💼',
  },
  HOME: {
    color: 'text-green-700',
    bg: 'bg-green-50',
    border: 'border-green-200',
    icon: '🏠',
  },
  PERSONAL: {
    color: 'text-purple-700',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    icon: '👤',
  },
}

export function TaskFormModal({ open, onOpenChange, task, onSave }: TaskFormModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<TaskCategory>('PERSONAL')
  const [priority, setPriority] = useState<TaskPriority>('MEDIUM')
  const [dueDate, setDueDate] = useState('')
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false)
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)

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

  const handleClose = () => {
    setShowPriorityDropdown(false)
    setShowCategoryDropdown(false)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[520px] p-0 overflow-hidden border-0 bg-white shadow-2xl shadow-black/10 rounded-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
        >
          {/* Header con gradiente */}
          <div className="relative px-6 pt-6 pb-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20" />
            <DialogHeader className="relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                    {task ? (
                      <AlignLeft className="w-5 h-5 text-white" />
                    ) : (
                      <Type className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div>
                    <DialogTitle className="text-lg font-bold text-white">
                      {task ? 'Editar tarea' : 'Nueva tarea'}
                    </DialogTitle>
                    <p className="text-sm text-gray-400">
                      {task ? 'Modifica los detalles de la tarea' : 'Crea una nueva tarea para tu board'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </DialogHeader>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
            {/* Título - Campo principal */}
            <Field className="space-y-2">
              <FieldLabel htmlFor="title" className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <Type className="w-4 h-4 text-gray-500" />
                Título de la tarea
                <span className="text-red-500">*</span>
              </FieldLabel>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="¿Qué necesitas hacer?"
                required
                className="h-12 px-4 text-base bg-gray-50 border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 placeholder:text-gray-400"
              />
            </Field>

            {/* Descripción */}
            <Field className="space-y-2">
              <FieldLabel htmlFor="description" className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <AlignLeft className="w-4 h-4 text-gray-500" />
                Descripción
              </FieldLabel>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Añade más detalles sobre la tarea (opcional)"
                rows={3}
                className="w-full px-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none resize-none transition-all duration-200"
              />
            </Field>

            {/* Grid de configuración */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Categoría */}
              <Field className="space-y-2">
                <FieldLabel className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-gray-500" />
                  Categoría
                </FieldLabel>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCategoryDropdown(!showCategoryDropdown)
                      setShowPriorityDropdown(false)
                    }}
                    className={`w-full h-11 px-3 flex items-center gap-2 rounded-xl border transition-all duration-200 ${categoryConfig[category].bg} ${categoryConfig[category].border}`}
                  >
                    <span>{categoryConfig[category].icon}</span>
                    <span className={`text-sm font-medium flex-1 text-left ${categoryConfig[category].color}`}>
                      {CATEGORIES.find(c => c.value === category)?.label}
                    </span>
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  <AnimatePresence>
                    {showCategoryDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl shadow-black/10 z-50 overflow-hidden"
                      >
                        {CATEGORIES.map((cat) => (
                          <button
                            key={cat.value}
                            type="button"
                            onClick={() => {
                              setCategory(cat.value as TaskCategory)
                              setShowCategoryDropdown(false)
                            }}
                            className={`w-full px-3 py-2.5 flex items-center gap-2 hover:bg-gray-50 transition-colors ${category === cat.value ? 'bg-gray-50' : ''}`}
                          >
                            <span>{categoryConfig[cat.value as TaskCategory].icon}</span>
                            <span className={`text-sm font-medium ${categoryConfig[cat.value as TaskCategory].color}`}>
                              {cat.label}
                            </span>
                            {category === cat.value && (
                              <Check className="w-4 h-4 text-gray-900 ml-auto" />
                            )}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Field>

              {/* Prioridad */}
              <Field className="space-y-2">
                <FieldLabel className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-gray-500" />
                  Prioridad
                </FieldLabel>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPriorityDropdown(!showPriorityDropdown)
                      setShowCategoryDropdown(false)
                    }}
                    className={`w-full h-11 px-3 flex items-center gap-2 rounded-xl border transition-all duration-200 ${priorityConfig[priority].bg} ${priorityConfig[priority].border}`}
                  >
                    <span>{priorityConfig[priority].icon}</span>
                    <span className={`text-sm font-medium flex-1 text-left ${priorityConfig[priority].color}`}>
                      {PRIORITIES.find(p => p.value === priority)?.label}
                    </span>
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  <AnimatePresence>
                    {showPriorityDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl shadow-black/10 z-50 overflow-hidden"
                      >
                        {PRIORITIES.map((p) => (
                          <button
                            key={p.value}
                            type="button"
                            onClick={() => {
                              setPriority(p.value as TaskPriority)
                              setShowPriorityDropdown(false)
                            }}
                            className={`w-full px-3 py-2.5 flex items-center gap-2 hover:bg-gray-50 transition-colors ${priority === p.value ? 'bg-gray-50' : ''}`}
                          >
                            <span>{priorityConfig[p.value as TaskPriority].icon}</span>
                            <span className={`text-sm font-medium ${priorityConfig[p.value as TaskPriority].color}`}>
                              {p.label}
                            </span>
                            {priority === p.value && (
                              <Check className="w-4 h-4 text-gray-900 ml-auto" />
                            )}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Field>

              {/* Fecha límite */}
              <Field className="space-y-2">
                <FieldLabel htmlFor="dueDate" className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  Fecha límite
                </FieldLabel>
                <Input
                  id="dueDate"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="h-11 px-3 text-sm bg-gray-50 border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200"
                />
              </Field>
            </div>

            {/* Botones de acción */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="h-11 px-6 text-sm font-medium text-gray-700 bg-white border-gray-200 hover:bg-gray-50 rounded-xl transition-colors"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={!title.trim()}
                className="h-11 px-6 text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {task ? 'Guardar cambios' : 'Crear tarea'}
              </Button>
            </div>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
