'use client'

import { useState, useCallback } from 'react'
import { Plus, Check, X, Trash2, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'

interface Subtask {
  id: string
  title: string
  completed: boolean
  createdAt: string
  updatedAt: string
}

interface SubtasksListProps {
  taskId: string
  subtasks: Subtask[]
  onSubtasksChange: (subtasks: Subtask[]) => void
  onActivityAdd: (activity: any) => void
}

export function SubtasksList({ taskId, subtasks, onSubtasksChange, onActivityAdd }: SubtasksListProps) {
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState('')

  const completedCount = subtasks.filter(st => st.completed).length
  const progress = subtasks.length > 0 ? (completedCount / subtasks.length) * 100 : 0

  const handleAdd = useCallback(async () => {
    if (!newSubtaskTitle.trim()) return

    const tempId = `temp-${Date.now()}`
    const newSubtask: Subtask = {
      id: tempId,
      title: newSubtaskTitle.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // Optimistic update
    onSubtasksChange([...subtasks, newSubtask])
    setNewSubtaskTitle('')
    setIsAdding(false)

    try {
      const res = await fetch(`/api/tasks/${taskId}/subtasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newSubtaskTitle.trim() })
      })

      if (res.ok) {
        const saved = await res.json()
        onSubtasksChange(subtasks.map(st => st.id === tempId ? saved : st))
        
        // Add activity
        const activityRes = await fetch(`/api/tasks/${taskId}/activities`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'subtask_added',
            details: newSubtaskTitle.trim()
          })
        })
        
        if (activityRes.ok) {
          const activity = await activityRes.json()
          onActivityAdd(activity)
        }
      } else {
        // Revert
        onSubtasksChange(subtasks.filter(st => st.id !== tempId))
      }
    } catch (error) {
      console.error('Error adding subtask:', error)
      onSubtasksChange(subtasks.filter(st => st.id !== tempId))
    }
  }, [taskId, subtasks, newSubtaskTitle, onSubtasksChange, onActivityAdd])

  const handleToggle = useCallback(async (subtaskId: string, completed: boolean) => {
    const subtask = subtasks.find(st => st.id === subtaskId)
    if (!subtask) return

    // Optimistic update
    onSubtasksChange(subtasks.map(st => 
      st.id === subtaskId ? { ...st, completed } : st
    ))

    try {
      const res = await fetch(`/api/tasks/${taskId}/subtasks/${subtaskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed })
      })

      if (res.ok) {
        const updated = await res.json()
        onSubtasksChange(subtasks.map(st => st.id === subtaskId ? updated : st))
        
        // Add activity
        const action = completed ? 'subtask_completed' : 'subtask_uncompleted'
        const activityRes = await fetch(`/api/tasks/${taskId}/activities`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action,
            details: subtask.title
          })
        })
        
        if (activityRes.ok) {
          const activity = await activityRes.json()
          onActivityAdd(activity)
        }
      } else {
        // Revert
        onSubtasksChange(subtasks)
      }
    } catch (error) {
      console.error('Error toggling subtask:', error)
      onSubtasksChange(subtasks)
    }
  }, [taskId, subtasks, onSubtasksChange, onActivityAdd])

  const handleDelete = useCallback(async (subtaskId: string) => {
    const subtask = subtasks.find(st => st.id === subtaskId)
    if (!subtask) return

    // Optimistic update
    onSubtasksChange(subtasks.filter(st => st.id !== subtaskId))

    try {
      const res = await fetch(`/api/tasks/${taskId}/subtasks/${subtaskId}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        // Add activity
        const activityRes = await fetch(`/api/tasks/${taskId}/activities`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'subtask_deleted',
            details: subtask.title
          })
        })
        
        if (activityRes.ok) {
          const activity = await activityRes.json()
          onActivityAdd(activity)
        }
      } else {
        // Revert
        onSubtasksChange([...subtasks, subtask])
      }
    } catch (error) {
      console.error('Error deleting subtask:', error)
      onSubtasksChange([...subtasks, subtask])
    }
  }, [taskId, subtasks, onSubtasksChange, onActivityAdd])

  const handleEdit = useCallback(async (subtaskId: string) => {
    if (!editingTitle.trim() || editingTitle === subtasks.find(st => st.id === subtaskId)?.title) {
      setEditingId(null)
      setEditingTitle('')
      return
    }

    const subtask = subtasks.find(st => st.id === subtaskId)
    if (!subtask) return

    const oldTitle = subtask.title

    // Optimistic update
    onSubtasksChange(subtasks.map(st => 
      st.id === subtaskId ? { ...st, title: editingTitle.trim() } : st
    ))
    setEditingId(null)
    setEditingTitle('')

    try {
      const res = await fetch(`/api/tasks/${taskId}/subtasks/${subtaskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editingTitle.trim() })
      })

      if (res.ok) {
        const updated = await res.json()
        onSubtasksChange(subtasks.map(st => st.id === subtaskId ? updated : st))
        
        // Add activity
        const activityRes = await fetch(`/api/tasks/${taskId}/activities`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'subtask_edited',
            details: `${oldTitle} → ${editingTitle.trim()}`
          })
        })
        
        if (activityRes.ok) {
          const activity = await activityRes.json()
          onActivityAdd(activity)
        }
      } else {
        // Revert
        onSubtasksChange(subtasks)
      }
    } catch (error) {
      console.error('Error editing subtask:', error)
      onSubtasksChange(subtasks)
    }
  }, [taskId, subtasks, editingTitle, onSubtasksChange, onActivityAdd])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wide">
          Subtareas
        </h3>
        <span className="text-xs text-[var(--text-muted)]">
          {completedCount} de {subtasks.length} completadas
        </span>
      </div>

      {/* Progress bar */}
      {subtasks.length > 0 && (
        <div className="h-2 bg-[var(--bg-subtle)] rounded-full overflow-hidden">
          <div 
            className="h-full bg-[var(--color-work)] transition-all duration-500 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

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
          <Checkbox className="ml-1" disabled />
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
        {subtasks.map((subtask) => (
          <div
            key={subtask.id}
            className={`
              group flex items-center gap-3 p-3 rounded-xl
              transition-all duration-200
              ${subtask.completed ? 'bg-[var(--bg-subtle)]/50' : 'bg-[var(--bg-subtle)]'}
              hover:bg-[var(--bg-muted)]
            `}
          >
            <Checkbox
              checked={subtask.completed}
              onCheckedChange={(checked) => handleToggle(subtask.id, checked as boolean)}
              className="border-[var(--border-strong)] data-[state=checked]:bg-[var(--color-work)] data-[state=checked]:border-[var(--color-work)]"
            />
            
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
                    ${subtask.completed ? 'line-through text-[var(--text-muted)]' : 'text-[var(--text-primary)]'}
                  `}
                >
                  {subtask.title}
                </span>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(subtask.id)}
                  className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 text-[var(--text-muted)] hover:text-[var(--color-error)] hover:bg-[var(--color-error)]/10 rounded-lg transition-opacity"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
