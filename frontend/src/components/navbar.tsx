import { Link, NavLink } from 'react-router'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/auth'
import { Avatar } from './avatar'
import { Logo } from './logo'

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/transacoes', label: 'Transações', end: false },
  { to: '/categorias', label: 'Categorias', end: false },
]

const focusRing =
  'outline-none focus-visible:outline-2 focus-visible:outline-brand-base focus-visible:outline-offset-2'

export function Navbar() {
  const name = useAuthStore((state) => state.user?.name ?? '')

  return (
    // O fundo e a borda ocupam a tela toda; o conteúdo segue o mesmo limite do Main (1280px).
    <header className="border-gray-200 border-b bg-white">
      {/* Abaixo de 768px os links descem para uma segunda linha, centralizados. */}
      <div className="mx-auto grid w-full max-w-7xl grid-cols-[1fr_auto] items-center gap-x-4 gap-y-3 px-4 py-4 md:grid-cols-[1fr_auto_1fr] md:px-6 lg:px-12">
        <Link to="/" className={cn('justify-self-start rounded-sm', focusRing)}>
          <Logo size="sm" />
        </Link>

        <nav className="order-last col-span-2 flex items-center justify-center gap-5 md:order-none md:col-span-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'rounded-sm text-sm',
                  focusRing,
                  isActive ? 'font-semibold text-brand-base' : 'text-gray-600',
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <Link
          to="/perfil"
          aria-label="Perfil"
          className={cn('justify-self-end rounded-full', focusRing)}
        >
          <Avatar name={name} />
        </Link>
      </div>
    </header>
  )
}
