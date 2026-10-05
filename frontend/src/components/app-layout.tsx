import { Outlet } from 'react-router'
import { useSessionCheck } from '@/hooks/use-session-check'
import { Navbar } from './navbar'

export function AppLayout() {
  useSessionCheck()

  return (
    <div className="min-h-dvh bg-gray-100">
      <Navbar />
      {/* Limitado ao frame do Figma (1280px): com o padding de 48, o conteúdo fica com 1184px. */}
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 p-4 md:p-6 lg:p-12">
        <Outlet />
      </main>
    </div>
  )
}
