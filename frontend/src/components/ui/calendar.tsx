import { ptBR } from 'date-fns/locale'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { DayPicker, type DayPickerProps } from 'react-day-picker'
import { cn } from '@/lib/utils'

const navButton =
  'pointer-events-auto flex size-8 cursor-pointer items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 outline-none hover:bg-gray-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-base disabled:pointer-events-none disabled:opacity-50'

function Calendar({ className, classNames, ...props }: DayPickerProps) {
  return (
    <DayPicker
      locale={ptBR}
      weekStartsOn={0}
      showOutsideDays
      className={cn('p-3', className)}
      classNames={{
        months: 'relative',
        month: 'flex flex-col gap-3',
        month_caption: 'flex h-8 items-center justify-center',
        caption_label: 'text-sm font-medium text-gray-800 first-letter:uppercase',
        nav: 'pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between',
        button_previous: navButton,
        button_next: navButton,
        month_grid: 'border-collapse',
        weekdays: 'flex',
        weekday: 'flex size-9 items-center justify-center text-xs font-normal text-gray-500',
        week: 'mt-1 flex',
        day: 'size-9 p-0 text-sm text-gray-800',
        day_button:
          'flex size-9 cursor-pointer items-center justify-center rounded-lg outline-none hover:bg-gray-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-base disabled:pointer-events-none',
        today: '[&:not([data-selected])>button]:bg-gray-200',
        selected:
          '[&>button]:bg-brand-base [&>button]:font-medium [&>button]:text-white [&>button]:hover:bg-brand-dark',
        outside: 'text-gray-400',
        disabled: 'opacity-50',
        hidden: 'invisible',
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) =>
          orientation === 'left' ? (
            <ChevronLeft className="size-4" />
          ) : (
            <ChevronRight className="size-4" />
          ),
      }}
      {...props}
    />
  )
}

export { Calendar }
