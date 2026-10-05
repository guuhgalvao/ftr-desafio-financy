import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type FieldProps = {
  label?: string
  htmlFor?: string
  /** id do elemento de helper/erro, para o `aria-describedby` do controle. */
  messageId?: string
  helper?: ReactNode
  error?: string
  className?: string
  /** Só para o styleguide: `active` mostra o estado de foco sem interação. */
  'data-force'?: string
  children: ReactNode
}

// Estados do Figma (a borda nunca muda): o foco pinta label e ícone de brand-base e o erro, de danger.
// O erro vence o foco. Com erro, a mensagem substitui o helper (item 8 de screens.md).
export const fieldLabelClasses = cn(
  'font-medium text-gray-700 text-sm',
  'group-focus-within/field:text-brand-base group-data-[force=active]/field:text-brand-base',
  'group-has-[[data-state=open]]/field:text-brand-base',
  'group-data-[error]/field:text-danger',
)

export const fieldBoxClasses =
  'flex h-12 w-full items-center gap-3 rounded-lg border border-gray-300 bg-white px-3 py-3.5'

export const fieldIconClasses = cn(
  'size-4 shrink-0 text-gray-800',
  'group-has-[input:placeholder-shown]/field:text-gray-400 group-has-[[data-placeholder]]/field:text-gray-400',
  'group-focus-within/field:text-brand-base group-data-[force=active]/field:text-brand-base',
  'group-has-[[data-state=open]]/field:text-brand-base',
  'group-data-[error]/field:text-danger',
)

export function Field({
  label,
  htmlFor,
  messageId,
  helper,
  error,
  className,
  children,
  ...props
}: FieldProps) {
  const message = error || helper

  return (
    <div
      className={cn('group/field flex w-full flex-col gap-2', className)}
      data-error={error ? '' : undefined}
      data-force={props['data-force']}
    >
      {label && (
        <label htmlFor={htmlFor} className={fieldLabelClasses}>
          {label}
        </label>
      )}
      {children}
      {message && (
        <p id={messageId} className={cn('text-xs', error ? 'text-danger' : 'text-gray-500')}>
          {message}
        </p>
      )}
    </div>
  )
}
