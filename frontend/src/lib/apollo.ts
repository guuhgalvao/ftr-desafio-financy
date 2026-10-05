import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from '@apollo/client'
import { SetContextLink } from '@apollo/client/link/context'
import { ErrorLink } from '@apollo/client/link/error'
import { toast } from 'sonner'
import { env } from '@/env'
import { useAuthStore } from '@/stores/auth'
import { hasGraphQLErrorCode } from './errors'

const httpLink = new HttpLink({ uri: `${env.VITE_BACKEND_URL}/graphql` })

const authLink = new SetContextLink((prevContext) => {
  const { token } = useAuthStore.getState()
  if (!token) return prevContext
  return {
    ...prevContext,
    headers: { ...prevContext.headers, authorization: `Bearer ${token}` },
    sessionToken: token,
  }
})

// UNAUTHENTICATED só encerra a sessão quando a operação saiu com token (login com senha
// errada também responde UNAUTHENTICATED) e esse token ainda é o do store, para o toast
// não repetir quando várias queries falham juntas.
const errorLink = new ErrorLink(({ error, operation }) => {
  if (!hasGraphQLErrorCode(error, 'UNAUTHENTICATED')) return

  const { sessionToken } = operation.getContext()
  if (!sessionToken || sessionToken !== useAuthStore.getState().token) return

  endSession()
  toast.error('Sua sessão expirou')
})

/** Limpa o token, o usuário e o cache do Apollo. As rotas voltam para `/` por dependerem do token. */
export function endSession() {
  useAuthStore.getState().signOut()
  void apolloClient.clearStore()
}

export const apolloClient = new ApolloClient({
  link: ApolloLink.from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: { fetchPolicy: 'cache-and-network' },
  },
})
