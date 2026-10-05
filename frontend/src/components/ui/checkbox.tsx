import { Check } from 'lucide-react'
import { Checkbox as CheckboxPrimitive } from 'radix-ui'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

function Checkbox({ className, ...props }: ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        'size-4 shrink-0 cursor-pointer rounded-sm border border-gray-300 bg-white text-white outline-none',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-base',
        'disabled:pointer-events-none disabled:opacity-50',
        'data-[state=checked]:border-brand-base data-[state=checked]:bg-brand-base',
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="flex items-center justify-center">
        <Check className="size-3" strokeWidth={3} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
