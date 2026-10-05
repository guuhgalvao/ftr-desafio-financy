import type { LucideIcon } from 'lucide-react'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

type IconButtonProps = Omit<ComponentProps<'button'>, 'children' | 'aria-label'> & {
  icon: LucideIcon
  variant?: 'outline' | 'danger'
  'aria-label': string
}

export function IconButton({
  icon: Icon,
  variant = 'outline',
  className,
  type = 'button',
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-gray-300 bg-white outline-none transition-colors',
        'hover:bg-gray-200 data-[force=hover]:bg-gray-200',
        'focus-visible:outline-2 focus-visible:outline-brand-base focus-visible:outline-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        variant === 'danger' ? 'text-danger' : 'text-gray-700',
        className,
      )}
      {...props}
    >
      <Icon className="size-4" aria-hidden />
    </button>
  )
}
