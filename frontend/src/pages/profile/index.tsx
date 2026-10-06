import { useMutation } from '@apollo/client/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { LogOut, Mail, UserRound } from 'lucide-react'
import { useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { toast } from 'sonner'
import { Avatar } from '@/components/avatar'
import { Button } from '@/components/button'
import { Input } from '@/components/input'
import { UPDATE_PROFILE_MUTATION } from '@/graphql/mutations/update-profile'
import { endSession } from '@/lib/apollo'
import { getErrorMessage, getGraphQLErrorCode, getGraphQLErrorField } from '@/lib/errors'
import { type ProfileFormData, profileSchema } from '@/schemas/user'
import { type SessionUser, useAuthStore } from '@/stores/auth'

export function ProfilePage() {
  const user = useAuthStore((state) => state.user)
  if (!user) return null

  return <ProfileCard user={user} />
}

function ProfileCard({ user }: { user: SessionUser }) {
  const updateUser = useAuthStore((state) => state.updateUser)
  const [updateProfile] = useMutation(UPDATE_PROFILE_MUTATION)

  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isValid, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    mode: 'onChange',
    defaultValues: { name: user.name },
  })

  // O `me` do layout pode trazer um nome mais novo que o do store: o campo acompanha, sem
  // apagar o que o usuário já digitou.
  useEffect(() => {
    reset({ name: user.name }, { keepDirtyValues: true })
  }, [reset, user.name])

  const name = useWatch({ control, name: 'name' })
  const isUnchanged = name.trim() === user.name

  async function onSubmit(data: ProfileFormData) {
    try {
      const result = await updateProfile({ variables: { data } })
      if (!result.data) return
      updateUser(result.data.updateProfile)
      reset({ name: result.data.updateProfile.name })
      toast.success('Perfil atualizado com sucesso')
    } catch (error) {
      // Sessão expirada: o link de erro do Apollo já encerra a sessão e mostra o toast.
      if (getGraphQLErrorCode(error) === 'UNAUTHENTICATED') return

      const message = getErrorMessage(error)
      if (getGraphQLErrorField(error) === 'name') setError('name', { message })
      else toast.error(message)
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-8 rounded-xl border border-gray-200 bg-white p-8">
      <header className="flex flex-col items-center gap-6 text-center">
        <Avatar name={user.name} src={user.avatarUrl} size="lg" />
        <div className="flex w-full flex-col gap-0.5">
          <h1 className="break-words font-semibold text-gray-800 text-xl">{user.name}</h1>
          <p className="break-words text-base text-gray-600">{user.email}</p>
        </div>
      </header>

      <hr className="border-gray-200" />

      <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <Input
            label="Nome completo"
            icon={UserRound}
            placeholder="Seu nome completo"
            autoComplete="name"
            error={errors.name?.message}
            {...register('name')}
          />
          <Input
            label="E-mail"
            type="email"
            icon={Mail}
            value={user.email}
            readOnly
            disabled
            helper="O e-mail não pode ser alterado"
          />
        </div>

        <div className="flex flex-col gap-4">
          <Button type="submit" fullWidth disabled={isUnchanged || !isValid || isSubmitting}>
            {isSubmitting ? 'Salvando...' : 'Salvar alterações'}
          </Button>
          <Button
            variant="outline"
            fullWidth
            icon={LogOut}
            iconClassName="text-danger"
            onClick={endSession}
          >
            Sair da conta
          </Button>
        </div>
      </form>
    </div>
  )
}
