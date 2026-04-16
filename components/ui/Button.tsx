// components/ui/Button.tsx
interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'ghost'
  disabled?: boolean
  size?: 'sm' | 'md'
  full?: boolean
  className?: string
  style?: React.CSSProperties
}

export default function Button({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  size = 'md',
  full = false,
  style,
}: ButtonProps) {
  const baseStyle: React.CSSProperties = {
    padding: size === 'sm' ? '7px 16px' : '11px 20px',
    borderRadius: 8,
    fontSize: size === 'sm' ? 12 : 13,
    fontWeight: 700,
    cursor: disabled ? 'default' : 'pointer',
    width: full ? '100%' : 'auto',
    opacity: disabled ? 0.5 : 1,
    transition: 'all 0.15s',
    border: 'none',
  }

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      background: disabled ? '#e2e8f0' : '#38a169',
      color: '#fff',
    },
    secondary: {
      background: '#fff',
      color: '#4a5568',
      border: '1px solid #e2e8f0',
    },
    ghost: {
      background: 'transparent',
      color: '#3182ce',
      border: 'none',
    },
  }

  return (
    <button
      onClick={disabled ? undefined : onClick}
      style={{ ...baseStyle, ...variantStyles[variant], ...style }}
    >
      {children}
    </button>
  )
}