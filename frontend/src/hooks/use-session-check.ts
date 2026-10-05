import { useApolloClient } from '@apollo/client/react'
import { useEffect } from 'react'
import { useLocation } from 'react-router'
import { ME_QUERY } from '@/graphql/queries/me'
import { useAuthStore } from '@/stores/auth'

/**
 * Valida a sessão com `me` ao abrir o app e a cada navegação entre as páginas logadas.
 * Token inválido ou expirado responde UNAUTHENTICATED: o link de erro do Apollo encerra a
 * sessão e mostra o toast, e as rotas voltam para `/`.
 */
export function useSessionCheck() {
  const client = useApolloClient()
  const { pathname } = useLocation()

  // biome-ignore lint/correctness/useExhaustiveDependencies: `pathname` só dispara a checagem a cada navegação.
  useEffect(() => {
    // Relê o storage antes: um token alterado fora do app passa a valer já nesta checagem.
    void useAuthStore.persist.rehydrate()
    const { token } = useAuthStore.getState()

    client
      .query({ query: ME_QUERY, fetchPolicy: 'network-only' })
      .then(({ data }) => {
        const state = useAuthStore.getState()
        if (!data || state.token !== token) return
        state.updateUser(data.me)
      })
      // Sem resposta da API a sessão continua; o UNAUTHENTICATED já foi tratado pelo link de erro.
      .catch(() => {})
  }, [client, pathname])
}
