import { Link } from 'react-router-dom'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-agro-green/10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center">
        <Link
          to="/"
          className="flex items-center gap-3 transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-agro-green rounded-md"
          aria-label="Go to home page"
        >
          <img
            src="/logo.png"
            alt="AgroIA Logo"
            width={60}
            height={60}
            className="w-[60px] h-[60px] object-contain drop-shadow-sm"
            onError={(e) => {
              const target = e.currentTarget
              target.src = 'https://img.usecurling.com/p/60/60?q=drone'
              target.onerror = null
            }}
          />
          <span className="font-display font-bold text-2xl tracking-tight text-agro-green hidden sm:inline-block">
            Agro<span className="text-agro-yellow">IA</span>
          </span>
        </Link>
      </div>
    </header>
  )
}
