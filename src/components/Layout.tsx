/* Layout Component - A component that wraps the main content of the app
   - Use this file to add a header, footer, or other elements that should be present on every page
   - This component is used in the App.tsx file to wrap the main content of the app */

import { Outlet, useLocation } from 'react-router-dom'
import { Header } from '@/components/Header'
import { useAuth } from '@/contexts/AuthContext'
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/AppSidebar'
import { Loader2 } from 'lucide-react'

export default function Layout() {
  const auth = useAuth() as any
  const location = useLocation()

  // Do not show sidebar on landing page, login, register, forgot-password
  const publicPaths = ['/', '/login', '/cadastro', '/forgot-password']
  const isPublicPath = publicPaths.includes(location.pathname)

  if (!isPublicPath && auth?.loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (auth?.user && !isPublicPath) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-background">
            <SidebarTrigger className="-ml-1" />
          </header>
          <main className="flex-1 flex flex-col p-4 md:p-6 overflow-auto bg-background">
            <Outlet />
          </main>
        </SidebarInset>
      </SidebarProvider>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
    </div>
  )
}
