import { createFileRoute } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Plus } from 'lucide-react';

export const Route = createFileRoute('/admin/users')({
  component: AdminUsersPage,
});

const usersData = [
  { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active', date: '2023-10-25' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'Editor', status: 'Active', date: '2023-10-26' },
  { id: '3', name: 'Michael Johnson', email: 'michael@example.com', role: 'Viewer', status: 'Inactive', date: '2023-10-27' },
  { id: '4', name: 'Emily Davis', email: 'emily@example.com', role: 'Viewer', status: 'Active', date: '2023-10-28' },
  { id: '5', name: 'William Brown', email: 'william@example.com', role: 'Editor', status: 'Active', date: '2023-10-29' },
];

function AdminUsersPage() {
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
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-glass-border hover:bg-transparent">
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usersData.map((user) => (
                <TableRow key={user.id} className="border-glass-border hover:bg-glass">
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell className="text-muted-foreground">{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <Badge variant={user.status === 'Active' ? 'default' : 'secondary'} className={user.status === 'Active' ? 'bg-primary/20 text-primary border-primary/30' : ''}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{user.date}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
