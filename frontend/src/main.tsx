import { ApolloProvider } from '@apollo/client/react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from '@/components/ui/sonner'
import { apolloClient } from '@/lib/apollo'
import { App } from './app'
import './index.css'

const root = document.getElementById('root')
if (!root) throw new Error('Elemento #root não encontrado')

createRoot(root).render(
  <StrictMode>
    <ApolloProvider client={apolloClient}>
      <App />
      <Toaster />
    </ApolloProvider>
  </StrictMode>,
)
