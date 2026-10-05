import type { ReactNode } from 'react'

type PageHeaderProps = {
  title: string
  subtitle: string
  /** Botão de ação. Abaixo de 768px fica embaixo do título. */
  action?: ReactNode
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <header className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-col gap-0.5">
        <h1 className="font-bold text-2xl text-gray-800">{title}</h1>
        <p className="text-base text-gray-600">{subtitle}</p>
      </div>
      {action}
    </header>
  )
}
