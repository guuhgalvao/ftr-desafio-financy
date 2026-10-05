import type { LucideIcon } from 'lucide-react'
import type { ComponentProps, ReactNode } from 'react'
import { Link as RouterLink } from 'react-router'
import { cn } from '@/lib/utils'

type BaseProps = {
  icon?: LucideIcon
  iconPosition?: 'left' | 'right'
  className?: string
  children: ReactNode
  'data-force'?: string
}

// `to` navega pelo router, `href` é um link externo e, sem nenhum dos dois, é um botão de ação.
type LinkProps = BaseProps &
  (
    | ({ to: string; href?: never } & Omit<
        ComponentProps<typeof RouterLink>,
        keyof BaseProps | 'to'
      >)
    | ({ href: string; to?: never } & Omit<ComponentProps<'a'>, keyof BaseProps | 'href'>)
    | ({ to?: never; href?: never } & Omit<ComponentProps<'button'>, keyof BaseProps>)
  )

const linkClasses = cn(
  'inline-flex cursor-pointer items-center gap-1 rounded-sm font-medium text-brand-base text-sm decoration-1 underline-offset-4 outline-none',
  'hover:underline data-[force=hover]:underline',
  'focus-visible:outline-2 focus-visible:outline-brand-base focus-visible:outline-offset-2',
  'disabled:pointer-events-none disabled:opacity-50',
)

export function Link({
  icon: Icon,
  iconPosition = 'left',
  className,
  children,
  ...props
}: LinkProps) {
  const classes = cn(linkClasses, className)
  const content = (
    <>
      {Icon && iconPosition === 'left' && <Icon className="size-4 shrink-0" aria-hidden />}
      {children}
      {Icon && iconPosition === 'right' && <Icon className="size-4 shrink-0" aria-hidden />}
    </>
  )

  if (props.to !== undefined) {
    return (
      <RouterLink className={classes} {...props}>
        {content}
      </RouterLink>
    )
  }

  if (props.href !== undefined) {
    return (
      <a className={classes} {...props}>
        {content}
      </a>
    )
  }

  return (
    <button type="button" className={classes} {...props}>
      {content}
    </button>
  )
}
