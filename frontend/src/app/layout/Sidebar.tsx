import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Sparkles,
  Puzzle,
  Settings,
  Rocket,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { ThemeSwitcher } from './ThemeSwitcher'

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Studio', href: '/studio', icon: Sparkles },
  { name: 'Components', href: '/components', icon: Puzzle },
  { name: 'Deploy', href: '/deploy', icon: Rocket },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        'bg-sidebar flex flex-col border-r border-sidebar transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
              <span className="text-sidebar-primary-foreground font-bold text-sm">J</span>
            </div>
            <span className="text-sidebar font-semibold">SecretAI Rails Studio</span>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center mx-auto">
            <span className="text-sidebar-primary-foreground font-bold text-sm">J</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                'hover:bg-sidebar-hover',
                isActive
                  ? 'bg-sidebar-active text-sidebar'
                  : 'text-sidebar-muted'
              )
            }
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            {!collapsed && <span>{item.name}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Theme Switcher */}
      <div className="p-2 border-t border-sidebar">
        <ThemeSwitcher collapsed={collapsed} />
      </div>

      {/* Collapse Toggle */}
      <div className="p-2 border-t border-sidebar">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium w-full',
            'text-sidebar-muted hover:bg-sidebar-hover hover:text-sidebar transition-colors'
          )}
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5 mx-auto" />
          ) : (
            <>
              <ChevronLeft className="h-5 w-5" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  )
}
