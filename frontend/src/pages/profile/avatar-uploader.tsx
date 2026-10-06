import { SquarePen } from 'lucide-react'
import { useState } from 'react'
import { Avatar } from '@/components/avatar'
import type { SessionUser } from '@/stores/auth'
import { AvatarDialog } from './avatar-dialog'

/** Avatar grande do Perfil. Toda a área é um botão que abre o modal da foto. */
export function AvatarUploader({ user }: { user: SessionUser }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        aria-label="Alterar foto de perfil"
        onClick={() => setIsOpen(true)}
        className="group relative cursor-pointer rounded-full outline-none focus-visible:outline-2 focus-visible:outline-brand-base focus-visible:outline-offset-2"
      >
        <Avatar name={user.name} src={user.avatarUrl} size="lg" />
        {/* Selo de edição, com a mesma aparência do Icon Button (`square-pen` é o `edit` do Lucide). */}
        <span className="absolute -right-1 -bottom-1 flex size-6 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-700 transition-colors group-hover:bg-gray-200">
          <SquarePen className="size-3" aria-hidden />
        </span>
      </button>

      <AvatarDialog open={isOpen} user={user} onOpenChange={setIsOpen} />
    </>
  )
}
