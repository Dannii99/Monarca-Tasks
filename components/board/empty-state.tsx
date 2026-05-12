import { motion } from 'motion/react'
import { ClipboardList, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  message?: string
  ctaLabel?: string
  onCta?: () => void
  className?: string
}

export function EmptyState({ 
  message = 'No hay tareas en esta columna', 
  ctaLabel, 
  onCta, 
  className 
}: EmptyStateProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'flex flex-col items-center justify-center py-10 px-4 text-center', 
        className
      )}
    >
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mb-4">
        <ClipboardList className="w-7 h-7 text-gray-400" strokeWidth={1.5} />
      </div>
      <p className="text-sm text-gray-500 mb-1 font-medium">{message}</p>
      <p className="text-xs text-gray-400 mb-4">Arrastra tareas aquí o crea una nueva</p>
      {ctaLabel && onCta && (
        <Button 
          onClick={onCta} 
          size="sm" 
          variant="outline" 
          className="h-9 px-4 text-xs font-medium text-gray-600 bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300 rounded-lg transition-all"
        >
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          {ctaLabel}
        </Button>
      )}
    </motion.div>
  )
}
