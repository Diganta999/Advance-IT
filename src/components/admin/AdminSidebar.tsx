import { Link, useRouterState } from '@tanstack/react-router';
import { LayoutDashboard, Users, Settings, LogOut, Code, FileText, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useSettings } from '@/context/SettingsContext';

export function AdminSidebar() {
  const router = useRouterState();
  const currentPath = router.location.pathname;
  const { settings } = useSettings();
  const siteName = settings?.siteName || "NebulaLabs";

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Projects', path: '/admin/projects', icon: Code },
    { name: 'Content', path: '/admin/content', icon: FileText },
    { name: 'Messages', path: '/admin/messages/inbox', icon: MessageSquare },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="flex h-full w-64 flex-col border-r border-glass-border bg-background/50 backdrop-blur-xl">
      <div className="flex h-16 items-center px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <span className="font-bold">{siteName.charAt(0)}</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-gradient truncate max-w-[120px]">
            {siteName}
          </span>
        </Link>
      </div>

      <div className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const isActive = currentPath === item.path || (item.path !== '/admin' && currentPath.startsWith(item.path));
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-primary/10 text-primary glow-primary border border-primary/20" 
                  : "text-muted-foreground hover:bg-glass hover:text-foreground"
              )}
            >
              <Icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
              {item.name}
            </Link>
          );
        })}
      </div>

      <div className="border-t border-glass-border p-4">
        <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
          <LogOut className="h-5 w-5" />
          Logout
        </Button>
      </div>
    </div>
  );
}
