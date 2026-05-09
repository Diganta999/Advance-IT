import { Link, useRouterState, useNavigate } from '@tanstack/react-router';
import { LayoutDashboard, Users, Settings, LogOut, Code, FileText, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useSettings } from '@/context/SettingsContext';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function AdminSidebar() {
  const router = useRouterState();
  const currentPath = router.location.pathname;
  const { settings } = useSettings();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const siteName = settings?.siteName || "NebulaLabs";
  const [unreadCount, setUnreadCount] = useState(0);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    logout();
    navigate({ to: '/' });
  };

  useEffect(() => {
    // Fetch unread messages count
    const fetchUnreadCount = async () => {
      try {
        if (!user?.token) return;
        const response = await fetch('http://localhost:5000/api/messages/unread-count', {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        });
        const data = await response.json();
        if (data.count !== undefined) {
          setUnreadCount(data.count);
        }
      } catch (err) {
        console.error('Failed to fetch unread count', err);
      }
    };

    fetchUnreadCount();
    // Refresh count every 15 seconds
    const intervalId = setInterval(fetchUnreadCount, 15000);
    return () => clearInterval(intervalId);
  }, [user]);

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Projects', path: '/admin/projects', icon: Code },
    { name: 'Content', path: '/admin/content', icon: FileText },
    { name: 'Messages', path: '/admin/messages/inbox', icon: MessageSquare, badge: unreadCount },
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
                "group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-primary/10 text-primary glow-primary border border-primary/20" 
                  : "text-muted-foreground hover:bg-glass hover:text-foreground"
              )}
            >
              <div className="flex items-center gap-3"><Icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />{item.name}</div>{item.badge !== undefined && item.badge > 0 && (<div className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-bold text-white shadow-sm">{item.badge}</div>)}
            </Link>
          );
        })}
      </div>

      <div className="border-t border-glass-border p-4">
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-3 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          onClick={() => setShowLogoutConfirm(true)}
        >
          <LogOut className="h-5 w-5" />
          Logout
        </Button>
      </div>

      <AlertDialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <AlertDialogContent className="glass-strong border-glass-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to sign out?</AlertDialogTitle>
            <AlertDialogDescription>
              You will need to log back in to access the admin dashboard.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/5 border-white/10 hover:bg-white/10">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white">Sign Out</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
