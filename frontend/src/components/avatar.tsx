import { getInitials } from '@/lib/format'
import { cn } from '@/lib/utils'

type AvatarProps = {
  name: string
  size?: 'sm' | 'lg'
  className?: string
}

export function Avatar({ name, size = 'sm', className }: AvatarProps) {
  return (
    <span
      aria-hidden
      className={cn(
        'inline-flex shrink-0 select-none items-center justify-center rounded-full bg-gray-300 font-medium text-gray-800',
        size === 'lg' ? 'size-16 text-2xl' : 'size-9 text-sm',
        className,
      )}
    >
      {getInitials(name)}
    </span>
  )
}
