import { TextareaHTMLAttributes } from 'react'

type Props = TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string }

export function TextArea({ label, ...rest }: Props) {
  return (
    <div className="col">
      {label && <span className="label">{label}</span>}
      <textarea {...rest} className="textarea" aria-label={label} />
    </div>
  )
}
