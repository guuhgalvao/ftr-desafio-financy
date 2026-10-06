import { useMutation } from '@apollo/client/react'
import { Trash, X } from 'lucide-react'
import { type ChangeEvent, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { Avatar } from '@/components/avatar'
import { Button } from '@/components/button'
import { IconButton } from '@/components/icon-button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { CREATE_AVATAR_UPLOAD_URL_MUTATION } from '@/graphql/mutations/create-avatar-upload-url'
import { REMOVE_AVATAR_MUTATION } from '@/graphql/mutations/remove-avatar'
import { UPDATE_AVATAR_MUTATION } from '@/graphql/mutations/update-avatar'
import { getErrorMessage, getGraphQLErrorCode } from '@/lib/errors'
import { cn } from '@/lib/utils'
import { AVATAR_TYPES, validateAvatarFile } from '@/schemas/user'
import { type SessionUser, useAuthStore } from '@/stores/auth'

const UPLOAD_FAILED_MESSAGE = 'Não foi possível enviar a imagem. Tente novamente.'

/** Falha do `PUT` no bucket: não é erro da API e não tem mensagem do contrato. */
class UploadError extends Error {}

type AvatarDialogProps = {
  open: boolean
  user: SessionUser
  onOpenChange: (open: boolean) => void
}

export function AvatarDialog({ open, user, onOpenChange }: AvatarDialogProps) {
  const [isBusy, setIsBusy] = useState(false)

  // Conta as aberturas: cada uma começa sem arquivo escolhido, mesmo reabrindo antes de a
  // animação de saída terminar (mesmo padrão dos modais de categoria e de transação).
  const [opening, setOpening] = useState(0)
  const [wasOpen, setWasOpen] = useState(open)
  if (open !== wasOpen) {
    setWasOpen(open)
    if (open) setOpening((count) => count + 1)
  }

  return (
    // Durante o envio ou a remoção o modal não fecha (x, Esc, overlay).
    <Dialog open={open} onOpenChange={(next) => !isBusy && onOpenChange(next)}>
      <DialogContent>
        <DialogHeader>
          <div className="flex flex-col gap-0.5">
            <DialogTitle>Foto de perfil</DialogTitle>
            <DialogDescription>Personalize sua conta com uma foto</DialogDescription>
          </div>
          <DialogClose asChild>
            <IconButton icon={X} aria-label="Fechar" disabled={isBusy} />
          </DialogClose>
        </DialogHeader>
        <AvatarForm
          key={opening}
          user={user}
          onBusyChange={setIsBusy}
          onDone={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}

type AvatarFormProps = {
  user: SessionUser
  onBusyChange: (isBusy: boolean) => void
  onDone: () => void
}

type Selection = { file: File; previewUrl: string }

function AvatarForm({ user, onBusyChange, onDone }: AvatarFormProps) {
  const updateUser = useAuthStore((state) => state.updateUser)
  const inputRef = useRef<HTMLInputElement>(null)
  const chooseButtonRef = useRef<HTMLButtonElement>(null)

  const [selection, setSelection] = useState<Selection | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isRemoveOpen, setIsRemoveOpen] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)

  const [createAvatarUploadUrl] = useMutation(CREATE_AVATAR_UPLOAD_URL_MUTATION)
  const [updateAvatar] = useMutation(UPDATE_AVATAR_MUTATION)
  const [removeAvatar] = useMutation(REMOVE_AVATAR_MUTATION)

  // A prévia é um object URL: libera ao trocar de arquivo e ao fechar o modal.
  const previewUrl = selection?.previewUrl
  useEffect(() => {
    if (!previewUrl) return
    return () => URL.revokeObjectURL(previewUrl)
  }, [previewUrl])

  // Sem isto, o foco inicial do Dialog cairia no botão de fechar.
  useEffect(() => {
    chooseButtonRef.current?.focus()
  }, [])

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    // Zera o campo: escolher o mesmo arquivo de novo volta a disparar o `change`.
    event.target.value = ''
    if (!file) return

    // Arquivo recusado aqui não chega a ser enviado. A escolha anterior, se houver, continua.
    const error = validateAvatarFile(file)
    setFileError(error)
    if (error) {
      toast.error(error)
      return
    }
    setSelection({ file, previewUrl: URL.createObjectURL(file) })
  }

  async function handleUpload() {
    if (!selection) return
    const { file } = selection
    setIsUploading(true)
    onBusyChange(true)

    try {
      const created = await createAvatarUploadUrl({
        variables: { contentType: file.type, contentLength: file.size },
      })
      if (!created.data) return
      const { uploadUrl, key } = created.data.createAvatarUploadUrl

      // O arquivo vai direto para o bucket. Tipo e tamanho fazem parte da assinatura da URL.
      const response = await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      }).catch(() => null)
      if (!response?.ok) throw new UploadError()

      const updated = await updateAvatar({ variables: { key } })
      if (!updated.data) return
      updateUser(updated.data.updateAvatar)
      toast.success('Foto atualizada com sucesso')
      onDone()
    } catch (error) {
      // Sessão expirada: o link de erro do Apollo já encerra a sessão e mostra o toast.
      if (getGraphQLErrorCode(error) === 'UNAUTHENTICATED') return
      // O modal e a prévia continuam na tela para uma nova tentativa.
      toast.error(error instanceof UploadError ? UPLOAD_FAILED_MESSAGE : getErrorMessage(error))
    } finally {
      setIsUploading(false)
      onBusyChange(false)
    }
  }

  async function handleRemove() {
    setIsRemoving(true)
    onBusyChange(true)

    try {
      const result = await removeAvatar()
      if (!result.data) return
      updateUser(result.data.removeAvatar)
      toast.success('Foto removida com sucesso')
      setIsRemoveOpen(false)
      onDone()
    } catch (error) {
      if (getGraphQLErrorCode(error) === 'UNAUTHENTICATED') return
      toast.error(getErrorMessage(error))
    } finally {
      setIsRemoving(false)
      onBusyChange(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-4">
        <Avatar
          name={user.name}
          src={selection?.previewUrl ?? user.avatarUrl}
          className={cn('size-24 text-4xl', isUploading && 'opacity-50')}
        />

        <input
          ref={inputRef}
          type="file"
          accept={AVATAR_TYPES.join(',')}
          className="sr-only"
          tabIndex={-1}
          aria-hidden
          onChange={handleFileChange}
        />

        <div className="flex flex-col items-center gap-2">
          <Button
            ref={chooseButtonRef}
            size="sm"
            variant="outline"
            disabled={isUploading}
            aria-describedby="avatar-file-message"
            onClick={() => inputRef.current?.click()}
          >
            {selection ? 'Escolher outra imagem' : 'Escolher imagem'}
          </Button>
          {/* Como nos campos do formulário, o erro substitui o texto de apoio. */}
          <p
            id="avatar-file-message"
            className={cn('text-center text-xs', fileError ? 'text-danger' : 'text-gray-500')}
          >
            {fileError ?? 'PNG, JPG ou WEBP de até 2 MB'}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <Button fullWidth disabled={!selection || isUploading} onClick={() => void handleUpload()}>
          {isUploading ? 'Enviando...' : 'Salvar'}
        </Button>
        {user.avatarUrl && (
          <Button
            variant="outline"
            fullWidth
            icon={Trash}
            iconClassName="text-danger"
            disabled={isUploading}
            onClick={() => setIsRemoveOpen(true)}
          >
            Remover foto
          </Button>
        )}
      </div>

      <AlertDialog
        open={isRemoveOpen}
        onOpenChange={(next) => !isRemoving && setIsRemoveOpen(next)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover foto</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover sua foto de perfil? Seu avatar volta a mostrar as
              iniciais do seu nome.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button size="sm" variant="outline" disabled={isRemoving}>
                Cancelar
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                size="sm"
                variant="danger"
                disabled={isRemoving}
                onClick={(event) => {
                  // O diálogo só fecha depois da resposta da API.
                  event.preventDefault()
                  void handleRemove()
                }}
              >
                {isRemoving ? 'Removendo...' : 'Remover'}
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
