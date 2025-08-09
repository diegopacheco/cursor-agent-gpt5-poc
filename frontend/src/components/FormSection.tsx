import { ReactNode } from 'react'

type Props = { title: string; children: ReactNode }

export function FormSection({ title, children }: Props) {
  return (
    <div className="section card">
      <h2 className="h1">{title}</h2>
      <div className="col">
        {children}
      </div>
    </div>
  )
}
