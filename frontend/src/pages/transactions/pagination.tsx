import { ChevronLeft, ChevronRight } from 'lucide-react'
import { IconButton } from '@/components/icon-button'
import { PaginationButton } from '@/components/pagination-button'

const MAX_BUTTONS = 5

/** Até 5 páginas numa janela ao redor da atual (item 29 de screens.md). */
export function getPageWindow(page: number, totalPages: number): number[] {
  const lastStart = Math.max(1, totalPages - MAX_BUTTONS + 1)
  const start = Math.min(Math.max(1, page - Math.floor(MAX_BUTTONS / 2)), lastStart)
  const length = Math.min(MAX_BUTTONS, totalPages - start + 1)
  return Array.from({ length }, (_, index) => start + index)
}

type PaginationProps = {
  page: number
  perPage: number
  total: number
  /** Quantidade de itens na página exibida. */
  count: number
  onPageChange: (page: number) => void
}

const numberClasses = 'font-medium text-gray-800'

export function Pagination({ page, perPage, total, count, onPageChange }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / perPage))
  const first = (page - 1) * perPage + 1
  const last = first + count - 1

  return (
    <footer className="flex flex-wrap items-center justify-between gap-4 border-gray-200 border-t px-6 py-5">
      <p className="text-gray-700 text-sm">
        <span className={numberClasses}>{first}</span> a{' '}
        <span className={numberClasses}>{last}</span> |{' '}
        <span className={numberClasses}>{total}</span> {total === 1 ? 'resultado' : 'resultados'}
      </p>
      <nav aria-label="Paginação" className="flex items-center gap-2">
        <IconButton
          icon={ChevronLeft}
          aria-label="Página anterior"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        />
        {getPageWindow(page, totalPages).map((item) => (
          <PaginationButton
            key={item}
            active={item === page}
            aria-label={`Página ${item}`}
            onClick={() => onPageChange(item)}
          >
            {item}
          </PaginationButton>
        ))}
        <IconButton
          icon={ChevronRight}
          aria-label="Próxima página"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        />
      </nav>
    </footer>
  )
}
