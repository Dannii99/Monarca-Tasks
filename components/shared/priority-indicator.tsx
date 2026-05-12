import { AlertCircle, Minus, ArrowDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PriorityIndicatorProps {
  priority: string
  className?: string
  isMobile?: boolean
}

const priorityConfig: Record<string, { icon: typeof AlertCircle; bg: string; text: string; border: string; label: string }> = {
  HIGH: {
    icon: AlertCircle,
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
    label: 'Alta',
  },
  MEDIUM: {
    icon: Minus,
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    label: 'Media',
  },
  LOW: {
    icon: ArrowDown,
    bg: 'bg-green-50',
    text: 'text-green-700',
    border: 'border-green-200',
    label: 'Baja',
  },
}

export function PriorityIndicator({ priority, className, isMobile }: PriorityIndicatorProps) {
  const config = priorityConfig[priority] || priorityConfig.MEDIUM
  const Icon = config.icon

  return (
    <span 
      className={cn(
        'inline-flex items-center gap-1 rounded-lg font-semibold border',
        isMobile ? 'px-2.5 py-1.5 text-xs' : 'px-2 py-1 text-[11px]',
        config.bg,
        config.text,
        config.border,
        className
      )}
    >
      <Icon className={isMobile ? 'w-3.5 h-3.5' : 'w-3 h-3'} strokeWidth={2} />
      {config.label}
    </span>
  )
}
