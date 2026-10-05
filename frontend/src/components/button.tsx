import { cva, type VariantProps } from 'class-variance-authority'
import type { LucideIcon } from 'lucide-react'
import { Slot } from 'radix-ui'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

// `data-force` repete o hover por atributo, para o styleguide mostrar o estado sem interação.
const buttonVariants = cva(
  [
    'inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium outline-none transition-colors',
    'focus-visible:outline-2 focus-visible:outline-brand-base focus-visible:outline-offset-2',
    'disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50',
  ],
  {
    variants: {
      variant: {
        solid: 'bg-brand-base text-white hover:bg-brand-dark data-[force=hover]:bg-brand-dark',
        outline:
          'border border-gray-300 bg-white text-gray-700 hover:bg-gray-200 data-[force=hover]:bg-gray-200',
        danger: 'bg-danger text-white hover:bg-red-dark data-[force=hover]:bg-red-dark',
      },
      size: {
        md: 'h-12 px-4 py-3 text-base',
        sm: 'h-9 px-3 py-2 text-sm',
      },
      fullWidth: { true: 'w-full' },
    },
    defaultVariants: { variant: 'solid', size: 'md' },
  },
)

const iconVariants = cva('shrink-0', {
  variants: {
    variant: { solid: 'text-gray-100', outline: 'text-gray-700', danger: 'text-white' },
    size: { md: 'size-4.5', sm: 'size-4' },
  },
  defaultVariants: { variant: 'solid', size: 'md' },
})

type ButtonProps = ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    icon?: LucideIcon
    iconClassName?: string
    /** Renderiza o filho (ex.: `Link` do router) com a aparência do botão. Não combina com `icon`. */
    asChild?: boolean
  }

export function Button({
  className,
  variant,
  size,
  fullWidth,
  icon: Icon,
  iconClassName,
  asChild = false,
  type = 'button',
  children,
  ...props
}: ButtonProps) {
  const classes = cn(buttonVariants({ variant, size, fullWidth }), className)

  if (asChild) {
    return (
      <Slot.Root className={classes} {...props}>
        {children}
      </Slot.Root>
    )
  }

  return (
    <button type={type} className={classes} {...props}>
      {Icon && <Icon className={cn(iconVariants({ variant, size }), iconClassName)} aria-hidden />}
      {children}
    </button>
  )
}

/** Ícone no tamanho e na cor do botão, para usar dentro de `<Button asChild>`. */
export function ButtonIcon({
  icon: Icon,
  variant,
  size,
  className,
}: VariantProps<typeof iconVariants> & { icon: LucideIcon; className?: string }) {
  return <Icon className={cn(iconVariants({ variant, size }), className)} aria-hidden />
}
