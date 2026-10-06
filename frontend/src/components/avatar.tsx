import { useState } from 'react'
import { getInitials } from '@/lib/format'
import { cn } from '@/lib/utils'

type AvatarProps = {
  name: string
  /** Foto do usuário. Sem ela, ou se a imagem não carregar, o avatar mostra as iniciais. */
  src?: string | null
  size?: 'sm' | 'lg'
  className?: string
}

export function Avatar({ name, src, size = 'sm', className }: AvatarProps) {
  // Guarda qual endereço falhou: uma foto nova volta a ser tentada.
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  const showImage = Boolean(src) && src !== failedSrc

  return (
    <span
      aria-hidden
      className={cn(
        'inline-flex shrink-0 select-none items-center justify-center overflow-hidden rounded-full bg-gray-300 font-medium text-gray-800',
        size === 'lg' ? 'size-16 text-2xl' : 'size-9 text-sm',
        className,
      )}
    >
      {showImage && src ? (
        <img
          src={src}
          alt=""
          draggable={false}
          className="size-full object-cover"
          onError={() => setFailedSrc(src)}
        />
      ) : (
        getInitials(name)
      )}
    </span>
  )
}
