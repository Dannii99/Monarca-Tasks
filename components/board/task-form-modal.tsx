'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Calendar, X, Type, AlignLeft, Tag, AlertCircle, Check, Briefcase, Home, User, ChevronDown, Flame, Minus, ArrowDown, AlertTriangle } from 'lucide-react'
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

const priorityConfig: Record<TaskPriority, { color: string; bg: string; border: string; icon: typeof Flame }> = {
  HIGH: {
    color: 'text-red-700',
    bg: 'bg-red-50',
    border: 'border-red-200',
    icon: Flame,
  },
  MEDIUM: {
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    icon: Minus,
  },
  LOW: {
    color: 'text-green-700',
    bg: 'bg-green-50',
    border: 'border-green-200',
    icon: ArrowDown,
  },
}

const categoryConfig: Record<TaskCategory, { color: string; bg: string; border: string; icon: typeof Briefcase; label: string }> = {
  WORK: {
    color: 'text-blue-700',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: Briefcase,
    label: 'Trabajo',
  },
  HOME: {
    color: 'text-green-700',
    bg: 'bg-green-50',
    border: 'border-green-200',
    icon: Home,
    label: 'Hogar',
  },
  PERSONAL: {
    color: 'text-purple-700',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    icon: User,
    label: 'Personal',
  },
}

// Funciones de validación y sanitización
const VALIDATION = {
  title: {
    maxLength: 100,
    // Permitir letras, números, espacios, y caracteres básicos de puntuación
    pattern: /^[\w\s\-_'"!?.,:;()[\]{}@#&+*/=|<>$%^~`áéíóúÁÉÍÓÚñÑüÜ]+$/u,
    sanitize: (value: string): string => {
      // Eliminar caracteres potencialmente peligrosos
      return value
        .replace(/[<>]/g, '') // Eliminar < y > para prevenir XSS
        .replace(/javascript:/gi, '') // Eliminar protocolos javascript
        .replace(/on\w+=/gi, '') // Eliminar event handlers
        .slice(0, 100) // Limitar longitud
    }
  },
  description: {
    maxLength: 500,
    // Más permisivo para descripciones largas pero aún seguro
    sanitize: (value: string): string => {
      return value
        .replace(/[<>]/g, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+=/gi, '')
        .slice(0, 500)
    }
  }
}

export function TaskFormModal({ open, onOpenChange, task, onSave }: TaskFormModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<TaskCategory>('PERSONAL')
  const [priority, setPriority] = useState<TaskPriority>('MEDIUM')
  const [dueDate, setDueDate] = useState('')
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false)
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
  const [errors, setErrors] = useState<{ title?: string; description?: string }>({})
  
  const categoryRef = useRef<HTMLDivElement>(null)
  const priorityRef = useRef<HTMLDivElement>(null)

  // Verificar si hay errores reales (no solo keys undefined)
  const hasErrors = Object.values(errors).some(error => error !== undefined && error !== '')
  const isFormValid = title.trim().length > 0 && !hasErrors

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
    setErrors({})
  }, [task, open])

  // Cerrar dropdowns al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setShowCategoryDropdown(false)
      }
      if (priorityRef.current && !priorityRef.current.contains(event.target as Node)) {
        setShowPriorityDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const validateTitle = (value: string): boolean => {
    const sanitized = VALIDATION.title.sanitize(value)
    if (sanitized !== value) {
      setErrors(prev => ({ ...prev, title: 'El título contiene caracteres no permitidos' }))
      return false
    }
    if (value.length > VALIDATION.title.maxLength) {
      setErrors(prev => ({ ...prev, title: `Máximo ${VALIDATION.title.maxLength} caracteres` }))
      return false
    }
    setErrors(prev => ({ ...prev, title: undefined }))
    return true
  }

  const validateDescription = (value: string): boolean => {
    const sanitized = VALIDATION.description.sanitize(value)
    if (sanitized !== value) {
      setErrors(prev => ({ ...prev, description: 'La descripción contiene caracteres no permitidos' }))
      return false
    }
    if (value.length > VALIDATION.description.maxLength) {
      setErrors(prev => ({ ...prev, description: `Máximo ${VALIDATION.description.maxLength} caracteres` }))
      return false
    }
    setErrors(prev => ({ ...prev, description: undefined }))
    return true
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setTitle(value)
    validateTitle(value)
  }

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setDescription(value)
    validateDescription(value)
  }

  const handleTitleBlur = () => {
    const sanitized = VALIDATION.title.sanitize(title)
    if (sanitized !== title) {
      setTitle(sanitized)
    }
  }

  const handleDescriptionBlur = () => {
    const sanitized = VALIDATION.description.sanitize(description)
    if (sanitized !== description) {
      setDescription(sanitized)
    }
  }

  // Prevenir pegar contenido malicioso
  const handlePaste = (e: React.ClipboardEvent, type: 'title' | 'description') => {
    e.preventDefault()
    const pastedText = e.clipboardData.getData('text')
    const sanitized = type === 'title' 
      ? VALIDATION.title.sanitize(pastedText)
      : VALIDATION.description.sanitize(pastedText)
    
    if (type === 'title') {
      setTitle(sanitized)
      validateTitle(sanitized)
    } else {
      setDescription(sanitized)
      validateDescription(sanitized)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validación final antes de enviar
    const isTitleValid = validateTitle(title)
    const isDescriptionValid = validateDescription(description)
    
    if (!isTitleValid || !isDescriptionValid) {
      return
    }

    if (!title.trim()) return

    // Sanitizar antes de enviar
    const sanitizedTitle = VALIDATION.title.sanitize(title.trim())
    const sanitizedDescription = description.trim() ? VALIDATION.description.sanitize(description.trim()) : null

    onSave({
      title: sanitizedTitle,
      description: sanitizedDescription,
      category,
      priority,
      dueDate: dueDate || null,
    })
  }

  const handleClose = useCallback(() => {
    setShowPriorityDropdown(false)
    setShowCategoryDropdown(false)
    setErrors({})
    onOpenChange(false)
  }, [onOpenChange])

  const PriorityIcon = priorityConfig[priority].icon
  const CategoryIcon = categoryConfig[category].icon

  // Calcular fecha máxima (5 años desde ahora)
  const maxDate = new Date()
  maxDate.setFullYear(maxDate.getFullYear() + 5)
  const maxDateString = maxDate.toISOString().split('T')[0]

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent 
        className="sm:max-w-[560px] p-0 overflow-hidden border-0 bg-white shadow-2xl rounded-2xl focus:outline-none focus-visible:outline-none focus-visible:ring-0"
        showCloseButton={false}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
          className="outline-none focus:outline-none bg-[var(--bg-surface)] rounded-2xl"
        >
          {/* Header con gradiente */}
          <div className="relative px-6 pt-6 pb-5 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10" />
            <DialogHeader className="relative z-10">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center ring-1 ring-white/20">
                    {task ? (
                      <AlignLeft className="w-6 h-6 text-white" />
                    ) : (
                      <Type className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div>
                    <DialogTitle className="text-xl font-bold text-white">
                      {task ? 'Editar tarea' : 'Nueva tarea'}
                    </DialogTitle>
                    <p className="text-sm text-slate-400 mt-1">
                      {task ? 'Modifica los detalles de la tarea' : 'Crea una nueva tarea para tu tablero'}
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleClose}
                  className="w-9 h-9 rounded-lg bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-colors ring-1 ring-white/20"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </DialogHeader>
          </div>

          {/* Formulario con mejor espaciado */}
          <form onSubmit={handleSubmit} className="px-6 py-8 space-y-6 bg-[var(--bg-surface)]">
            {/* Título - Campo principal */}
            <Field className="space-y-3">
              <FieldLabel htmlFor="title" className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-2">
                <Type className="w-4 h-4 text-[var(--text-muted)]" />
                Título de la tarea
                <span className="text-[var(--color-error)]">*</span>
              </FieldLabel>
              <div className="relative">
                <Input
                  id="title"
                  value={title}
                  onChange={handleTitleChange}
                  onBlur={handleTitleBlur}
                  onPaste={(e) => handlePaste(e, 'title')}
                  placeholder="¿Qué necesitas hacer?"
                  required
                  maxLength={VALIDATION.title.maxLength}
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck="false"
                  className={`h-12 px-4 text-base bg-[var(--bg-subtle)] border-[var(--border-default)] rounded-xl focus:bg-[var(--bg-surface)] focus:ring-4 transition-all duration-200 placeholder:text-[var(--text-muted)] ${
                    errors.title ? 'border-[var(--color-error)] focus:border-[var(--color-error)] focus:ring-[var(--color-error)]/10' : 'focus:border-[var(--color-active)] focus:ring-[var(--color-active)]/10'
                  }`}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                  {title.length}/{VALIDATION.title.maxLength}
                </div>
              </div>
              {errors.title && (
                <div className="flex items-center gap-1.5 text-xs text-red-600">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{errors.title}</span>
                </div>
              )}
              <p className="text-xs text-gray-400">
                Máximo {VALIDATION.title.maxLength} caracteres. No se permiten caracteres especiales peligrosos.
              </p>
            </Field>

            {/* Descripción */}
            <Field className="space-y-3">
              <FieldLabel htmlFor="description" className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-2">
                <AlignLeft className="w-4 h-4 text-[var(--text-muted)]" />
                Descripción
              </FieldLabel>
              <div className="relative">
                <textarea
                  id="description"
                  value={description}
                  onChange={handleDescriptionChange}
                  onBlur={handleDescriptionBlur}
                  onPaste={(e) => handlePaste(e, 'description')}
                  placeholder="Añade más detalles sobre la tarea (opcional)"
                  rows={3}
                  maxLength={VALIDATION.description.maxLength}
                  autoComplete="off"
                  spellCheck="false"
                  className={`w-full px-4 py-3 text-sm bg-[var(--bg-subtle)] border border-[var(--border-default)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:bg-[var(--bg-surface)] focus:ring-4 focus:outline-none resize-none transition-all duration-200 ${
                    errors.description ? 'border-[var(--color-error)] focus:border-[var(--color-error)] focus:ring-[var(--color-error)]/10' : 'focus:border-[var(--color-active)] focus:ring-[var(--color-active)]/10'
                  }`}
                />
                <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                  {description.length}/{VALIDATION.description.maxLength}
                </div>
              </div>
              {errors.description && (
                <div className="flex items-center gap-1.5 text-xs text-red-600">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{errors.description}</span>
                </div>
              )}
            </Field>

            {/* Grid de configuración con mejor espaciado */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {/* Categoría */}
              <div ref={categoryRef}>
                <Field className="space-y-3">
                  <FieldLabel className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-2">
                    <Tag className="w-4 h-4 text-[var(--text-muted)]" />
                    Categoría
                  </FieldLabel>
                  <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCategoryDropdown(!showCategoryDropdown)
                      setShowPriorityDropdown(false)
                    }}
                    className={`w-full h-12 px-3 flex items-center gap-2.5 rounded-xl border transition-all duration-200 ${categoryConfig[category].bg} ${categoryConfig[category].border} hover:shadow-sm`}
                  >
                    <CategoryIcon className={`w-4 h-4 ${categoryConfig[category].color}`} />
                    <span className={`text-sm font-medium flex-1 text-left ${categoryConfig[category].color}`}>
                      {categoryConfig[category].label}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${showCategoryDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  
<AnimatePresence>
                     {showCategoryDropdown && (
                       <motion.div
                         initial={{ opacity: 0, y: -8, scale: 0.95 }}
                         animate={{ opacity: 1, y: 0, scale: 1 }}
                         exit={{ opacity: 0, y: -8, scale: 0.95 }}
                         transition={{ duration: 0.15 }}
                         className="absolute top-full left-0 right-0 mt-2 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-xl shadow-xl shadow-black/10 z-50 overflow-hidden"
                       >
                         {CATEGORIES.map((cat) => {
                           const CatIcon = categoryConfig[cat.value as TaskCategory].icon
                           return (
                             <button
                               key={cat.value}
                               type="button"
                               onClick={() => {
                                 setCategory(cat.value as TaskCategory)
                                 setShowCategoryDropdown(false)
                               }}
                               className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-[var(--bg-subtle)] transition-colors ${category === cat.value ? 'bg-[var(--bg-subtle)]' : ''}`}
                             >
                               <CatIcon className={`w-4 h-4 ${categoryConfig[cat.value as TaskCategory].color}`} />
                               <span className={`text-sm font-medium ${categoryConfig[cat.value as TaskCategory].color}`}>
                                 {cat.label}
                               </span>
                               {category === cat.value && (
                                 <Check className="w-4 h-4 text-[var(--text-primary)] ml-auto" />
                               )}
                             </button>
                           )
                         })}
                       </motion.div>
                     )}
                   </AnimatePresence>
                </div>
              </Field>
              </div>

              {/* Prioridad */}
              <div ref={priorityRef}>
                <Field className="space-y-3">
<FieldLabel className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-2">
                     <AlertCircle className="w-4 h-4 text-[var(--text-muted)]" />
                     Prioridad
                   </FieldLabel>
                  <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPriorityDropdown(!showPriorityDropdown)
                      setShowCategoryDropdown(false)
                    }}
                    className={`w-full h-12 px-3 flex items-center gap-2.5 rounded-xl border transition-all duration-200 ${priorityConfig[priority].bg} ${priorityConfig[priority].border} hover:shadow-sm`}
                  >
                    <PriorityIcon className={`w-4 h-4 ${priorityConfig[priority].color}`} />
                    <span className={`text-sm font-medium flex-1 text-left ${priorityConfig[priority].color}`}>
                      {PRIORITIES.find(p => p.value === priority)?.label}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${showPriorityDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  
<AnimatePresence>
                     {showPriorityDropdown && (
                       <motion.div
                         initial={{ opacity: 0, y: -8, scale: 0.95 }}
                         animate={{ opacity: 1, y: 0, scale: 1 }}
                         exit={{ opacity: 0, y: -8, scale: 0.95 }}
                         transition={{ duration: 0.15 }}
                         className="absolute top-full left-0 right-0 mt-2 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-xl shadow-xl shadow-black/10 z-50 overflow-hidden"
                       >
                         {PRIORITIES.map((p) => {
                           const PrioIcon = priorityConfig[p.value as TaskPriority].icon
                           return (
                             <button
                               key={p.value}
                               type="button"
                               onClick={() => {
                                 setPriority(p.value as TaskPriority)
                                 setShowPriorityDropdown(false)
                               }}
                               className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-[var(--bg-subtle)] transition-colors ${priority === p.value ? 'bg-[var(--bg-subtle)]' : ''}`}
                             >
                               <PrioIcon className={`w-4 h-4 ${priorityConfig[p.value as TaskPriority].color}`} />
                               <span className={`text-sm font-medium ${priorityConfig[p.value as TaskPriority].color}`}>
                                 {p.label}
                               </span>
                               {priority === p.value && (
                                 <Check className="w-4 h-4 text-[var(--text-primary)] ml-auto" />
                               )}
                             </button>
                           )
                         })}
                       </motion.div>
                     )}
                   </AnimatePresence>
                </div>
              </Field>
              </div>

              {/* Fecha límite */}
              <Field className="space-y-3">
<FieldLabel htmlFor="dueDate" className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-2">
                   <Calendar className="w-4 h-4 text-[var(--text-muted)]" />
                   Fecha límite
                 </FieldLabel>
                 <Input
                   id="dueDate"
                   type="date"
                   value={dueDate}
                   onChange={(e) => setDueDate(e.target.value)}
                   min={new Date().toISOString().split('T')[0]}
                   max={maxDateString}
                   className="h-12 px-3 text-sm bg-[var(--bg-subtle)] border-[var(--border-default)] rounded-xl focus:bg-[var(--bg-surface)] focus:border-[var(--color-active)] focus:ring-4 focus:ring-[var(--color-active)]/10 transition-all duration-200"
                 />
                 <p className="text-xs text-[var(--text-muted)]">
                   Máximo 5 años en el futuro
                 </p>
              </Field>
            </div>

            {/* Botones de acción con mejor espaciado */}
<div className="flex items-center justify-end gap-3 pt-6 mt-2 border-t border-[var(--border-default)]">
               <Button
                 type="button"
                 variant="outline"
                 onClick={handleClose}
                 className="h-11 px-6 text-sm font-medium text-[var(--text-secondary)] bg-[var(--bg-surface)] border-[var(--border-default)] hover:bg-[var(--bg-subtle)] rounded-xl transition-colors"
               >
                 Cancelar
               </Button>
              <Button
                type="submit"
                disabled={!isFormValid}
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
