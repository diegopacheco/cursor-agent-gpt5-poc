type Props = { src?: string; name: string; size?: number }

export function Avatar({ src, name, size = 36 }: Props) {
  const initials = name.trim().split(/\s+/).slice(0, 2).map(p => p[0]?.toUpperCase() ?? '').join('') || '?'
  if (src) return <img src={src} alt={name} width={size} height={size} className="avatar" />
  return <div className="avatar" style={{ width: size, height: size }}>{initials}</div>
}
