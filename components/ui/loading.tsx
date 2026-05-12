'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Loader2 } from 'lucide-react'

interface LoadingContextType {
  isLoading: boolean
  message: string
  startLoading: (message?: string) => void
  stopLoading: () => void
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('Cargando...')

  const startLoading = useCallback((msg = 'Cargando...') => {
    setMessage(msg)
    setIsLoading(true)
  }, [])

  const stopLoading = useCallback(() => {
    setIsLoading(false)
  }, [])

  return (
    <LoadingContext.Provider value={{ isLoading, message, startLoading, stopLoading }}>
      {children}
      <LoadingOverlay isLoading={isLoading} message={message} />
    </LoadingContext.Provider>
  )
}

export function useLoading() {
  const context = useContext(LoadingContext)
  if (context === undefined) {
    throw new Error('useLoading debe usarse dentro de LoadingProvider')
  }
  return context
}

// Componente visual del loading
function LoadingOverlay({ isLoading, message }: { isLoading: boolean; message: string }) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center gap-4 p-8 rounded-3xl bg-[var(--bg-surface)] shadow-2xl border border-[var(--border-default)]"
          >
            {/* Spinner animado */}
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-16 h-16 rounded-full border-4 border-[var(--border-default)] border-t-[var(--color-work)]"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-[var(--color-work)] animate-spin" />
              </div>
            </div>
            
            {/* Mensaje */}
            <p className="text-lg font-semibold text-[var(--text-primary)]">
              {message}
            </p>
            
            {/* Barra de progreso indeterminada */}
            <div className="w-48 h-1.5 bg-[var(--bg-muted)] rounded-full overflow-hidden">
              <motion.div
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
                className="w-1/2 h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Componente Button con loading integrado
interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean
  loadingText?: string
  children: React.ReactNode
}

export function LoadingButton({ 
  isLoading = false, 
  loadingText = 'Cargando...', 
  children, 
  className = '',
  disabled,
  ...props 
}: LoadingButtonProps) {
  return (
    <button
      className={`
        relative flex items-center justify-center gap-2 
        px-6 py-3 rounded-xl font-semibold
        transition-all duration-200
        ${isLoading ? 'opacity-80 cursor-wait' : ''}
        ${className}
      `}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-2"
        >
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>{loadingText}</span>
        </motion.div>
      )}
      {!isLoading && children}
    </button>
  )
}

// Componente Skeleton para cargar contenido
export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div 
      className={`
        animate-pulse bg-[var(--bg-muted)] rounded-lg
        ${className}
      `}
    />
  )
}

// Skeleton para tarjetas de tareas
export function TaskCardSkeleton() {
  return (
    <div className="p-4 rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] space-y-3">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <div className="flex gap-2">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-16" />
      </div>
    </div>
  )
}

// Skeleton para columnas enteras
export function ColumnSkeleton() {
  return (
    <div className="flex flex-col h-full rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-default)] overflow-hidden">
      <div className="p-4 border-b border-[var(--border-default)]">
        <Skeleton className="h-10 w-40" />
      </div>
      <div className="p-4 space-y-3">
        <TaskCardSkeleton />
        <TaskCardSkeleton />
        <TaskCardSkeleton />
      </div>
    </div>
  )
}
