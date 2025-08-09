import { ButtonHTMLAttributes } from 'react'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'danger' }

export function Button({ variant = 'primary', ...rest }: Props) {
  return <button {...rest} className={["button", variant].join(' ')} />
}
