import { type ReactNode, useId, useState } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { formatDate, parseISODate, toISODate } from '@/lib/format'
import { cn } from '@/lib/utils'
import { Field, fieldBoxClasses } from './field'

type DateFieldProps = {
  label?: string
  /** Data `YYYY-MM-DD`; string vazia mostra o placeholder. */
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  placeholder?: string
  helper?: ReactNode
  error?: string
  disabled?: boolean
  id?: string
}

// O valor é sempre a string YYYY-MM-DD da transação. O `Date` só existe dentro do Calendar,
// criado e lido com os componentes locais (ano, mês, dia), sem passar por UTC.
export function DateField({
  label,
  value,
  onChange,
  onBlur,
  placeholder = 'Selecione',
  helper,
  error,
  disabled,
  id,
}: DateFieldProps) {
  const [open, setOpen] = useState(false)
  const generatedId = useId()
  const triggerId = id ?? generatedId
  const messageId = `${triggerId}-message`
  const hasMessage = Boolean(error || helper)
  const selected = value ? parseISODate(value) : undefined

  return (
    <Field label={label} htmlFor={triggerId} messageId={messageId} helper={helper} error={error}>
      <Popover
        open={open}
        onOpenChange={(next) => {
          setOpen(next)
          if (!next) onBlur?.()
        }}
      >
        <PopoverTrigger asChild>
          <button
            type="button"
            id={triggerId}
            disabled={disabled}
            data-placeholder={value ? undefined : ''}
            aria-invalid={error ? true : undefined}
            aria-describedby={hasMessage ? messageId : undefined}
            className={cn(
              fieldBoxClasses,
              'cursor-pointer text-left text-base text-gray-800 leading-[18px] outline-none',
              'disabled:cursor-not-allowed disabled:opacity-50 data-[placeholder]:text-gray-400',
            )}
          >
            <span className="min-w-0 flex-1 truncate">
              {value ? formatDate(value) : placeholder}
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent>
          <Calendar
            mode="single"
            required
            selected={selected}
            defaultMonth={selected}
            onSelect={(date) => {
              onChange(toISODate(date))
              setOpen(false)
            }}
            autoFocus
          />
        </PopoverContent>
      </Popover>
    </Field>
  )
}
