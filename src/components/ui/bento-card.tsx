import React, { useState, useMemo } from 'react'
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Folder,
  Plus,
  ArrowUpRight,
  Search,
  BarChart2,
  Check,
  Settings,
  Info,
  Database,
  Mail,
  User,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface TabConfig {
  id: string
  label: string
  icon: any
  badge?: string
  header: string
  description: string
}

const TABS: TabConfig[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    header: 'Project Overview',
    description: 'Daily summary of your team performance.',
  },
  {
    id: 'management',
    label: 'Management',
    icon: Users,
    header: 'Team Management',
    description: 'Manage roles and user permissions.',
    badge: '10',
  },
  {
    id: 'threads',
    label: 'Threads',
    icon: MessageSquare,
    header: 'Communications',
    description: 'High-priority team discussions.',
    badge: '12',
  },
  {
    id: 'resources',
    label: 'Resources',
    icon: Folder,
    header: 'System Assets',
    description: 'Shared documentation and media logs.',
  },
]

export default function BentoCard() {
  const [activeTab, setActiveTab] = useState(TABS[0])

  const content = useMemo(() => {
    switch (activeTab.id) {
      case 'dashboard':
        return <OverviewDashboard />
      case 'management':
        return <ManagementDashboard />
      case 'threads':
        return <ThreadsDashboard />
      case 'resources':
        return <ResourcesDashboard />
      default:
        return null
    }
  }, [activeTab.id])

  return (
    <div className="flex items-center justify-center w-full antialiased">
      <div className="group relative w-full max-w-4xl overflow-hidden rounded-3xl sm:rounded-[2rem] border bg-card shadow-2xl shadow-primary/5 transition-all duration-500 hover:shadow-primary/10 hover:-translate-y-1 m-0">
        <div className="p-4 sm:p-6 space-y-1.5 z-10 relative">
          <h2 className="text-xs text-muted-foreground uppercase tracking-wider">
            Project Dashboard
          </h2>
          <p className="text-lg sm:text-2xl text-foreground font-medium leading-snug max-w-[480px]">
            High-performance analytics and team collaboration tools in one place.
          </p>
        </div>

        <div className="relative w-full h-[320px] sm:h-[400px] overflow-hidden rounded-2xl sm:rounded-[2rem] ">
          <div className="absolute top-16 left-16 w-full h-full bg-muted rounded-3xl border border-border/50 opacity-80" />

          <div className="absolute top-8 left-24 w-full h-full bg-background rounded-tl-3xl shadow-xl flex flex-col overflow-hidden ring-1 ring-border">
            <div className="px-5 py-4 rounded-tl-3xl border-b border-border/70 flex items-center relative backdrop-blur-sm bg-background/50">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-muted-foreground/20" />
                <div className="w-2 h-2 rounded-full bg-muted-foreground/20" />
                <div className="w-2 h-2 rounded-full bg-muted-foreground/20" />
              </div>
              <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
                <span className="text-xs text-muted-foreground/50 uppercase font-medium">
                  Workspace
                </span>
              </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
              <div className="w-36 border-r border-border/30 p-2 flex flex-col gap-1 pt-6 bg-muted/5">
                {TABS.map((tab) => {
                  const isActive = activeTab.id === tab.id
                  const Icon = tab.icon

                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab)}
                      className={cn(
                        'relative flex items-center gap-1.5 p-2 rounded-xl text-xs transition-colors cursor-pointer group/btn',
                        isActive
                          ? 'text-foreground bg-muted border border-border/40'
                          : 'text-muted-foreground hover:text-foreground border border-transparent hover:bg-muted/30',
                      )}
                    >
                      <Icon size={14} className="z-20 shrink-0 relative" />
                      <span className="truncate z-20 relative font-medium">{tab.label}</span>
                      {tab.badge && (
                        <span
                          className={cn(
                            'ml-auto text-[8px] leading-none py-0.5 px-1 rounded-md tabular-nums transition-all z-20 relative',
                            isActive
                              ? 'bg-primary/10 text-primary border border-primary/20'
                              : 'bg-muted text-muted-foreground border border-transparent',
                          )}
                        >
                          {tab.badge}
                        </span>
                      )}

                      {isActive && (
                        <div className="absolute left-0 w-[2px] h-4 rounded-full bg-primary z-30 border border-primary/20" />
                      )}
                    </button>
                  )
                })}
              </div>

              <div className="flex-1 bg-background p-5 pt-6 flex flex-col gap-4 overflow-hidden relative">
                <header className="flex flex-col gap-0.5">
                  <h3 className="text-xs font-semibold text-foreground tracking-tight line-clamp-1 uppercase opacity-60">
                    {activeTab.header}
                  </h3>
                  <p className="text-[10px] text-muted-foreground font-normal leading-tight line-clamp-1">
                    {activeTab.description}
                  </p>
                </header>

                <div key={activeTab.id} className="flex-1 animate-fade-in">
                  {content}
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-background to-transparent pointer-events-none z-20" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const OverviewDashboard = () => (
  <div className="flex flex-col gap-3 h-full max-w-sm">
    <div className="relative p-3.5 rounded-xl border border-border/40 bg-gradient-to-br from-background to-muted/20 overflow-hidden">
      <div className="flex flex-col gap-2 relative z-10">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-medium text-muted-foreground uppercase tracking-wider">
            Team Performance
          </span>
          <ArrowUpRight size={12} className="text-primary" />
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-2xl font-medium tracking-tight text-foreground">94.2%</span>
          <div className="w-full h-1 bg-muted rounded-full overflow-hidden mt-1 relative">
            <div
              className="absolute left-0 top-0 h-full bg-primary rounded-full transition-all duration-1000 ease-out"
              style={{ width: '94.2%' }}
            />
          </div>
        </div>
        <span className="text-[9px] text-muted-foreground mt-1">
          Score for Search & Delivery campaigns
        </span>
      </div>
      <div className="absolute -right-2 -bottom-2 opacity-5 scale-150 rotate-12">
        <BarChart2 size={64} />
      </div>
    </div>

    <div className="grid grid-cols-2 gap-2">
      <div className="p-3 rounded-xl border border-border/40 bg-background/50 flex items-center justify-between hover:bg-muted/10 transition-colors cursor-pointer">
        <div className="flex flex-col">
          <span className="text-[11px] font-medium text-foreground">1,070</span>
          <span className="text-[8px] text-muted-foreground uppercase font-medium">Keywords</span>
        </div>
        <Search size={14} className="opacity-30 text-primary" />
      </div>
      <div className="p-3 rounded-xl border border-border/40 bg-background/50 flex items-center justify-between hover:bg-muted/10 transition-colors cursor-pointer">
        <div className="flex flex-col">
          <span className="text-[11px] font-medium text-foreground">2.3M</span>
          <span className="text-[8px] text-muted-foreground uppercase font-medium">Credits</span>
        </div>
        <Info size={14} className="opacity-30 text-primary" />
      </div>
    </div>
  </div>
)

const ManagementDashboard = () => (
  <div className="flex flex-col h-full not-prose max-w-sm">
    <div className="rounded-xl border border-border/40 overflow-hidden flex flex-col h-full bg-background/50">
      <div className="bg-muted/30 px-3 py-2 border-b border-border/40 flex items-center justify-between">
        <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider">
          Active Users
        </span>
        <div className="flex items-center gap-1.5 px-1.5 py-0.5 rounded-md bg-background border border-border/40 cursor-pointer hover:bg-muted/50 transition-colors">
          <Search size={10} className="text-muted-foreground/50" />
          <span className="text-[8px] text-muted-foreground font-medium">Search</span>
        </div>
      </div>
      <div className="p-1 flex flex-col gap-0.5">
        {[
          {
            name: 'Anthony Dionne',
            role: 'Pending admin approval',
            status: 'Waitlist',
            color: 'bg-amber-400',
          },
          {
            name: 'Nick Yahodin',
            role: 'Dealership group admin',
            status: 'Active',
            color: 'bg-emerald-400',
          },
          {
            name: 'Mujeeb Aimaq',
            role: 'Dealership group user',
            status: 'Active',
            color: 'bg-emerald-400',
          },
        ].map((user, i) => (
          <div
            key={i}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/30 transition-colors group cursor-pointer"
          >
            <div className="w-6 h-6 rounded-full bg-muted border border-border/40 flex items-center justify-center relative">
              <User size={10} className="text-muted-foreground" />
              <div
                className={cn(
                  'absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-background',
                  user.color,
                )}
              />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-[10px] font-medium text-foreground truncate">{user.name}</span>
              <span className="text-[8px] text-muted-foreground truncate">{user.role}</span>
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <Settings size={12} className="text-muted-foreground" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
)

const ThreadsDashboard = () => (
  <div className="flex flex-col gap-3 h-full max-w-sm">
    <div className="grid grid-cols-2 gap-3">
      {[
        {
          title: 'Create a Page',
          desc: 'Build your project base.',
          icon: Folder,
        },
        {
          title: 'Create a Task',
          desc: 'Organize with team.',
          icon: Check,
        },
      ].map((card, i) => (
        <div
          key={i}
          className="p-3.5 rounded-xl border border-border/40 bg-background/50 flex flex-col gap-3 relative overflow-hidden group hover:bg-muted/10 transition-colors"
        >
          <div className="flex flex-col gap-1 z-10">
            <span className="text-[12px] font-medium text-foreground leading-tight">
              {card.title}
            </span>
            <span className="text-[9px] text-muted-foreground leading-tight">{card.desc}</span>
          </div>
          <button className="w-fit flex items-center gap-1.5 px-2 py-1 rounded-md bg-foreground text-background text-[8px] font-semibold transition-transform active:scale-95 group-hover:bg-primary z-10 mt-1">
            <Plus size={8} strokeWidth={3} />
            Create
          </button>
        </div>
      ))}
    </div>

    <div className="mt-auto p-3 rounded-xl bg-muted/20 border border-border/30 flex items-center justify-between hover:bg-muted/30 transition-colors cursor-pointer group">
      <div className="flex items-center gap-2">
        <div className="p-1 px-1.5 rounded-md bg-background border border-border/40 group-hover:border-primary/30 transition-colors">
          <Info
            size={10}
            className="text-muted-foreground group-hover:text-primary transition-colors"
          />
        </div>
        <span className="text-[9px] text-muted-foreground font-medium group-hover:text-foreground transition-colors">
          Pin a new item
        </span>
      </div>
      <Plus
        size={12}
        className="text-muted-foreground/50 group-hover:text-primary transition-colors"
      />
    </div>
  </div>
)

const ResourcesDashboard = () => (
  <div className="flex flex-col gap-3 h-full overflow-hidden max-w-sm">
    <div className="flex-1 rounded-xl border border-border/40 flex flex-col bg-background/50 overflow-hidden">
      <div className="bg-muted/30 px-3 py-2 border-b border-border/40 flex items-center justify-between">
        <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider">
          Archives & Logs
        </span>
        <Database size={12} className="text-muted-foreground/30" />
      </div>
      <div className="flex-1 p-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {[
          {
            file: 'design_spec_v2.pdf',
            size: '2.4 MB',
            type: 'PDF',
            icon: Mail,
          },
          {
            file: 'q4_performance.xls',
            size: '1.1 MB',
            type: 'XLS',
            icon: BarChart2,
          },
          {
            file: 'branding_assets.zip',
            size: '48 MB',
            type: 'ZIP',
            icon: Folder,
          },
          {
            file: 'system_logs.json',
            size: '4 KB',
            type: 'JSON',
            icon: Folder,
          },
        ].map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-muted/30 transition-colors cursor-pointer group"
          >
            <div className="w-6 h-6 rounded-md bg-muted/50 border border-border/40 flex items-center justify-center text-muted-foreground/60 group-hover:text-primary group-hover:bg-primary/5 transition-colors">
              <item.icon size={12} />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-[10px] font-medium text-foreground truncate">{item.file}</span>
              <span className="text-[8px] text-muted-foreground tabular-nums uppercase">
                {item.size} • {item.type}
              </span>
            </div>
            <ArrowUpRight
              size={10}
              className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
            />
          </div>
        ))}
      </div>
    </div>
  </div>
)
