import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import { AppLayout } from '@/components/app-layout'
import { CategoriesPage } from '@/pages/categories'
import { DashboardPage } from '@/pages/dashboard'
import { LoginPage } from '@/pages/login'
import { ProfilePage } from '@/pages/profile'
import { RegisterPage } from '@/pages/register'
import { TransactionsPage } from '@/pages/transactions'
import { useAuthStore } from '@/stores/auth'

// Só existe em desenvolvimento: em produção a condição é `false` e o import some do bundle.
const StyleguidePage = import.meta.env.DEV ? lazy(() => import('@/pages/styleguide')) : null

export function App() {
  const isAuthenticated = useAuthStore((state) => state.token !== null)

  return (
    <BrowserRouter>
      <Suspense>
        <Routes>
          {StyleguidePage && <Route path="/_styleguide" element={<StyleguidePage />} />}

          {isAuthenticated ? (
            <Route element={<AppLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="transacoes" element={<TransactionsPage />} />
              <Route path="categorias" element={<CategoriesPage />} />
              <Route path="perfil" element={<ProfilePage />} />
            </Route>
          ) : (
            <>
              <Route index element={<LoginPage />} />
              <Route path="cadastro" element={<RegisterPage />} />
            </>
          )}

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
