import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-[#ed7a28] text-white',
        secondary: 'border-transparent bg-gray-200 text-gray-900',
        destructive: 'border-transparent bg-red-600 text-white',
        outline: 'text-foreground',
        work: 'border-transparent bg-orange-100 text-orange-700',
        home: 'border-transparent bg-green-100 text-green-700',
        personal: 'border-transparent bg-orange-100 text-orange-700',
        high: 'border-transparent bg-red-100 text-red-700',
        medium: 'border-transparent bg-yellow-100 text-yellow-700',
        low: 'border-transparent bg-green-100 text-green-700',
        overdue: 'border-transparent bg-red-600 text-white',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
