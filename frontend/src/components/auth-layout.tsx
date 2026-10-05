import type { ReactNode } from 'react'
import { Logo } from './logo'

type AuthLayoutProps = {
  title: string
  subtitle: string
  /** Pergunta acima do botão que leva à outra tela de acesso. */
  footerText: string
  /** Botão Outline que leva à outra tela de acesso. */
  footerAction: ReactNode
  children: ReactNode
}

/** Estrutura das telas de acesso (Login e Cadastro): logo, card de 448px e rodapé com o divisor "ou". */
export function AuthLayout({
  title,
  subtitle,
  footerText,
  footerAction,
  children,
}: AuthLayoutProps) {
  return (
    <main className="flex min-h-dvh flex-col items-center gap-8 bg-gray-100 px-4 py-12">
      <Logo />

      <div className="flex w-full max-w-md flex-col gap-8 rounded-xl border border-gray-200 bg-white p-8">
        <header className="flex flex-col gap-1 text-center">
          <h1 className="font-bold text-gray-800 text-xl">{title}</h1>
          <p className="text-base text-gray-600">{subtitle}</p>
        </header>

        <div className="flex flex-col gap-6">
          {children}

          <div className="flex items-center gap-3">
            <span className="h-px flex-1 bg-gray-300" />
            <span className="text-gray-500 text-sm">ou</span>
            <span className="h-px flex-1 bg-gray-300" />
          </div>

          <div className="flex flex-col gap-4">
            <p className="text-center text-gray-600 text-sm">{footerText}</p>
            {footerAction}
          </div>
        </div>
      </div>
    </main>
  )
}
