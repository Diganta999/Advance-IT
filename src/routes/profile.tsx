import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { User, Mail, Shield, Calendar, LogOut, Settings, Bell, ShieldCheck, Lock, Upload, Save, Loader2, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

export const Route = createFileRoute('/profile')({
  component: ProfilePage,
});

function ProfilePage() {
  const { user, login, logout, isLoading } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    profilePicture: '',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate({ to: '/login' });
    } else if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        profilePicture: user.profilePicture || '',
      });
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      toast.info('Uploading profile picture...', { duration: 2000 });
      
      const imgData = new FormData();
      imgData.append('image', file);
      
      const imgbbRes = await fetch(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`, {
        method: 'POST',
        body: imgData,
      });
      
      const data = await imgbbRes.json();
      
      if (data.success) {
        const imageUrl = data.data.display_url;
        setFormData(prev => ({ ...prev, profilePicture: imageUrl }));
        
        // Automatically save when picture is uploaded
        await handleSaveProfile({ ...formData, profilePicture: imageUrl });
      } else {
        throw new Error('Failed to upload image');
      }
    } catch (err: any) {
      toast.error(err.message || 'Image upload failed');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSaveProfile = async (dataToSave = formData) => {
    if (!user.token) return;
    setIsSaving(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify(dataToSave),
      });

      const updatedUser = await res.json();
      if (!res.ok) throw new Error(updatedUser.message || 'Failed to update profile');

      login(updatedUser);
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (err: any) {
      toast.error(err.message || 'Failed to sync updates');
    } finally {
      setIsSaving(false);
    }
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
              <div 
                className="relative mx-auto mb-6 h-32 w-32 rounded-full ring-4 ring-primary/20 ring-offset-4 ring-offset-background overflow-hidden group cursor-pointer"
                onClick={() => isEditing && fileInputRef.current?.click()}
              >
                {isUploading ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-20">
                    <Loader2 className="h-8 w-8 animate-spin text-white" />
                  </div>
                ) : null}
                <img
                  src={formData.profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}&backgroundColor=transparent`}
                  alt={user.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {isEditing && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100 z-10">
                    <Upload className="h-6 w-6 text-white mb-1" />
                    <span className="text-xs font-medium text-white">Upload</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  disabled={isUploading}
                />
              </div>
              <h2 className="text-2xl font-bold tracking-tight">{user.name}</h2>
              <p className="text-sm text-muted-foreground flex items-center justify-center gap-1.5 mt-1">
                <Mail className="h-3.5 w-3.5" /> {user.email}
              </p>
              
              <div className="mt-8 flex flex-col gap-2">
                <Button 
                  variant={isEditing ? "default" : "outline"} 
                  className={`border-glass-border w-full justify-start gap-2 h-11 ${isEditing ? '' : 'glass hover:bg-white/10'}`}
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <Settings className="h-4 w-4" /> {isEditing ? "Cancel Editing" : "Edit Profile"}
                </Button>
                {isEditing && (
                  <Button 
                    className="w-full justify-start gap-2 h-11 bg-emerald-500 hover:bg-emerald-600 text-white"
                    onClick={() => handleSaveProfile()}
                    disabled={isSaving || isUploading}
                  >
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} 
                    Save Changes
                  </Button>
                )}
                {!isEditing && (
                  <Button variant="outline" className="glass hover:bg-white/10 border-glass-border w-full justify-start gap-2 h-11">
                    <Bell className="h-4 w-4" /> Notifications
                  </Button>
                )}
                <Button 
                  variant="destructive" 
                  className="w-full justify-start gap-2 h-11 mt-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/20"
                  onClick={() => setShowLogoutConfirm(true)}
                >
                  <LogOut className="h-4 w-4" /> Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <AlertDialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
          <AlertDialogContent className="glass-strong border-glass-border">
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to sign out?</AlertDialogTitle>
              <AlertDialogDescription>
                You will need to log back in to access your account dashboard and settings.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-white/5 border-white/10 hover:bg-white/10">Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white">Sign Out</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

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
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <Input 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="bg-white/5 border-glass-border"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 rounded-xl border border-glass-border bg-white/5 px-4 py-3">
                      <User className="h-4 w-4 text-primary" />
                      <span className="font-medium">{user.name}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-1.5">
                  <p className="text-sm font-medium text-muted-foreground">Email Address</p>
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <Input 
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="bg-white/5 border-glass-border"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 rounded-xl border border-glass-border bg-white/5 px-4 py-3">
                      <Mail className="h-4 w-4 text-primary" />
                      <span className="font-medium">{user.email}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-1.5">
                  <p className="text-sm font-medium text-muted-foreground">Phone Number</p>
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <Input 
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="bg-white/5 border-glass-border"
                        placeholder="Add phone number"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 rounded-xl border border-glass-border bg-white/5 px-4 py-3">
                      <Phone className="h-4 w-4 text-primary" />
                      <span className="font-medium">{user.phone || 'Not provided'}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-1.5">
                  <p className="text-sm font-medium text-muted-foreground">Account Role</p>
                  <div className="flex items-center gap-2 rounded-xl border border-glass-border bg-white/5 px-4 py-3 opacity-70">
                    <Shield className="h-4 w-4 text-primary" />
                    <span className="font-medium capitalize">{user.role}</span>
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
