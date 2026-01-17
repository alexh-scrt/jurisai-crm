import { useLocation, Link } from 'react-router-dom'
import { ChevronRight, Bell, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const routeNames: Record<string, string> = {
  '/': 'Dashboard',
  '/workflows': 'Workflows',
  '/workflows/new': 'New Workflow',
  '/components': 'Component Library',
  '/deploy': 'Deploy & Monitor',
  '/settings': 'Settings',
}

function getBreadcrumbs(pathname: string) {
  const segments = pathname.split('/').filter(Boolean)
  const breadcrumbs: { name: string; href: string }[] = [
    { name: 'Studio', href: '/' },
  ]

  let currentPath = ''
  for (const segment of segments) {
    currentPath += `/${segment}`
    const name = routeNames[currentPath] || segment.charAt(0).toUpperCase() + segment.slice(1)
    breadcrumbs.push({ name, href: currentPath })
  }

  return breadcrumbs
}

export function Header() {
  const location = useLocation()
  const breadcrumbs = getBreadcrumbs(location.pathname)

  return (
    <header className="h-16 border-b flex items-center justify-between px-6 bg-card">
      {/* Left: Breadcrumbs */}
      <div className="flex items-center gap-2">
        <nav className="flex items-center gap-1 text-sm">
          {breadcrumbs.map((crumb, index) => (
            <span key={crumb.href} className="flex items-center gap-1">
              {index > 0 && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
              {index === breadcrumbs.length - 1 ? (
                <span className="font-medium text-foreground">{crumb.name}</span>
              ) : (
                <Link
                  to={crumb.href}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {crumb.name}
                </Link>
              )}
            </span>
          ))}
        </nav>
      </div>

      {/* Center: Search */}
      <div className="flex-1 max-w-md mx-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search workflows, components..."
            className="pl-9 bg-muted/50"
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  JD
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">John Doe</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Account Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
