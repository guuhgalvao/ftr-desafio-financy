import { ChevronDown, ChevronUp, type LucideIcon } from 'lucide-react'
import { type ReactNode, useId } from 'react'
import {
  SelectContent,
  SelectItem,
  Select as SelectRoot,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { Field, fieldBoxClasses, fieldIconClasses } from './field'

export type SelectOption = { value: string; label: string }

type SelectProps = {
  label?: string
  options: SelectOption[]
  /** String vazia (ou `undefined`) mostra o placeholder. O Radix não aceita opção com valor vazio. */
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  icon?: LucideIcon
  helper?: ReactNode
  error?: string
  disabled?: boolean
  /** Conteúdo do dropdown quando não há opções. */
  emptyContent?: ReactNode
  id?: string
  name?: string
  className?: string
}

export function Select({
  label,
  options,
  value,
  onValueChange,
  placeholder,
  icon: Icon,
  helper,
  error,
  disabled,
  emptyContent,
  id,
  name,
  className,
}: SelectProps) {
  const generatedId = useId()
  const triggerId = id ?? generatedId
  const messageId = `${triggerId}-message`
  const hasMessage = Boolean(error || helper)

  return (
    <Field label={label} htmlFor={triggerId} messageId={messageId} helper={helper} error={error}>
      <SelectRoot value={value ?? ''} onValueChange={onValueChange} disabled={disabled} name={name}>
        <SelectTrigger
          id={triggerId}
          aria-invalid={error ? true : undefined}
          aria-describedby={hasMessage ? messageId : undefined}
          className={cn(
            fieldBoxClasses,
            'group/trigger cursor-pointer text-left text-base text-gray-800 leading-[18px] outline-none',
            'disabled:cursor-not-allowed disabled:opacity-50 data-[placeholder]:text-gray-400',
            className,
          )}
        >
          {Icon && <Icon className={fieldIconClasses} aria-hidden />}
          <span className="min-w-0 flex-1 truncate">
            <SelectValue placeholder={placeholder} />
          </span>
          <ChevronDown
            className="size-4 shrink-0 text-gray-700 group-data-[state=open]/trigger:hidden"
            aria-hidden
          />
          <ChevronUp
            className="hidden size-4 shrink-0 text-gray-700 group-data-[state=open]/trigger:block"
            aria-hidden
          />
        </SelectTrigger>
        <SelectContent>
          {options.length === 0
            ? emptyContent
            : options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
        </SelectContent>
      </SelectRoot>
    </Field>
  )
}
