import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router'

// Só existe em desenvolvimento: em produção a condição é `false` e o import some do bundle.
const StyleguidePage = import.meta.env.DEV ? lazy(() => import('@/pages/styleguide')) : null

export function App() {
  return (
    <BrowserRouter>
      <Suspense>
        <Routes>
          {StyleguidePage && <Route path="/_styleguide" element={<StyleguidePage />} />}
          <Route path="*" element={<h1>Financy</h1>} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
