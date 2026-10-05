import logo from '@/assets/logo.svg'
import { cn } from '@/lib/utils'

type LogoProps = {
  /** `lg`: 134×32 (telas de acesso). `sm`: 100×24 (navbar). */
  size?: 'sm' | 'lg'
  className?: string
}

export function Logo({ size = 'lg', className }: LogoProps) {
  return (
    <img
      src={logo}
      alt="Financy"
      width={size === 'lg' ? 134 : 100}
      height={size === 'lg' ? 32 : 24}
      className={cn('shrink-0', className)}
    />
  )
}
