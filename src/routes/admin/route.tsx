import { Outlet, createFileRoute } from '@tanstack/react-router';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AmbientBackground } from '@/components/site/Background';

export const Route = createFileRoute('/admin')({
  component: AdminLayout,
});

function AdminLayout() {
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
