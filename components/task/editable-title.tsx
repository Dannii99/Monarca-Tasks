'use client'

import { useState, useRef, useCallback } from 'react'
import { Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface EditableTitleProps {
  title: string
  onSave: (newTitle: string) => void
  isDone?: boolean
}

export function EditableTitle({ title, onSave, isDone }: EditableTitleProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState(title)
  const [isSaving, setIsSaving] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSave = useCallback(async () => {
    if (value.trim() && value.trim() !== title) {
      setIsSaving(true)
      await onSave(value.trim())
      setIsSaving(false)
    }
    setIsEditing(false)
  }, [value, title, onSave])

  const handleCancel = useCallback(() => {
    setValue(title)
    setIsEditing(false)
  }, [title])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSave()
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }, [handleSave, handleCancel])

  const handleBlur = useCallback(() => {
    // Pequeño delay para permitir clicks en los botones
    setTimeout(() => {
      if (document.activeElement !== inputRef.current) {
        handleSave()
      }
    }, 200)
  }, [handleSave])

  if (isEditing) {
    return (
      <div className="space-y-2">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          autoFocus
          maxLength={100}
          className="w-full text-2xl sm:text-3xl font-bold bg-[var(--bg-subtle)] border-2 border-[var(--border-focus)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:ring-4 focus:ring-[var(--border-focus)]/20 transition-all"
          placeholder="Título de la tarea"
        />
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={handleSave}
            disabled={isSaving || !value.trim()}
            className="h-8 px-3 bg-[var(--color-work)] hover:bg-[var(--color-active)] text-white"
          >
            <Check className="w-4 h-4 mr-1" />
            Guardar
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCancel}
            disabled={isSaving}
            className="h-8 px-3 text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)]"
          >
            <X className="w-4 h-4 mr-1" />
            Cancelar
          </Button>
        </div>
      </div>
    )
  }

  return (
    <h1 
      onClick={() => setIsEditing(true)}
      className={`
        text-2xl sm:text-3xl font-bold cursor-pointer rounded-xl px-4 py-3 -mx-4 -my-3
        transition-all duration-200
        hover:bg-[var(--bg-subtle)]
        ${isDone ? 'text-[var(--text-muted)] line-through' : 'text-[var(--text-primary)]'}
      `}
      title="Click para editar"
    >
      {title}
    </h1>
  )
}
