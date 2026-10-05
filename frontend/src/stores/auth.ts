import { create } from 'zustand'
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware'

export type SessionUser = { id: string; name: string; email: string }

type AuthState = {
  token: string | null
  user: SessionUser | null
  /** "Lembrar-me": `true` guarda a sessão no localStorage; `false`, no sessionStorage. */
  remember: boolean
  signIn: (session: { token: string; user: SessionUser }, remember: boolean) => void
  updateUser: (user: SessionUser) => void
  signOut: () => void
}

// A sessão mora em um storage só. A leitura procura nos dois e a escrita escolhe pelo
// `remember` do próprio estado, apagando do outro. Sem token, não fica nada gravado.
const sessionStorageByRemember: StateStorage = {
  getItem: (name) => localStorage.getItem(name) ?? sessionStorage.getItem(name),
  setItem: (name, value) => {
    const { state } = JSON.parse(value) as { state: Pick<AuthState, 'token' | 'remember'> }
    localStorage.removeItem(name)
    sessionStorage.removeItem(name)
    if (state.token) (state.remember ? localStorage : sessionStorage).setItem(name, value)
  },
  removeItem: (name) => {
    localStorage.removeItem(name)
    sessionStorage.removeItem(name)
  },
}

// Guarda só os campos da sessão: o retorno do Apollo traz `__typename` e outros campos junto.
function toSessionUser({ id, name, email }: SessionUser): SessionUser {
  return { id, name, email }
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      remember: false,
      signIn: ({ token, user }, remember) => set({ token, user: toSessionUser(user), remember }),
      updateUser: (user) => set({ user: toSessionUser(user) }),
      signOut: () => set({ token: null, user: null, remember: false }),
    }),
    {
      name: 'financy:auth',
      storage: createJSONStorage(() => sessionStorageByRemember),
      partialize: ({ token, user, remember }) => ({ token, user, remember }),
    },
  ),
)
