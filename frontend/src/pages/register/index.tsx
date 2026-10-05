import { useMutation } from '@apollo/client/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { LogIn, Mail, UserRound } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Link as RouterLink } from 'react-router'
import { toast } from 'sonner'
import { AuthLayout } from '@/components/auth-layout'
import { Button, ButtonIcon } from '@/components/button'
import { Input } from '@/components/input'
import { PasswordInput } from '@/components/password-input'
import { REGISTER_MUTATION } from '@/graphql/mutations/register'
import { getErrorMessage, getGraphQLErrorCode, getGraphQLErrorField } from '@/lib/errors'
import { type RegisterFormData, registerSchema } from '@/schemas/user'
import { useAuthStore } from '@/stores/auth'

const FORM_FIELDS = ['name', 'email', 'password'] as const

function isFormField(field: string | undefined): field is (typeof FORM_FIELDS)[number] {
  return FORM_FIELDS.some((item) => item === field)
}

export function RegisterPage() {
  const signIn = useAuthStore((state) => state.signIn)
  const [registerUser] = useMutation(REGISTER_MUTATION)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '' },
  })

  async function onSubmit(data: RegisterFormData) {
    try {
      const result = await registerUser({ variables: { data } })
      if (!result.data) return
      // O cadastro sempre persiste a sessão; já logado, `/cadastro` redireciona para o Dashboard.
      signIn(result.data.register, true)
      toast.success('Conta criada com sucesso')
    } catch (error) {
      const message = getErrorMessage(error)
      const field = getGraphQLErrorField(error)

      if (getGraphQLErrorCode(error) === 'CONFLICT') {
        setError('email', { message }, { shouldFocus: true })
      } else if (isFormField(field)) {
        setError(field, { message }, { shouldFocus: true })
      } else {
        toast.error(message)
      }
    }
  }

  return (
    <AuthLayout
      title="Criar conta"
      subtitle="Comece a controlar suas finanças ainda hoje"
      footerText="Já tem uma conta?"
      footerAction={
        <Button asChild variant="outline" fullWidth>
          <RouterLink to="/">
            <ButtonIcon icon={LogIn} variant="outline" />
            Fazer login
          </RouterLink>
        </Button>
      }
    >
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
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
            placeholder="mail@exemplo.com"
            autoComplete="email"
            error={errors.email?.message}
            {...register('email')}
          />
          <PasswordInput
            label="Senha"
            placeholder="Digite sua senha"
            autoComplete="new-password"
            helper="A senha deve ter no mínimo 8 caracteres"
            error={errors.password?.message}
            {...register('password')}
          />
        </div>

        <Button type="submit" fullWidth disabled={isSubmitting}>
          {isSubmitting ? 'Cadastrando...' : 'Cadastrar'}
        </Button>
      </form>
    </AuthLayout>
  )
}
