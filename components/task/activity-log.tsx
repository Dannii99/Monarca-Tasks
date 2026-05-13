'use client'

import { useState } from 'react'
import { 
  Edit3, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Clock, 
  AlertCircle,
  ListTodo,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Activity {
  id: string
  action: string
  details: string | null
  createdAt: string
}

interface ActivityLogProps {
  activities: Activity[]
}

const actionConfig: Record<string, { 
  icon: typeof Edit3
  label: string 
  color: string
  bg: string
}> = {
  created: {
    icon: Plus,
    label: 'Tarea creada',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50'
  },
  updated: {
    icon: Edit3,
    label: 'Tarea actualizada',
    color: 'text-orange-600',
    bg: 'bg-orange-50'
  },
  completed: {
    icon: CheckCircle2,
    label: 'Tarea completada',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50'
  },
  deleted: {
    icon: Trash2,
    label: 'Tarea eliminada',
    color: 'text-red-600',
    bg: 'bg-red-50'
  },
  subtask_added: {
    icon: Plus,
    label: 'Subtarea agregada',
    color: 'text-orange-600',
    bg: 'bg-orange-50'
  },
  subtask_completed: {
    icon: CheckCircle2,
    label: 'Subtarea completada',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50'
  },
  subtask_uncompleted: {
    icon: AlertCircle,
    label: 'Subtarea reactivada',
    color: 'text-amber-600',
    bg: 'bg-amber-50'
  },
  subtask_deleted: {
    icon: Trash2,
    label: 'Subtarea eliminada',
    color: 'text-red-600',
    bg: 'bg-red-50'
  },
  subtask_edited: {
    icon: Edit3,
    label: 'Subtarea editada',
    color: 'text-orange-600',
    bg: 'bg-orange-50'
  },
  subtask_status_changed: {
    icon: ListTodo,
    label: 'Estado de subtarea cambiado',
    color: 'text-indigo-600',
    bg: 'bg-indigo-50'
  },
  status_changed: {
    icon: ListTodo,
    label: 'Estado cambiado',
    color: 'text-indigo-600',
    bg: 'bg-indigo-50'
  },
  priority_changed: {
    icon: AlertCircle,
    label: 'Prioridad cambiada',
    color: 'text-orange-600',
    bg: 'bg-orange-50'
  },
  category_changed: {
    icon: Edit3,
    label: 'Categoría cambiada',
    color: 'text-cyan-600',
    bg: 'bg-cyan-50'
  }
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return 'Hace un momento'
  if (diffInSeconds < 3600) return `Hace ${Math.floor(diffInSeconds / 60)} min`
  if (diffInSeconds < 86400) return `Hace ${Math.floor(diffInSeconds / 3600)} h`
  if (diffInSeconds < 604800) return `Hace ${Math.floor(diffInSeconds / 86400)} d`
  
  return date.toLocaleDateString('es-ES', { 
    day: 'numeric', 
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function formatFullDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', { 
    weekday: 'long',
    day: 'numeric', 
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function ActivityLog({ activities }: ActivityLogProps) {
  const [expandedActivities, setExpandedActivities] = useState<Set<string>>(new Set())
  const [showAll, setShowAll] = useState(false)

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedActivities)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedActivities(newExpanded)
  }

  const displayedActivities = showAll ? activities : activities.slice(0, 10)

  if (activities.length === 0) {
    return (
      <div className="text-center py-8">
        <Clock className="w-12 h-12 mx-auto text-[var(--text-muted)]/50 mb-3" />
        <p className="text-[var(--text-muted)] text-sm">
          No hay actividad registrada aún
        </p>
        <p className="text-[var(--text-muted)] text-xs mt-1">
          Los cambios en la tarea aparecerán aquí
        </p>
      </div>
    )
  }

  // Group activities by date
  const groupedActivities: Record<string, Activity[]> = {}
  displayedActivities.forEach(activity => {
    const date = new Date(activity.createdAt).toDateString()
    if (!groupedActivities[date]) {
      groupedActivities[date] = []
    }
    groupedActivities[date].push(activity)
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wide">
          Historial de actividad
        </h3>
        <span className="text-xs text-[var(--text-muted)]">
          {activities.length} {activities.length === 1 ? 'registro' : 'registros'}
        </span>
      </div>

      <div className="space-y-6">
        {Object.entries(groupedActivities).map(([date, dateActivities]) => (
          <div key={date} className="space-y-3">
            <h4 className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide sticky top-0 bg-[var(--bg-surface)] py-1">
              {new Date(date).toLocaleDateString('es-ES', { 
                weekday: 'long',
                day: 'numeric',
                month: 'long'
              })}
            </h4>
            
            <div className="space-y-2">
              {dateActivities.map((activity) => {
                const config = actionConfig[activity.action] || {
                  icon: Edit3,
                  label: 'Actividad',
                  color: 'text-[var(--text-muted)]',
                  bg: 'bg-[var(--bg-subtle)]'
                }
                const Icon = config.icon
                const isExpanded = expandedActivities.has(activity.id)

                return (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-[var(--bg-subtle)] transition-colors"
                  >
                    <div className={`
                      w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
                      ${config.bg}
                    `}>
                      <Icon className={`w-4 h-4 ${config.color}`} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-medium text-[var(--text-primary)]">
                          {config.label}
                        </p>
                        <span 
                          className="text-xs text-[var(--text-muted)] whitespace-nowrap"
                          title={formatFullDate(activity.createdAt)}
                        >
                          {formatRelativeTime(activity.createdAt)}
                        </span>
                      </div>
                      
                      {activity.details && (
                        <div className="mt-1">
                          {activity.details.length > 60 && !isExpanded ? (
                            <div className="flex items-center gap-2">
                              <p className="text-sm text-[var(--text-secondary)] line-clamp-1">
                                {activity.details}
                              </p>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleExpanded(activity.id)}
                                className="h-6 px-2 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                              >
                                <ChevronDown className="w-3 h-3" />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-start gap-2">
                              <p className="text-sm text-[var(--text-secondary)]">
                                {activity.details}
                              </p>
                              {activity.details.length > 60 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleExpanded(activity.id)}
                                  className="h-6 px-2 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] flex-shrink-0"
                                >
                                  <ChevronUp className="w-3 h-3" />
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {activities.length > 10 && (
        <Button
          variant="ghost"
          onClick={() => setShowAll(!showAll)}
          className="w-full h-10 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] rounded-xl"
        >
          {showAll ? (
            <>
              <ChevronUp className="w-4 h-4 mr-2" />
              Mostrar menos
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4 mr-2" />
              Ver {activities.length - 10} registros más
            </>
          )}
        </Button>
      )}
    </div>
  )
}
