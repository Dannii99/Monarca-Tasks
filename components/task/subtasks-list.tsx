'use client'

import { useState, useCallback, useEffect, useMemo } from 'react'
import { Plus, Check, X, Trash2, Circle, CheckCircle2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Subtask {
  id: string
  title: string
  status: 'TODO' | 'IN_PROGRESS' | 'DONE'
  deletedAt: string | null
  createdAt: string
  updatedAt: string
}

interface SubtasksListProps {
  taskId: string
  subtasks: Subtask[]
  onSubtasksChange: (subtasks: Subtask[]) => void
  onActivityAdd: (activity: any) => void
}

const statusConfig = {
  TODO: {
    icon: Circle,
    label: 'Por hacer',
    color: 'text-slate-500',
    bg: 'bg-slate-100',
    hoverBg: 'hover:bg-slate-200'
  },
  IN_PROGRESS: {
    icon: AlertCircle,
    label: 'En progreso',
    color: 'text-orange-500',
    bg: 'bg-orange-100',
    hoverBg: 'hover:bg-orange-200'
  },
  DONE: {
    icon: CheckCircle2,
    label: 'Completada',
    color: 'text-emerald-500',
    bg: 'bg-emerald-100',
    hoverBg: 'hover:bg-emerald-200'
  }
}

export function SubtasksList({ taskId, subtasks, onSubtasksChange, onActivityAdd }: SubtasksListProps) {
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState('')
  const [loadingId, setLoadingId] = useState<string | null>(null)
  
  // Estado local para forzar recálculo del progreso
  const [progressState, setProgressState] = useState({ completed: 0, total: 0, percentage: 0 })

  // Recalcular progreso cuando cambien las subtareas
  useEffect(() => {
    const completed = subtasks.filter(st => st.status === 'DONE').length
    const total = subtasks.length
    const percentage = total > 0 ? (completed / total) * 100 : 0
    
    setProgressState({ completed, total, percentage })
    
    console.log('[SubtasksList] Progreso recalculado:', { 
      completed, 
      total, 
      percentage,
      subtasksCount: subtasks.length 
    })
  }, [subtasks])

  const { completed: completedCount, total: totalCount, percentage: progress } = progressState

  const handleAdd = useCallback(async () => {
    if (!newSubtaskTitle.trim()) return

    const tempId = `temp-${Date.now()}`
    const title = newSubtaskTitle.trim()
    
    const newSubtask: Subtask = {
      id: tempId,
      title: title,
      status: 'TODO',
      deletedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // Limpiar input inmediatamente para mejor UX
    setNewSubtaskTitle('')
    setIsAdding(false)
    
    // Optimistic update - agregar inmediatamente
    const updatedSubtasks = [...subtasks, newSubtask]
    onSubtasksChange(updatedSubtasks)

    try {
      const res = await fetch(`/api/tasks/${taskId}/subtasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title })
      })

      if (res.ok) {
        const saved = await res.json()
        // Reemplazar el temp con el real
        onSubtasksChange(updatedSubtasks.map(st => st.id === tempId ? saved : st))
        
        // Agregar actividad en segundo plano
        fetch(`/api/tasks/${taskId}/activities`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'subtask_added',
            details: title
          })
        }).then(res => {
          if (res.ok) return res.json()
        }).then(activity => {
          if (activity) onActivityAdd(activity)
        }).catch(console.error)
      } else {
        // Revert si falla
        onSubtasksChange(subtasks)
      }
    } catch (error) {
      console.error('Error adding subtask:', error)
      onSubtasksChange(subtasks)
    }
  }, [taskId, subtasks, newSubtaskTitle, onSubtasksChange, onActivityAdd])

  const handleStatusChange = useCallback(async (subtaskId: string, newStatus: 'TODO' | 'IN_PROGRESS' | 'DONE') => {
    const subtask = subtasks.find(st => st.id === subtaskId)
    if (!subtask || subtask.status === newStatus) return

    const oldStatus = subtask.status
    setLoadingId(subtaskId)

    // Optimistic update - actualizar UI inmediatamente
    const updatedSubtasks = subtasks.map(st => 
      st.id === subtaskId ? { ...st, status: newStatus } : st
    )
    onSubtasksChange(updatedSubtasks)

    try {
      const res = await fetch(`/api/tasks/${taskId}/subtasks/${subtaskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })

      if (res.ok) {
        const saved = await res.json()
        // Actualizar con datos del servidor
        onSubtasksChange(updatedSubtasks.map(st => st.id === subtaskId ? saved : st))
        
        // Agregar actividad en segundo plano
        fetch(`/api/tasks/${taskId}/activities`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'subtask_status_changed',
            details: `${subtask.title}: ${oldStatus} → ${newStatus}`
          })
        }).then(res => {
          if (res.ok) return res.json()
        }).then(activity => {
          if (activity) onActivityAdd(activity)
        }).catch(console.error)
      } else {
        // Revert si falla
        onSubtasksChange(subtasks)
      }
    } catch (error) {
      console.error('Error changing subtask status:', error)
      onSubtasksChange(subtasks)
    } finally {
      setLoadingId(null)
    }
  }, [taskId, subtasks, onSubtasksChange, onActivityAdd])

  const handleDelete = useCallback(async (subtaskId: string) => {
    const subtask = subtasks.find(st => st.id === subtaskId)
    if (!subtask) return

    // Optimistic update - eliminar inmediatamente
    const updatedSubtasks = subtasks.filter(st => st.id !== subtaskId)
    onSubtasksChange(updatedSubtasks)

    try {
      const res = await fetch(`/api/tasks/${taskId}/subtasks/${subtaskId}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        // Agregar actividad en segundo plano
        fetch(`/api/tasks/${taskId}/activities`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'subtask_deleted',
            details: subtask.title
          })
        }).then(res => {
          if (res.ok) return res.json()
        }).then(activity => {
          if (activity) onActivityAdd(activity)
        }).catch(console.error)
      } else {
        // Revert si falla
        onSubtasksChange([...updatedSubtasks, subtask])
      }
    } catch (error) {
      console.error('Error deleting subtask:', error)
      onSubtasksChange([...updatedSubtasks, subtask])
    }
  }, [taskId, subtasks, onSubtasksChange, onActivityAdd])

  const handleEdit = useCallback(async (subtaskId: string) => {
    const newTitle = editingTitle.trim()
    if (!newTitle || newTitle === subtasks.find(st => st.id === subtaskId)?.title) {
      setEditingId(null)
      setEditingTitle('')
      return
    }

    const subtask = subtasks.find(st => st.id === subtaskId)
    if (!subtask) return

    const oldTitle = subtask.title
    setLoadingId(subtaskId)

    // Optimistic update
    const updatedSubtasks = subtasks.map(st => 
      st.id === subtaskId ? { ...st, title: newTitle } : st
    )
    onSubtasksChange(updatedSubtasks)
    setEditingId(null)
    setEditingTitle('')

    try {
      const res = await fetch(`/api/tasks/${taskId}/subtasks/${subtaskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle })
      })

      if (res.ok) {
        const saved = await res.json()
        onSubtasksChange(updatedSubtasks.map(st => st.id === subtaskId ? saved : st))
        
        // Agregar actividad en segundo plano
        fetch(`/api/tasks/${taskId}/activities`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'subtask_edited',
            details: `${oldTitle} → ${newTitle}`
          })
        }).then(res => {
          if (res.ok) return res.json()
        }).then(activity => {
          if (activity) onActivityAdd(activity)
        }).catch(console.error)
      } else {
        onSubtasksChange(subtasks)
      }
    } catch (error) {
      console.error('Error editing subtask:', error)
      onSubtasksChange(subtasks)
    } finally {
      setLoadingId(null)
    }
  }, [taskId, subtasks, editingTitle, onSubtasksChange, onActivityAdd])

  const cycleStatus = (currentStatus: 'TODO' | 'IN_PROGRESS' | 'DONE') => {
    const order: ('TODO' | 'IN_PROGRESS' | 'DONE')[] = ['TODO', 'IN_PROGRESS', 'DONE']
    const currentIndex = order.indexOf(currentStatus)
    const nextIndex = (currentIndex + 1) % order.length
    return order[nextIndex]
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wide">
          Subtareas
        </h3>
        <span className="text-xs text-[var(--text-muted)]">
          {completedCount} de {totalCount} completadas
        </span>
      </div>

      {/* Progress bar - Siempre visible para sincronización */}
      <div className="h-2 bg-[var(--bg-subtle)] rounded-full overflow-hidden">
        <div 
          className="h-full bg-[var(--color-work)] transition-all duration-500 ease-out rounded-full"
          style={{ 
            width: `${progress}%`,
            minWidth: totalCount > 0 ? '4px' : '0px'
          }}
        />
      </div>

      {/* Add new subtask */}
      {!isAdding ? (
        <Button
          variant="ghost"
          onClick={() => setIsAdding(true)}
          className="w-full h-10 justify-start text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] rounded-xl"
        >
          <Plus className="w-4 h-4 mr-2" />
          Agregar subtarea
        </Button>
      ) : (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[var(--bg-muted)] flex items-center justify-center">
            <Circle className="w-4 h-4 text-[var(--text-muted)]" />
          </div>
          <Input
            value={newSubtaskTitle}
            onChange={(e) => setNewSubtaskTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAdd()
              if (e.key === 'Escape') {
                setIsAdding(false)
                setNewSubtaskTitle('')
              }
            }}
            placeholder="¿Qué necesitas hacer?"
            autoFocus
            maxLength={100}
            className="flex-1 h-10 bg-[var(--bg-subtle)] border-[var(--border-default)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] rounded-xl"
          />
          <Button
            size="sm"
            onClick={handleAdd}
            disabled={!newSubtaskTitle.trim()}
            className="h-10 w-10 p-0 bg-[var(--color-work)] hover:bg-[var(--color-active)] text-white rounded-xl"
          >
            <Check className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setIsAdding(false)
              setNewSubtaskTitle('')
            }}
            className="h-10 w-10 p-0 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] rounded-xl"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Subtasks list */}
      <div className="space-y-2">
        {subtasks.map((subtask) => {
          const config = statusConfig[subtask.status]
          const StatusIcon = config.icon
          const isLoading = loadingId === subtask.id
          
          return (
            <div
              key={subtask.id}
              className="group flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-subtle)] hover:bg-[var(--bg-muted)] transition-all duration-200"
            >
              {/* Status button - sin animación de spin */}
              <button
                onClick={() => !isLoading && handleStatusChange(subtask.id, cycleStatus(subtask.status))}
                disabled={isLoading}
                className={`
                  w-8 h-8 rounded-lg flex items-center justify-center transition-all
                  ${config.bg} ${config.color} ${config.hoverBg}
                  ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}
                `}
                title={config.label}
              >
                <StatusIcon className="w-4 h-4" />
              </button>
              
              {editingId === subtask.id ? (
                <div className="flex-1 flex items-center gap-2">
                  <Input
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleEdit(subtask.id)
                      if (e.key === 'Escape') {
                        setEditingId(null)
                        setEditingTitle('')
                      }
                    }}
                    onBlur={() => handleEdit(subtask.id)}
                    autoFocus
                    maxLength={100}
                    className="flex-1 h-8 bg-[var(--bg-surface)] border-[var(--border-focus)] text-[var(--text-primary)] text-sm rounded-lg"
                  />
                </div>
              ) : (
                <>
                  <span
                    onClick={() => {
                      setEditingId(subtask.id)
                      setEditingTitle(subtask.title)
                    }}
                    className={`
                      flex-1 text-sm cursor-pointer select-none
                      ${subtask.status === 'DONE' ? 'line-through text-[var(--text-muted)]' : 'text-[var(--text-primary)]'}
                      ${isLoading ? 'opacity-50' : ''}
                    `}
                  >
                    {subtask.title}
                  </span>
                  
                  {/* Status label */}
                  <span className={`text-xs px-2 py-1 rounded-md ${config.bg} ${config.color} hidden sm:inline`}>
                    {config.label}
                  </span>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(subtask.id)}
                    disabled={isLoading}
                    className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 text-[var(--text-muted)] hover:text-[var(--color-error)] hover:bg-[var(--color-error)]/10 rounded-lg transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
