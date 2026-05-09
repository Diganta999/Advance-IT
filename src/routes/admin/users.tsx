import { createFileRoute } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Plus, Loader2, ShieldAlert, UserIcon, Crown } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export const Route = createFileRoute('/admin/users')({
  component: AdminUsersPage,
});

interface UserData {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  profilePicture?: string;
}

function AdminUsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      if (!currentUser?.token) return;
      
      try {
        const res = await fetch('https://advance-it-backend.onrender.com/api/auth/all', {
          headers: {
            'Authorization': `Bearer ${currentUser.token}`
          }
        });
        const data = await res.json();
        
        if (!res.ok) throw new Error(data.message || 'Failed to fetch users');
        
        setUsers(data);
      } catch (err: any) {
        toast.error(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [currentUser]);

  const handleRoleChange = async (userId: string, newRole: string) => {
    if (!currentUser?.token) return;
    try {
      const res = await fetch(`https://advance-it-backend.onrender.com/api/auth/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.token}`
        },
        body: JSON.stringify({ role: newRole })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update role');

      setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
      toast.success(`User role updated to ${newRole}`);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="flex flex-col gap-8 animate-fade-up">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gradient">Users Management</h2>
          <p className="text-muted-foreground mt-2">Manage your team members and their account permissions here.</p>
        </div>
        <Button className="gap-2 bg-primary text-primary-foreground glow-primary">
          <Plus className="h-4 w-4" /> Add User
        </Button>
      </div>

      <Card className="glass">
        <CardHeader>
          <CardTitle>All Users ({users.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-glass-border hover:bg-transparent">
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user._id} className="border-glass-border hover:bg-glass">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <img 
                          src={user.profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}&backgroundColor=transparent`} 
                          alt={user.name}
                          className="h-8 w-8 rounded-full border border-glass-border"
                        />
                        {user.name}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{user.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize border-primary/30 text-primary bg-primary/10">
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="glass border-glass-border min-w-[150px]">
                          <DropdownMenuLabel>Set Role</DropdownMenuLabel>
                          <DropdownMenuSeparator className="bg-glass-border" />
                          <DropdownMenuItem className="focus:bg-primary/20 focus:text-primary cursor-pointer" onClick={() => handleRoleChange(user._id, "admin")}>
                            <Crown className="h-4 w-4 mr-2" /> Admin
                          </DropdownMenuItem>
                          <DropdownMenuItem className="focus:bg-accent/20 focus:text-accent cursor-pointer" onClick={() => handleRoleChange(user._id, "moderator")}>
                            <ShieldAlert className="h-4 w-4 mr-2" /> Moderator
                          </DropdownMenuItem>
                          <DropdownMenuItem className="focus:bg-white/10 cursor-pointer" onClick={() => handleRoleChange(user._id, "user")}>
                            <UserIcon className="h-4 w-4 mr-2" /> User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
