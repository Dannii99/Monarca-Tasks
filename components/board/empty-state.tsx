import { cn } from '@/lib/utils'

interface EmptyStateProps {
  message?: string
  className?: string
}

export function EmptyState({ message = 'No tasks yet. Add one to get started.', className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-8 text-center', className)}>
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  )
}
