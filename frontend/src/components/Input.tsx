import { InputHTMLAttributes, ReactNode } from 'react'

type Props = InputHTMLAttributes<HTMLInputElement> & { label?: string; right?: ReactNode }

export function Input({ label, right, ...rest }: Props) {
  return (
    <div className="col">
      {label && <span className="label">{label}</span>}
      <div className="row" style={{ gap: 8 }}>
        <input {...rest} className="input" />
        {right}
      </div>
    </div>
  )
}
