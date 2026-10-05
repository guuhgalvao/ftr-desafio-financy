import { useMutation } from '@apollo/client/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, UserRoundPlus } from 'lucide-react'
import { useId } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Link as RouterLink } from 'react-router'
import { toast } from 'sonner'
import { AuthLayout } from '@/components/auth-layout'
import { Button, ButtonIcon } from '@/components/button'
import { Input } from '@/components/input'
import { Link } from '@/components/link'
import { PasswordInput } from '@/components/password-input'
import { Checkbox } from '@/components/ui/checkbox'
import { LOGIN_MUTATION } from '@/graphql/mutations/login'
import { getErrorMessage } from '@/lib/errors'
import { type LoginFormData, loginSchema } from '@/schemas/user'
import { useAuthStore } from '@/stores/auth'

export function LoginPage() {
  const signIn = useAuthStore((state) => state.signIn)
  const [login] = useMutation(LOGIN_MUTATION)
  const rememberId = useId()

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', remember: false },
  })

  async function onSubmit({ remember, ...data }: LoginFormData) {
    try {
      const result = await login({ variables: { data } })
      if (result.data) signIn(result.data.login, remember)
    } catch (error) {
      // Credenciais erradas chegam como UNAUTHENTICATED, com a mensagem do contrato, sem apontar campo.
      toast.error(getErrorMessage(error))
    }
  }

  return (
    <AuthLayout
      title="Fazer login"
      subtitle="Entre na sua conta para continuar"
      footerText="Ainda não tem uma conta?"
      footerAction={
        <Button asChild variant="outline" fullWidth>
          <RouterLink to="/cadastro">
            <ButtonIcon icon={UserRoundPlus} variant="outline" />
            Criar conta
          </RouterLink>
        </Button>
      }
    >
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
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
            autoComplete="current-password"
            error={errors.password?.message}
            {...register('password')}
          />

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Controller
                control={control}
                name="remember"
                render={({ field }) => (
                  <Checkbox
                    id={rememberId}
                    ref={field.ref}
                    checked={field.value}
                    onCheckedChange={(checked) => field.onChange(checked === true)}
                    onBlur={field.onBlur}
                  />
                )}
              />
              <label htmlFor={rememberId} className="cursor-pointer text-gray-700 text-sm">
                Lembrar-me
              </label>
            </div>

            <Link onClick={() => toast.info('Recuperação de senha ainda não disponível')}>
              Recuperar senha
            </Link>
          </div>
        </div>

        <Button type="submit" fullWidth disabled={isSubmitting}>
          {isSubmitting ? 'Entrando...' : 'Entrar'}
        </Button>
      </form>
    </AuthLayout>
  )
}
