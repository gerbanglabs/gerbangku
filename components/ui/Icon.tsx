// components/ui/Icon.tsx
const Icon = ({ name, size = 20, className = '' }: { name: string; size?: number; className?: string }) => {
  const icons: Record<string, React.ReactNode> = {
    grid: <path d="M3 3h7v7H3zM13 3h8v7h-8zM13 13h8v8h-8zM3 13h7v8H3z" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinejoin="round"/>,
    box: <path d="M21 8l-9-5-9 5v8l9 5 9-5V8zM3 8l9 5 9-5M12 13v8" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinejoin="round"/>,
    file: <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinejoin="round"/>,
    chat: <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinejoin="round"/>,
    chart: <path d="M18 20V10M12 20V4M6 20v-6" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round"/>,
    setting: <path d="M12 15a3 3 0 100-6 3 3 0 000 6z M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" strokeWidth="1.5" stroke="currentColor" fill="none"/>,
    home: <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinejoin="round"/>,
    plus: <path d="M12 5v14M5 12h14" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round"/>,
    arrow: <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"/>,
    bell: <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinejoin="round"/>,
    user: <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinejoin="round"/>,
    truck: <path d="M1 3h15v13H1zM16 8h4l3 3v5h-7V8zM5.5 21a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM18.5 21a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinejoin="round"/>,
    logout: <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"/>,
    whatsapp: <circle cx="12" cy="12" r="10" strokeWidth="1.5" stroke="currentColor" fill="none"/>,
    receipt: <path d="M4 2v20l3-2 2 2 3-2 3 2 2-2 3 2V2l-3 2-2-2-3 2-3-2-2 2-3-2zM9 7h6M9 11h6M9 15h4" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinejoin="round"/>,
    shop: <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinejoin="round"/>,
  }

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="none">
      {icons[name] || null}
    </svg>
  )
}

export default Icon