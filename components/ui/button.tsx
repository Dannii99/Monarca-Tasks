import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[4px] text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#2563eb] disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-[#2563eb] text-white hover:bg-[#1d4ed8]',
        destructive: 'bg-[#ba1a1a] text-white hover:bg-[#991b1b]',
        outline: 'border border-[#e5e7eb] bg-transparent hover:bg-[#f3f4f5]',
        secondary: 'bg-[#f3f4f5] text-[#191c1d] hover:bg-[#edeeef]',
        ghost: 'hover:bg-[#f3f4f5]',
        link: 'text-[#2563eb] underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-[4px] px-3 text-xs',
        lg: 'h-10 rounded-[4px] px-8',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
