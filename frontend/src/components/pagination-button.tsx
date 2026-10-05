import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

type PaginationButtonProps = ComponentProps<'button'> & {
  active?: boolean
}

export function PaginationButton({
  active = false,
  className,
  type = 'button',
  ...props
}: PaginationButtonProps) {
  return (
    <button
      type={type}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg font-medium text-sm outline-none transition-colors',
        'focus-visible:outline-2 focus-visible:outline-brand-base focus-visible:outline-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        active
          ? 'bg-brand-base text-white'
          : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-200 data-[force=hover]:bg-gray-200',
        className,
      )}
      {...props}
    />
  )
}
