import type { LucideIcon } from 'lucide-react'
import { type ComponentProps, type ReactNode, useId } from 'react'
import { cn } from '@/lib/utils'
import { Field, fieldBoxClasses, fieldIconClasses } from './field'

type InputProps = Omit<ComponentProps<'input'>, 'prefix'> & {
  label?: string
  icon?: LucideIcon
  helper?: ReactNode
  error?: string
  /** Texto fixo antes do valor, como o "R$" do campo Valor. */
  prefix?: string
  /** Conteúdo à direita, como o botão de mostrar e ocultar a senha. */
  rightSlot?: ReactNode
  'data-force'?: string
}

export function Input({
  label,
  icon: Icon,
  helper,
  error,
  prefix,
  rightSlot,
  id,
  className,
  disabled,
  // O ícone usa `:placeholder-shown` para saber se o campo está vazio; por isso sempre há placeholder.
  placeholder = ' ',
  'data-force': force,
  ...props
}: InputProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const messageId = `${inputId}-message`
  const hasMessage = Boolean(error || helper)

  return (
    <Field
      label={label}
      htmlFor={inputId}
      messageId={messageId}
      helper={helper}
      error={error}
      data-force={force}
    >
      <div className={cn(fieldBoxClasses, disabled && 'opacity-50', className)}>
        {Icon && <Icon className={fieldIconClasses} aria-hidden />}
        {prefix && <span className="text-base text-gray-800 leading-[18px]">{prefix}</span>}
        <input
          id={inputId}
          disabled={disabled}
          placeholder={placeholder}
          aria-invalid={error ? true : undefined}
          aria-describedby={hasMessage ? messageId : undefined}
          className="min-w-0 flex-1 bg-transparent text-base text-gray-800 leading-[18px] outline-none placeholder:text-gray-400 disabled:cursor-not-allowed"
          {...props}
        />
        {rightSlot}
      </div>
    </Field>
  )
}
