import { Outlet, createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AmbientBackground } from '@/components/site/Background';

export const Route = createFileRoute('/admin')({
  component: AdminLayout,
});

function AdminLayout() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        navigate({ to: '/login' });
      } else if (user.role !== 'admin' && user.role !== 'moderator') {
        navigate({ to: '/' });
        toast.error('You do not have permission to access the admin panel');
      }
    }
  }, [user, isLoading, navigate]);

  if (isLoading || !user) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <div className="relative flex min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground">
      <AmbientBackground />
      
      {/* Sidebar Overlay */}
      <div className="z-40 hidden md:block">
        <AdminSidebar />
      </div>

      <div className="flex flex-1 flex-col z-10">
        <AdminHeader />
        
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="mx-auto max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
