'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  onCheckedChange?: (checked: boolean) => void
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, onCheckedChange, onClick, ...props }, ref) => {
    const handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
      const target = e.target as HTMLInputElement
      onCheckedChange?.(!target.checked)
      onClick?.(e)
    }

    return (
      <input
        type="checkbox"
        className={cn(
          'peer h-4 w-4 shrink-0 rounded border border-[var(--border-strong)] bg-[var(--bg-surface)]',
          'ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'checked:bg-[var(--color-work)] checked:border-[var(--color-work)]',
          'appearance-none cursor-pointer relative',
          'checked:after:content-[""] checked:after:absolute checked:after:left-1/2 checked:after:top-1/2',
          'checked:after:w-[5px] checked:after:h-[9px] checked:after:border-white checked:after:border-r-2 checked:after:border-b-2',
          'checked:after:-translate-x-1/2 checked:after:-translate-y-[60%] checked:after:rotate-45',
          className
        )}
        ref={ref}
        onClick={handleClick}
        {...props}
      />
    )
  }
)
Checkbox.displayName = 'Checkbox'

export { Checkbox }
