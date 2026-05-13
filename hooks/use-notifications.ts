'use client'

import { useEffect, useRef, useCallback } from 'react'
import { Task } from '@/types/task'

// Tipo para las notificaciones ya mostradas
type ShownNotifications = {
  [taskId: string]: {
    '24h'?: string
    'today'?: string
    'overdue'?: string
  }
}

const STORAGE_KEY = 'monarca_notifications_shown'
const INTERVAL_MINUTES = 10

export function useNotifications(tasks: Task[], isMuted: boolean) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Solicitar permiso de notificaciones
  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      console.log('Este navegador no soporta notificaciones')
      return false
    }

    if (Notification.permission === 'granted') {
      return true
    }

    if (Notification.permission === 'default') {
      const permission = await Notification.requestPermission()
      return permission === 'granted'
    }

    return false
  }, [])

  // Obtener notificaciones ya mostradas
  const getShownNotifications = useCallback((): ShownNotifications => {
    if (typeof window === 'undefined') return {}
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : {}
    } catch {
      return {}
    }
  }, [])

  // Guardar notificación como mostrada
  const markAsShown = useCallback((taskId: string, type: '24h' | 'today' | 'overdue') => {
    if (typeof window === 'undefined') return
    const shown = getShownNotifications()
    if (!shown[taskId]) {
      shown[taskId] = {}
    }
    shown[taskId][type] = new Date().toISOString()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(shown))
  }, [getShownNotifications])

  // Limpiar notificaciones de una tarea completada
  const clearTaskNotifications = useCallback((taskId: string) => {
    if (typeof window === 'undefined') return
    const shown = getShownNotifications()
    if (shown[taskId]) {
      delete shown[taskId]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(shown))
    }
  }, [getShownNotifications])

  // Mostrar notificación
  const showNotification = useCallback((title: string, body: string, taskId: string, type: '24h' | 'today' | 'overdue') => {
    if (!('Notification' in window) || Notification.permission !== 'granted' || isMuted) {
      return
    }

    // Verificar si ya se mostró esta notificación
    const shown = getShownNotifications()
    if (shown[taskId]?.[type]) {
      return
    }

    const notification = new Notification(title, {
      body,
      icon: '/ico/monarca-logo.png',
      badge: '/ico/monarca-logo.png',
      tag: `${taskId}-${type}`,
      requireInteraction: type === 'overdue',
      silent: false,
    })

    // Marcar como mostrada
    markAsShown(taskId, type)

    // Cerrar automáticamente después de 10 segundos (excepto vencidas)
    if (type !== 'overdue') {
      setTimeout(() => notification.close(), 10000)
    }
  }, [isMuted, getShownNotifications, markAsShown])

  // Revisar tareas y mostrar notificaciones
  const checkTasks = useCallback(() => {
    if (isMuted) return

    const now = new Date()
    const shown = getShownNotifications()

    tasks.forEach(task => {
      // Ignorar tareas completadas
      if (task.status === 'DONE') {
        // Limpiar historial si existe
        if (shown[task.id]) {
          clearTaskNotifications(task.id)
        }
        return
      }

      if (!task.dueDate) return

      const dueDate = new Date(task.dueDate)
      const diffHours = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60)

      // Vencida (más de 24h pasadas)
      if (diffHours < -24) {
        showNotification(
          '⚠️ Tarea vencida',
          `"${task.title}" está vencida`,
          task.id,
          'overdue'
        )
      }
      // Vence hoy (entre 0 y -24h)
      else if (diffHours <= 0 && diffHours > -24) {
        showNotification(
          '⏰ Tarea vence hoy',
          `"${task.title}" vence hoy`,
          task.id,
          'today'
        )
      }
      // Vence mañana (entre 0 y 24h)
      else if (diffHours > 0 && diffHours <= 24) {
        showNotification(
          '📅 Tarea vence mañana',
          `"${task.title}" vence mañana`,
          task.id,
          '24h'
        )
      }
    })
  }, [tasks, isMuted, getShownNotifications, showNotification, clearTaskNotifications])

  // Efecto para solicitar permiso al montar
  useEffect(() => {
    requestPermission()
  }, [requestPermission])

  // Efecto para el intervalo de revisión
  useEffect(() => {
    if (isMuted) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      return
    }

    // Revisar inmediatamente al iniciar
    checkTasks()

    // Configurar intervalo de 10 minutos
    intervalRef.current = setInterval(checkTasks, INTERVAL_MINUTES * 60 * 1000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [checkTasks, isMuted])

  return { requestPermission }
}

// Hook para manejar el estado de silencio
export function useNotificationMute() {
  const MUTE_KEY = 'monarca_notifications_muted'

  const isMuted = () => {
    if (typeof window === 'undefined') return false
    return localStorage.getItem(MUTE_KEY) === 'true'
  }

  const setMuted = (muted: boolean) => {
    if (typeof window === 'undefined') return
    localStorage.setItem(MUTE_KEY, muted.toString())
  }

  return { isMuted, setMuted }
}
