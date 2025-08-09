import { SelectHTMLAttributes } from 'react'

type Props = SelectHTMLAttributes<HTMLSelectElement> & { label?: string }

export function Select({ label, children, ...rest }: Props) {
  return (
    <div className="col">
      {label && <span className="label">{label}</span>}
      <select {...rest} className="select">
        {children}
      </select>
    </div>
  )
}
