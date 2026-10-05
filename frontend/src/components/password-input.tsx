import { Eye, EyeClosed, Lock } from 'lucide-react'
import { type ComponentProps, useState } from 'react'
import { Input } from './input'

type PasswordInputProps = Omit<ComponentProps<typeof Input>, 'type' | 'icon' | 'rightSlot'>

/** Campo de senha das telas de acesso, com o botão de mostrar e ocultar (item 3 de screens.md). */
export function PasswordInput(props: PasswordInputProps) {
  const [visible, setVisible] = useState(false)
  const ToggleIcon = visible ? Eye : EyeClosed

  return (
    <Input
      type={visible ? 'text' : 'password'}
      icon={Lock}
      rightSlot={
        <button
          type="button"
          aria-label={visible ? 'Ocultar senha' : 'Mostrar senha'}
          aria-pressed={visible}
          onClick={() => setVisible((current) => !current)}
          className="shrink-0 cursor-pointer rounded-sm text-gray-700 outline-none focus-visible:outline-2 focus-visible:outline-brand-base focus-visible:outline-offset-2"
        >
          <ToggleIcon className="size-4" aria-hidden />
        </button>
      }
      {...props}
    />
  )
}
