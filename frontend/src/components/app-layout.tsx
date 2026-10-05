import { Outlet } from 'react-router'
import { Navbar } from './navbar'

export function AppLayout() {
  return (
    <div className="min-h-dvh bg-gray-100">
      <Navbar />
      <main className="flex flex-col gap-8 p-4 md:p-6 lg:p-12">
        <Outlet />
      </main>
    </div>
  )
}
