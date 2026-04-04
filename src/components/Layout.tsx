/* Layout Component - A component that wraps the main content of the app
   - Use this file to add a header, footer, or other elements that should be present on every page
   - This component is used in the App.tsx file to wrap the main content of the app */

import { Outlet, useLocation } from 'react-router-dom'
import { Header } from '@/components/Header'
import { useAuth } from '@/contexts/AuthContext'
import { Loader2 } from 'lucide-react'
import { AppDock } from '@/components/AppDock'
import { Logo } from '@/components/ui/logo'

export default function Layout() {
  const auth = useAuth() as any
  const location = useLocation()

  // Do not show dock on landing page, login, register, forgot-password
  const publicPaths = ['/', '/login', '/cadastro', '/forgot-password']
  const isPublicPath = publicPaths.includes(location.pathname)

  if (!isPublicPath && auth?.loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#000000]">
        <Loader2 className="h-8 w-8 animate-spin text-primary drop-shadow-[0_0_10px_rgba(29,185,84,0.5)]" />
      </div>
    )
  }

  if (auth?.user && !isPublicPath) {
    return (
      <div className="flex h-[100dvh] bg-[#000000] text-white overflow-hidden relative">
        <div className="fixed left-0 top-0 bottom-0 z-50 pl-2 md:pl-4 flex flex-col justify-center pointer-events-none w-20 md:w-24">
          <div className="pointer-events-auto h-full max-h-full">
            <AppDock />
          </div>
        </div>
        <div className="flex-1 flex flex-col min-w-0 pl-20 md:pl-24">
          <header className="flex h-16 shrink-0 items-center justify-between border-b border-primary/20 px-4 md:px-6 bg-[#050505]/80 sticky top-0 z-10 backdrop-blur-xl">
            <div className="flex items-center gap-2 font-bold text-xl text-white">
              <Logo className="h-8 w-8 text-primary drop-shadow-[0_0_8px_rgba(29,185,84,0.6)]" />
              <span className="tracking-wider">AgroIA</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden md:block">
                <div
                  className="text-sm font-bold text-white truncate max-w-[150px]"
                  title={auth.user?.user_metadata?.name || auth.user?.nome || 'Produtor'}
                >
                  {auth.user?.user_metadata?.name || auth.user?.nome || 'Produtor'}
                </div>
                <div
                  className="text-xs text-primary truncate max-w-[150px]"
                  title={auth.user?.email}
                >
                  {auth.user?.email}
                </div>
              </div>
            </div>
          </header>
          <main className="flex-1 flex flex-col p-4 md:p-8 overflow-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <Outlet />
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#000000]">
      <Header />
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
    </div>
  )
}
