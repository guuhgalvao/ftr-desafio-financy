import { Check, Info, X } from 'lucide-react'
import { Toaster as Sonner, type ToasterProps } from 'sonner'

function Toaster(props: ToasterProps) {
  return (
    <Sonner
      theme="light"
      position="top-right"
      icons={{
        success: <Check className="size-4 text-success" />,
        error: <X className="size-4 text-danger" />,
        info: <Info className="size-4 text-info" />,
      }}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            'flex w-full items-center gap-2 rounded-lg border border-gray-200 bg-white p-4 font-sans text-sm text-gray-800',
          title: 'font-normal',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
