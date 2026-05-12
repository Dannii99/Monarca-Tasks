import { Briefcase, Home, User } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CategoryBadgeProps {
  category: string
  className?: string
  isMobile?: boolean
}

const categoryConfig: Record<string, { icon: typeof Briefcase; bg: string; text: string; label: string; border: string }> = {
  WORK: {
    icon: Briefcase,
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    label: 'Trabajo',
  },
  HOME: {
    icon: Home,
    bg: 'bg-green-50',
    text: 'text-green-700',
    border: 'border-green-200',
    label: 'Hogar',
  },
  PERSONAL: {
    icon: User,
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200',
    label: 'Personal',
  },
}

export function CategoryBadge({ category, className, isMobile }: CategoryBadgeProps) {
  const config = categoryConfig[category] || categoryConfig.PERSONAL
  const Icon = config.icon

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-lg font-semibold border',
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
