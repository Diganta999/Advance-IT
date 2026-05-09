import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

export const Route = createFileRoute('/admin/projects')({
  component: AdminProjectsPage,
});

const CATEGORIES = ["Web", "Mobile", "AI", "SaaS", "Fintech"];
const GRADIENTS = [
  { label: "Purple Blue", value: "linear-gradient(135deg, oklch(0.55 0.25 280), oklch(0.70 0.20 200))" },
  { label: "Pink Purple", value: "linear-gradient(135deg, oklch(0.65 0.24 305), oklch(0.55 0.22 250))" },
  { label: "Cyan Blue", value: "linear-gradient(135deg, oklch(0.50 0.25 295), oklch(0.65 0.20 220))" },
  { label: "Red Pink", value: "linear-gradient(135deg, oklch(0.70 0.20 265), oklch(0.82 0.16 200))" },
];

function AdminProjectsPage() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '', cat: 'Web', tag: '', h: 'h-72', grad: GRADIENTS[0].value
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const res = await fetch('https://advance-it-backend.onrender.com/api/projects');
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    }
  });

  const createProject = useMutation({
    mutationFn: async (newProject) => {
      const res = await fetch('https://advance-it-backend.onrender.com/api/projects', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify(newProject)
      });
      if (!res.ok) throw new Error('Failed to create');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project added successfully!');
      setFormData({ name: '', cat: 'Web', tag: '', h: 'h-72', grad: GRADIENTS[0].value });
      setImageFile(null);
      setImagePreview(null);
      // Reset the file input manually
      const fileInput = document.getElementById('img') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    },
    onError: (err) => {
      toast.error('Failed to add project');
    }
  });

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.tag || !imageFile) {
      toast.error('Please fill all required fields and select an image');
      return;
    }

    try {
      setIsUploading(true);
      toast.info('Uploading image...', { duration: 2000 });
      
      const imgData = new FormData();
      imgData.append('image', imageFile);
      
      const imgbbRes = await fetch(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`, {
        method: 'POST',
        body: imgData,
      });
      
      const imgbbData = await imgbbRes.json();
      
      if (!imgbbData.success) {
        throw new Error('Failed to upload image to ImgBB');
      }

      const imageUrl = imgbbData.data.display_url;

      createProject.mutate({
        ...formData,
        img: imageUrl
      });
      
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 animate-fade-up">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-gradient">Projects Management</h2>
        <p className="text-muted-foreground mt-2">Add dynamic projects to your showcase portfolio.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* ADD PROJECT FORM */}
        <Card className="glass lg:col-span-1">
          <CardHeader>
            <CardTitle>Add New Project</CardTitle>
            <CardDescription>Fill out the details to create a new showcase card.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Project Name</Label>
                <Input 
                  id="name" 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                  placeholder="e.g. Apollo App" 
                  className="bg-background/50 border-glass-border" 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tag">Short Tagline</Label>
                <Input 
                  id="tag" 
                  value={formData.tag} 
                  onChange={e => setFormData({...formData, tag: e.target.value})} 
                  placeholder="e.g. Next-gen trading platform" 
                  className="bg-background/50 border-glass-border" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cat">Category</Label>
                  <select 
                    id="cat" 
                    value={formData.cat} 
                    onChange={e => setFormData({...formData, cat: e.target.value})}
                    className="flex h-9 w-full items-center justify-between rounded-md border border-glass-border bg-background/50 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c} className="bg-background">{c}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="h">Card Height</Label>
                  <select 
                    id="h" 
                    value={formData.h} 
                    onChange={e => setFormData({...formData, h: e.target.value})}
                    className="flex h-9 w-full items-center justify-between rounded-md border border-glass-border bg-background/50 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="h-72" className="bg-background">Standard (h-72)</option>
                    <option value="h-80" className="bg-background">Medium (h-80)</option>
                    <option value="h-96" className="bg-background">Tall (h-96)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="grad">Color Gradient</Label>
                <select 
                  id="grad" 
                  value={formData.grad} 
                  onChange={e => setFormData({...formData, grad: e.target.value})}
                  className="flex h-9 w-full items-center justify-between rounded-md border border-glass-border bg-background/50 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {GRADIENTS.map(g => <option key={g.label} value={g.value} className="bg-background">{g.label}</option>)}
                </select>
              </div>

              <div className="space-y-3">
                <Label htmlFor="img">Project Image</Label>
                <Input 
                  id="img" 
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="bg-background/50 border-glass-border cursor-pointer file:text-primary file:font-semibold file:bg-primary/10 file:border-0 file:rounded-md file:px-3 file:py-1 hover:file:bg-primary/20" 
                />
                {imagePreview ? (
                  <div className="relative mt-2 rounded-xl overflow-hidden border border-glass-border aspect-video w-full">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="relative mt-2 rounded-xl border border-dashed border-glass-border aspect-video w-full flex flex-col items-center justify-center text-muted-foreground bg-background/20">
                    <ImageIcon className="h-8 w-8 mb-2 opacity-50" />
                    <p className="text-xs">No image selected</p>
                  </div>
                )}
              </div>

              <Button type="submit" disabled={createProject.isPending || isUploading} className="w-full bg-primary text-primary-foreground glow-primary mt-6">
                {createProject.isPending || isUploading ? 'Processing...' : <><Plus className="mr-2 h-4 w-4" /> Create Project</>}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* PROJECTS TABLE */}
        <Card className="glass lg:col-span-2">
          <CardHeader>
            <CardTitle>Dynamic Database Projects</CardTitle>
            <CardDescription>These projects are fetched directly from MongoDB.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex h-40 items-center justify-center">Loading...</div>
            ) : projects.length === 0 ? (
              <div className="flex flex-col h-40 items-center justify-center text-muted-foreground border border-dashed border-glass-border rounded-xl">
                <p>No dynamic projects found.</p>
                <p className="text-sm">Add one using the form.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-glass-border hover:bg-transparent">
                    <TableHead>Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Tag</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projects.map((p: any) => (
                    <TableRow key={p._id} className="border-glass-border hover:bg-glass">
                      <TableCell>
                        <div className="h-10 w-16 overflow-hidden rounded-md border border-glass-border">
                          <img src={p.img} alt={p.name} className="h-full w-full object-cover" />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{p.name}</TableCell>
                      <TableCell>{p.cat}</TableCell>
                      <TableCell className="text-muted-foreground">{p.tag}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
