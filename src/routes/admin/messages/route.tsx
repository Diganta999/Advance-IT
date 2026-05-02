import { createFileRoute, Link, Outlet, useLocation } from '@tanstack/react-router';
import { Mail, Send, Archive, Inbox as InboxIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Route = createFileRoute('/admin/messages')({
  component: MessagesLayout,
});

function MessagesLayout() {
  const { pathname } = useLocation();

  const subNav = [
    { name: 'Inbox', path: '/admin/messages/inbox', icon: InboxIcon },
    { name: 'Sent', path: '/admin/messages/sent', icon: Send },
  ];

  return (
    <div className="flex flex-col gap-8 animate-fade-up">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-gradient">Messages</h2>
        <p className="text-muted-foreground mt-2">Manage your communication with potential clients.</p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Sub Sidebar */}
        <div className="w-full lg:w-64 space-y-2">
          {subNav.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                  isActive 
                    ? "bg-primary/20 text-primary border border-primary/30" 
                    : "glass text-muted-foreground hover:bg-glass hover:text-foreground border border-transparent"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
