import { useMutation } from '@apollo/client/react'
import { type ChangeEvent, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { Avatar } from '@/components/avatar'
import { Button } from '@/components/button'
import { Link } from '@/components/link'
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
import { CREATE_AVATAR_UPLOAD_URL_MUTATION } from '@/graphql/mutations/create-avatar-upload-url'
import { REMOVE_AVATAR_MUTATION } from '@/graphql/mutations/remove-avatar'
import { UPDATE_AVATAR_MUTATION } from '@/graphql/mutations/update-avatar'
import { getErrorMessage, getGraphQLErrorCode } from '@/lib/errors'
import { AVATAR_TYPES, validateAvatarFile } from '@/schemas/user'
import { type SessionUser, useAuthStore } from '@/stores/auth'

const UPLOAD_FAILED_MESSAGE = 'Não foi possível enviar a imagem. Tente novamente.'

/** Falha do `PUT` no bucket: não é erro da API e não tem mensagem do contrato. */
class UploadError extends Error {}

type Selection = { file: File; previewUrl: string }

export function AvatarUploader({ user }: { user: SessionUser }) {
  const updateUser = useAuthStore((state) => state.updateUser)
  const inputRef = useRef<HTMLInputElement>(null)

  const [selection, setSelection] = useState<Selection | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isRemoveOpen, setIsRemoveOpen] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)

  const [createAvatarUploadUrl] = useMutation(CREATE_AVATAR_UPLOAD_URL_MUTATION)
  const [updateAvatar] = useMutation(UPDATE_AVATAR_MUTATION)
  const [removeAvatar] = useMutation(REMOVE_AVATAR_MUTATION)

  // A prévia é um object URL: libera ao trocar de arquivo, cancelar, enviar e sair da página.
  const previewUrl = selection?.previewUrl
  useEffect(() => {
    if (!previewUrl) return
    return () => URL.revokeObjectURL(previewUrl)
  }, [previewUrl])

  function openFilePicker() {
    inputRef.current?.click()
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    // Zera o campo: escolher o mesmo arquivo de novo volta a disparar o `change`.
    event.target.value = ''
    if (!file) return

    const error = validateAvatarFile(file)
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
      setSelection(null)
      toast.success('Foto atualizada com sucesso')
    } catch (error) {
      // Sessão expirada: o link de erro do Apollo já encerra a sessão e mostra o toast.
      if (getGraphQLErrorCode(error) === 'UNAUTHENTICATED') return
      // A prévia continua na tela para uma nova tentativa.
      toast.error(error instanceof UploadError ? UPLOAD_FAILED_MESSAGE : getErrorMessage(error))
    } finally {
      setIsUploading(false)
    }
  }

  async function handleRemove() {
    setIsRemoving(true)

    try {
      const result = await removeAvatar()
      if (!result.data) return
      updateUser(result.data.removeAvatar)
      toast.success('Foto removida com sucesso')
      setIsRemoveOpen(false)
    } catch (error) {
      if (getGraphQLErrorCode(error) === 'UNAUTHENTICATED') return
      toast.error(getErrorMessage(error))
    } finally {
      setIsRemoving(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <input
        ref={inputRef}
        type="file"
        accept={AVATAR_TYPES.join(',')}
        className="sr-only"
        tabIndex={-1}
        aria-hidden
        onChange={handleFileChange}
      />

      <button
        type="button"
        aria-label="Alterar foto de perfil"
        disabled={isUploading}
        onClick={openFilePicker}
        className="cursor-pointer rounded-full outline-none focus-visible:outline-2 focus-visible:outline-brand-base focus-visible:outline-offset-2 disabled:pointer-events-none"
      >
        <Avatar
          name={user.name}
          src={selection?.previewUrl ?? user.avatarUrl}
          size="lg"
          className={isUploading ? 'opacity-50' : undefined}
        />
      </button>

      {selection ? (
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Button size="sm" disabled={isUploading} onClick={() => void handleUpload()}>
            {isUploading ? 'Enviando...' : 'Enviar foto'}
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={isUploading}
            onClick={() => setSelection(null)}
          >
            Cancelar
          </Button>
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
          <Link onClick={openFilePicker}>{user.avatarUrl ? 'Alterar foto' : 'Adicionar foto'}</Link>
          {user.avatarUrl && (
            <Link className="text-danger" onClick={() => setIsRemoveOpen(true)}>
              Remover foto
            </Link>
          )}
        </div>
      )}

      <p className="text-gray-500 text-xs">PNG, JPG ou WEBP de até 2 MB</p>

      <AlertDialog
        open={isRemoveOpen}
        onOpenChange={(next) => !isRemoving && setIsRemoveOpen(next)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover foto</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover sua foto de perfil?
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
