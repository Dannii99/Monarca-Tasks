'use client'

import { useState, useRef, useCallback } from 'react'
import { Bold, List, Link as LinkIcon, Code, Quote } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface TaskDescriptionProps {
  description: string
  onSave: (description: string) => void
}

export function TaskDescription({ description, onSave }: TaskDescriptionProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState(description)
  const [isSaving, setIsSaving] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSave = useCallback(async () => {
    if (value !== description) {
      setIsSaving(true)
      await onSave(value)
      setIsSaving(false)
    }
    setIsEditing(false)
  }, [value, description, onSave])

  const handleCancel = useCallback(() => {
    setValue(description)
    setIsEditing(false)
  }, [description])

  const handleBlur = useCallback(() => {
    setTimeout(() => {
      if (document.activeElement !== textareaRef.current) {
        handleSave()
      }
    }, 300)
  }, [handleSave])

  // Funciones de formato
  const insertFormat = useCallback((format: string) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)
    let newText = value

    switch (format) {
      case 'bold':
        newText = value.substring(0, start) + `**${selectedText || 'texto'}**` + value.substring(end)
        break
      case 'list':
        newText = value.substring(0, start) + `\n- ${selectedText || 'item'}` + value.substring(end)
        break
      case 'link':
        newText = value.substring(0, start) + `[${selectedText || 'texto'}](url)` + value.substring(end)
        break
      case 'code':
        newText = value.substring(0, start) + '`' + (selectedText || 'código') + '`' + value.substring(end)
        break
      case 'quote':
        newText = value.substring(0, start) + `\n> ${selectedText || 'cita'}` + value.substring(end)
        break
    }

    setValue(newText)
    // Restaurar foco después del render
    setTimeout(() => textarea.focus(), 0)
  }, [value])

  // Renderizar markdown simple
  const renderMarkdown = useCallback((text: string): React.ReactElement => {
    if (!text.trim()) {
      return <p className="text-[var(--text-muted)] italic">Agrega una descripción...</p>
    }

    // Split por líneas y procesar
    const lines = text.split('\n')
    const elements: React.ReactNode[] = []
    let key = 0

    lines.forEach((line, index) => {
      // Headers
      if (line.startsWith('### ')) {
        elements.push(
          <h3 key={key++} className="text-lg font-bold mt-4 mb-2 text-[var(--text-primary)]">
            {processInlineFormatting(line.slice(4))}
          </h3>
        )
      } else if (line.startsWith('## ')) {
        elements.push(
          <h2 key={key++} className="text-xl font-bold mt-5 mb-3 text-[var(--text-primary)]">
            {processInlineFormatting(line.slice(3))}
          </h2>
        )
      } else if (line.startsWith('# ')) {
        elements.push(
          <h1 key={key++} className="text-2xl font-bold mt-6 mb-4 text-[var(--text-primary)]">
            {processInlineFormatting(line.slice(2))}
          </h1>
        )
      }
      // Listas
      else if (line.startsWith('- ') || line.startsWith('* ')) {
        elements.push(
          <li key={key++} className="ml-4 text-[var(--text-secondary)] leading-relaxed">
            {processInlineFormatting(line.slice(2))}
          </li>
        )
      }
      // Citas
      else if (line.startsWith('> ')) {
        elements.push(
          <blockquote key={key++} className="border-l-4 border-[var(--color-work)] pl-4 py-2 my-3 bg-[var(--bg-subtle)] rounded-r-lg">
            <p className="text-[var(--text-secondary)] italic">
              {processInlineFormatting(line.slice(2))}
            </p>
          </blockquote>
        )
      }
      // Líneas vacías
      else if (line.trim() === '') {
        elements.push(<div key={key++} className="h-2" />)
      }
      // Texto normal
      else {
        elements.push(
          <p key={key++} className="text-[var(--text-secondary)] leading-relaxed mb-2">
            {processInlineFormatting(line)}
          </p>
        )
      }
    })

    return <div className="space-y-1">{elements}</div>
  }, [])

  // Procesar formato inline (negrita, código, links)
  const processInlineFormatting = (text: string): React.ReactNode => {
    const parts: React.ReactNode[] = []
    let remaining = text
    let key = 0

    // Procesar **negrita**, `código`, [links](url)
    const patterns = [
      { regex: /`([^`]+)`/g, type: 'code' },
      { regex: /\*\*([^*]+)\*\*/g, type: 'bold' },
      { regex: /\[([^\]]+)\]\(([^)]+)\)/g, type: 'link' }
    ]

    // Simplificación: procesar en orden
    let lastIndex = 0
    
    // Procesar código inline
    remaining.replace(/`([^`]+)`/g, (match, code, offset) => {
      if (offset > lastIndex) {
        parts.push(remaining.slice(lastIndex, offset))
      }
      parts.push(
        <code key={key++} className="px-1.5 py-0.5 bg-[var(--bg-muted)] text-[var(--text-primary)] rounded text-sm font-mono">
          {code}
        </code>
      )
      lastIndex = offset + match.length
      return match
    })

    if (lastIndex < remaining.length) {
      parts.push(remaining.slice(lastIndex))
    }

    // Si no se encontró código, procesar negrita
    if (parts.length === 1 && typeof parts[0] === 'string') {
      const text = parts[0] as string
      parts.length = 0
      lastIndex = 0
      
      text.replace(/\*\*([^*]+)\*\*/g, (match, bold, offset) => {
        if (offset > lastIndex) {
          parts.push(text.slice(lastIndex, offset))
        }
        parts.push(
          <strong key={key++} className="font-bold text-[var(--text-primary)]">
            {bold}
          </strong>
        )
        lastIndex = offset + match.length
        return match
      })

      if (lastIndex < text.length) {
        parts.push(text.slice(lastIndex))
      }
    }

    return parts.length > 0 ? parts : text
  }

  if (isEditing) {
    return (
      <div className="space-y-3">
        {/* Toolbar */}
        <div className="flex items-center gap-1 p-2 bg-[var(--bg-subtle)] rounded-lg border border-[var(--border-default)]">
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => insertFormat('bold')}
            className="h-8 w-8 p-0 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)]"
            title="Negrita (**texto**)"
          >
            <Bold className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => insertFormat('list')}
            className="h-8 w-8 p-0 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)]"
            title="Lista (- item)"
          >
            <List className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => insertFormat('link')}
            className="h-8 w-8 p-0 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)]"
            title="Link [texto](url)"
          >
            <LinkIcon className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => insertFormat('code')}
            className="h-8 w-8 p-0 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)]"
            title="Código inline"
          >
            <Code className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => insertFormat('quote')}
            className="h-8 w-8 p-0 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)]"
            title="Cita (> texto)"
          >
            <Quote className="w-4 h-4" />
          </Button>
          <div className="flex-1" />
          <span className="text-xs text-[var(--text-muted)]">Markdown soportado</span>
        </div>

        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleBlur}
          autoFocus
          rows={8}
          maxLength={2000}
          className="w-full bg-[var(--bg-subtle)] border-2 border-[var(--border-focus)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:ring-4 focus:ring-[var(--border-focus)]/20 transition-all resize-none font-mono text-sm"
          placeholder="Describe los detalles de la tarea...

Puedes usar:
- **negrita**
- Listas con - o *
- [links](url)
- `código inline`
- > citas"
        />
        
        <div className="flex items-center justify-between">
          <span className="text-xs text-[var(--text-muted)]">
            {value.length}/2000 caracteres
          </span>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={handleCancel}
              disabled={isSaving}
              className="text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)]"
            >
              Cancelar
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isSaving}
              className="bg-[var(--color-work)] hover:bg-[var(--color-active)] text-white"
            >
              {isSaving ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      onClick={() => setIsEditing(true)}
      className="cursor-pointer rounded-xl p-4 -mx-4 -my-4 transition-all duration-200 hover:bg-[var(--bg-subtle)] min-h-[100px]"
      title="Click para editar"
    >
      {renderMarkdown(value)}
    </div>
  )
}
