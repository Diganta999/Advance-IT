import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { User, Mail, Shield, Calendar, LogOut, Settings, Bell, ShieldCheck, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect } from 'react';

export const Route = createFileRoute('/profile')({
  component: ProfilePage,
});

function ProfilePage() {
  const { user, logout, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate({ to: '/login' });
    }
  }, [user, isLoading, navigate]);

  if (isLoading || !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate({ to: '/' });
  };

  const stats = [
    { label: 'Account Status', value: 'Active', icon: ShieldCheck, color: 'text-emerald-400' },
    { label: 'Role', value: user.role.toUpperCase(), icon: Shield, color: 'text-blue-400' },
    { label: 'Joined', value: 'May 2024', icon: Calendar, color: 'text-purple-400' },
  ];

  return (
    <div className="container mx-auto max-w-5xl px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid gap-8 md:grid-cols-[350px_1fr]"
      >
        {/* Profile Sidebar */}
        <div className="space-y-6">
          <Card className="glass relative overflow-hidden border-glass-border">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />
            <CardContent className="pt-10 pb-8 text-center relative z-10">
              <div className="relative mx-auto mb-6 h-32 w-32 rounded-full ring-4 ring-primary/20 ring-offset-4 ring-offset-background overflow-hidden group">
                <img
                  src={user.profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}&backgroundColor=transparent`}
                  alt={user.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100 cursor-pointer">
                  <span className="text-xs font-medium text-white">Change Picture</span>
                </div>
              </div>
              <h2 className="text-2xl font-bold tracking-tight">{user.name}</h2>
              <p className="text-sm text-muted-foreground flex items-center justify-center gap-1.5 mt-1">
                <Mail className="h-3.5 w-3.5" /> {user.email}
              </p>
              
              <div className="mt-8 flex flex-col gap-2">
                <Button variant="outline" className="glass hover:bg-white/10 border-glass-border w-full justify-start gap-2 h-11">
                  <Settings className="h-4 w-4" /> Edit Profile
                </Button>
                <Button variant="outline" className="glass hover:bg-white/10 border-glass-border w-full justify-start gap-2 h-11">
                  <Bell className="h-4 w-4" /> Notifications
                </Button>
                <Button 
                  variant="destructive" 
                  className="w-full justify-start gap-2 h-11 mt-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/20"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" /> Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            {stats.map((stat) => (
              <Card key={stat.label} className="glass border-glass-border">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className={`rounded-xl bg-white/5 p-2.5 ${stat.color}`}>
                      <stat.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
                      <p className="text-lg font-bold">{stat.value}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="glass border-glass-border overflow-hidden">
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>View and manage your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                  <div className="flex items-center gap-2 rounded-xl border border-glass-border bg-white/5 px-4 py-3">
                    <User className="h-4 w-4 text-primary" />
                    <span className="font-medium">{user.name}</span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <p className="text-sm font-medium text-muted-foreground">Email Address</p>
                  <div className="flex items-center gap-2 rounded-xl border border-glass-border bg-white/5 px-4 py-3">
                    <Mail className="h-4 w-4 text-primary" />
                    <span className="font-medium">{user.email}</span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <p className="text-sm font-medium text-muted-foreground">Account Role</p>
                  <div className="flex items-center gap-2 rounded-xl border border-glass-border bg-white/5 px-4 py-3">
                    <Shield className="h-4 w-4 text-primary" />
                    <span className="font-medium capitalize">{user.role}</span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <p className="text-sm font-medium text-muted-foreground">User ID</p>
                  <div className="flex items-center gap-2 rounded-xl border border-glass-border bg-white/5 px-4 py-3">
                    <span className="font-mono text-xs text-muted-foreground">{user._id}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Security Settings</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-2xl border border-glass-border bg-white/5 p-4 transition-colors hover:bg-white/10">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-blue-500/10 p-2 text-blue-400">
                        <Lock className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">Change Password</p>
                        <p className="text-xs text-muted-foreground">Update your password to keep your account secure</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="hover:bg-white/10">Update</Button>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl border border-glass-border bg-white/5 p-4 transition-colors hover:bg-white/10">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-purple-500/10 p-2 text-purple-400">
                        <ShieldCheck className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">Two-Factor Authentication</p>
                        <p className="text-xs text-muted-foreground">Add an extra layer of security to your account</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="hover:bg-white/10">Enable</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
