'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { motion, AnimatePresence } from 'motion/react'
import { Task, TaskStatus } from '@/types/task'
import { Column } from './column'
import { BoardToolbar } from './board-toolbar'
import { STATUS_COLUMNS } from '@/lib/constants'
import { Circle, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useLoading } from '@/components/ui/loading'
import { useNotifications, useNotificationMute } from '@/hooks/use-notifications'

interface BoardProps {
  initialTasks: Task[]
  userName: string
  userEmail: string
}

// Configuración de tabs para móvil
const statusTabs = [
  { value: 'TODO', label: 'Por hacer', icon: Circle, color: 'text-slate-500' },
  { value: 'IN_PROGRESS', label: 'En progreso', icon: Loader2, color: 'text-blue-500' },
  { value: 'DONE', label: 'Completadas', icon: CheckCircle2, color: 'text-emerald-500' },
]

export function Board({ initialTasks, userName, userEmail }: BoardProps) {
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<string>('priority')
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null)
  // Estado para controlar qué columna se muestra en móvil
  const [activeTab, setActiveTab] = useState<TaskStatus>('TODO')
  // Estado para el diálogo de confirmación de eliminación
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null)
  // Hook de loading
  const { startLoading, stopLoading } = useLoading()
  // Estado para notificaciones silenciadas
  const { isMuted, setMuted } = useNotificationMute()
  const [notificationsMuted, setNotificationsMuted] = useState(false)
  
  // Inicializar estado de notificaciones
  useEffect(() => {
    setNotificationsMuted(isMuted())
  }, [])
  
  // Hook de notificaciones
  useNotifications(tasks, notificationsMuted)
  
  // Toggle de notificaciones
  const handleToggleNotifications = () => {
    const newState = !notificationsMuted
    setNotificationsMuted(newState)
    setMuted(newState)
  }

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

  // Contar tareas por estado para mostrar en tabs
  const getTaskCount = (status: TaskStatus) => 
    filteredTasks.filter((t) => t.status === status).length

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

    startLoading('Moviendo tarea...')
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
    } finally {
      stopLoading()
    }

    setDraggedTaskId(null)
  }

  const handleDelete = (id: string) => {
    setTaskToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!taskToDelete) return

    setTasks((prev) => prev.filter((t) => t.id !== taskToDelete))
    startLoading('Eliminando tarea...')

    try {
      await fetch(`/api/tasks/${taskToDelete}`, { method: 'DELETE' })
    } catch {
      setTasks((prev) => [...prev, tasks.find((t) => t.id === taskToDelete)!])
    } finally {
      stopLoading()
      setDeleteDialogOpen(false)
      setTaskToDelete(null)
    }
  }

  const handleComplete = async (id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status: 'DONE' as TaskStatus, isOverdue: false } : t
      )
    )

    startLoading('Completando tarea...')
    try {
      await fetch(`/api/tasks/${id}/move`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'DONE' }),
      })
    } catch {
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status: tasks.find((x) => x.id === id)?.status as TaskStatus, isOverdue: tasks.find((x) => x.id === id)?.isOverdue ?? false } : t)))
    } finally {
      stopLoading()
    }
  }

  const handleOpenNewTask = () => {
    router.push('/task/new')
  }

  const handleLogout = () => {
    signOut({ callbackUrl: '/login' })
  }

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-[var(--bg-base)]">
      {/* Header Fijo */}
      <BoardToolbar
        search={search}
        onSearchChange={setSearch}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        onAddTask={handleOpenNewTask}
        onLogout={handleLogout}
        pendingCount={pendingCount}
        urgentCount={urgentCount}
        doneCount={doneCount}
        userName={userName}
        userEmail={userEmail}
        notificationsMuted={notificationsMuted}
        onToggleNotifications={handleToggleNotifications}
      />

      {/* Contenido Principal */}
      <div className="flex-1 overflow-hidden relative">
        {/* Vista Desktop: Grid de columnas */}
        <div className="hidden xl:block h-full overflow-x-auto overflow-y-hidden">
          <div className="h-full p-6 lg:p-8">
            <div className="grid grid-cols-3 gap-6 h-full min-w-[1000px] max-w-[1600px] mx-auto">
              {STATUS_COLUMNS.map((status) => (
                <Column
                  key={status}
                  status={status}
                  tasks={filteredTasks}
                  onDelete={handleDelete}
                  onComplete={handleComplete}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onAddTask={handleOpenNewTask}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Vista Tablet/Móvil: Una columna */}
        <div className="xl:hidden h-full flex flex-col">
          {/* Contenido scrollable de la columna activa */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden bg-[var(--bg-base)]">
            <div className="p-4 pb-24 max-w-lg mx-auto">
              <Column
                status={activeTab}
                tasks={filteredTasks}
                onDelete={handleDelete}
                onComplete={handleComplete}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onAddTask={handleOpenNewTask}
                isMobile
              />
            </div>
          </div>

          {/* Bottom Navigation tipo app (opcional, para móviles pequeños) */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[var(--bg-surface)] border-t border-[var(--border-default)] px-2 py-2 safe-area-pb z-30">
            <div className="flex items-center justify-around">
              {statusTabs.map((tab) => {
                const Icon = tab.icon
                const count = getTaskCount(tab.value as TaskStatus)
                const isActive = activeTab === tab.value
                
                return (
                  <motion.button
                    key={tab.value}
                    onClick={() => setActiveTab(tab.value as TaskStatus)}
                    className={`
                      relative flex flex-col items-center gap-1 px-3 py-2 rounded-xl
                      transition-all duration-200 min-w-[70px]
                      ${isActive 
                        ? 'text-[var(--color-work)]' 
                        : 'text-[var(--text-muted)]'
                      }
                    `}
                    whileTap={{ scale: 0.9 }}
                  >
                    <div className={`
                      relative p-2 rounded-full transition-all
                      ${isActive ? 'bg-[var(--color-work)]/10' : ''}
                    `}>
                      <Icon className={`w-5 h-5 ${isActive ? 'text-[var(--color-work)]' : ''}`} />
                      {count > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-error)] text-[10px] text-white font-bold">
                          {count > 9 ? '9+' : count}
                        </span>
                      )}
                    </div>
                    <span className={`text-[10px] font-medium ${isActive ? 'text-[var(--text-primary)]' : ''}`}>
                      {tab.label}
                    </span>
                    {isActive && (
                      <motion.div 
                        layoutId="activeTab"
                        className="absolute -bottom-2 w-1 h-1 rounded-full bg-[var(--color-work)]"
                      />
                    )}
                  </motion.button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Diálogo de confirmación para eliminar */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-[var(--color-error)]/10 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-[var(--color-error)]" />
              </div>
              <AlertDialogTitle className="text-xl">¿Eliminar tarea?</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-base">
              ¿Estás seguro de que quieres eliminar esta tarea? Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6">
            <AlertDialogCancel onClick={() => setTaskToDelete(null)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
