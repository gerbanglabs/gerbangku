// app/(auth)/layout.tsx
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#f7f8fa',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
      fontFamily: "'DM Sans', sans-serif",
    }}>
      {children}
    </div>
  )
}