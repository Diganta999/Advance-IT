import { createFileRoute } from '@tanstack/react-router';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { Loader2, Save, Layout, Briefcase, Users, BarChart3, Plus, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useContent } from '@/context/ContentContext';

export const Route = createFileRoute('/admin/content')({
  component: AdminContentPage,
});

interface HeroContent {
  badge: string;
  title: string;
  description: string;
  ctaPrimary: string;
  ctaSecondary: string;
}
interface Service { icon: string; title: string; description: string; }
interface TeamMember { name: string; role: string; imageUrl: string; }
interface Stat { value: string; label: string; }
interface ContentData {
  hero: HeroContent;
  services: Service[];
  team: TeamMember[];
  stats: Stat[];
}

function AdminContentPage() {
  const { user } = useAuth();
  const { refreshContent } = useContent();
  const [content, setContent] = useState<ContentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch('https://advance-it-backend.onrender.com/api/content');
        const data = await res.json();
        if (res.ok) setContent(data);
      } catch (err) {
        toast.error('Failed to load content');
      } finally {
        setIsLoading(false);
      }
    };
    fetchContent();
  }, []);

  const handleSave = async () => {
    if (!user?.token || !content) return;
    setIsSaving(true);
    try {
      console.log('Saving content:', JSON.stringify(content, null, 2));
      const res = await fetch('https://advance-it-backend.onrender.com/api/content', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify(content),
      });
      const data = await res.json();
      if (res.ok) {
        setContent(data);
        await refreshContent();
        toast.success('Content updated successfully!');
      } else {
        throw new Error(data.message);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to save content');
    } finally {
      setIsSaving(false);
    }
  };

  const updateService = (i: number, field: keyof Service, value: string) => {
    if (!content || !content.services) return;
    const updated = [...content.services];
    updated[i] = { ...updated[i], [field]: value };
    setContent({ ...content, services: updated });
  };

  const addService = () => {
    if (!content) return;
    console.log('Adding new service card...');
    const currentServices = content.services || [];
    const newService = { icon: 'Code2', title: '', description: '' };
    setContent({ 
      ...content, 
      services: [...currentServices, newService] 
    });
  };

  const removeService = async (i: number) => {
    if (!content || !content.services || !user?.token) return;
    
    // Eagerly remove from UI
    setContent({ 
      ...content, 
      services: content.services.filter((_, idx) => idx !== i) 
    });

    try {
      const res = await fetch(`https://advance-it-backend.onrender.com/api/content/service/${i}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${user.token}` },
      });
      if (res.ok) {
        toast.success("Service deleted");
      } else {
        const data = await res.json();
        console.warn("Backend delete skipped:", data.message);
      }
    } catch (err: any) {
      console.warn("Backend request failed:", err.message);
    }
  };

  const updateTeam = (i: number, field: keyof TeamMember, value: string) => {
    if (!content) return;
    const updated = [...(content.team || [])];
    updated[i] = { ...updated[i], [field]: value };
    setContent({ ...content, team: updated });
  };

  const addTeam = () => {
    if (!content) return;
    setContent({ ...content, team: [...(content.team || []), { name: '', role: '', imageUrl: '' }] });
  };

  const removeTeam = async (i: number) => {
    if (!content || !content.team || !user?.token) return;
    
    // Eagerly remove from UI
    setContent({ 
      ...content, 
      team: content.team.filter((_, idx) => idx !== i) 
    });

    try {
      const res = await fetch(`https://advance-it-backend.onrender.com/api/content/team/${i}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${user.token}` },
      });
      if (res.ok) {
        toast.success("Team member deleted");
      } else {
        const data = await res.json();
        console.warn("Backend delete skipped:", data.message);
      }
    } catch (err: any) {
      console.warn("Backend request failed:", err.message);
    }
  };

  const updateStat = (i: number, field: keyof Stat, value: string) => {
    if (!content) return;
    const updated = [...(content.stats || [])];
    updated[i] = { ...updated[i], [field]: value };
    setContent({ ...content, stats: updated });
  };

  const addStat = () => {
    if (!content) return;
    setContent({ ...content, stats: [...(content.stats || []), { value: '', label: '' }] });
  };

  const removeStat = async (i: number) => {
    if (!content || !content.stats || !user?.token) return;

    // Eagerly remove from UI
    setContent({ 
      ...content, 
      stats: content.stats.filter((_, idx) => idx !== i) 
    });

    try {
      const res = await fetch(`https://advance-it-backend.onrender.com/api/content/stat/${i}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${user.token}` },
      });
      if (res.ok) {
        toast.success("Statistic deleted");
      } else {
        const data = await res.json();
        console.warn("Backend delete skipped:", data.message);
      }
    } catch (err: any) {
      console.warn("Backend request failed:", err.message);
    }
  };

  if (isLoading || !content) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 animate-fade-up">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gradient">Content Manager</h2>
          <p className="text-muted-foreground mt-2">Edit your website's content directly from here.</p>
        </div>
        <Button
          disabled={isSaving}
          onClick={handleSave}
          className="gap-2 bg-primary text-primary-foreground h-11 px-6 shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]"
        >
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="hero" className="w-full">
        <TabsList className="glass mb-8 p-1 w-full sm:w-auto overflow-x-auto justify-start">
          <TabsTrigger value="hero" className="gap-2 px-5"><Layout className="h-4 w-4" /> Hero</TabsTrigger>
          <TabsTrigger value="services" className="gap-2 px-5"><Briefcase className="h-4 w-4" /> Services</TabsTrigger>
          <TabsTrigger value="team" className="gap-2 px-5"><Users className="h-4 w-4" /> Team</TabsTrigger>
          <TabsTrigger value="stats" className="gap-2 px-5"><BarChart3 className="h-4 w-4" /> Stats</TabsTrigger>
        </TabsList>

        {/* HERO */}
        <TabsContent value="hero">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="glass border-glass-border">
              <CardHeader>
                <CardTitle>Hero Section</CardTitle>
                <CardDescription>The first thing visitors see on your homepage.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <Label>Badge Text</Label>
                  <Input value={content.hero.badge || ''} onChange={e => setContent({ ...content, hero: { ...content.hero, badge: e.target.value } })}
                    className="bg-white/5 border-glass-border" placeholder="Now booking Q3 engagements" />
                </div>
                <div className="space-y-2">
                  <Label>Main Title</Label>
                  <Input value={content.hero.title || ''} onChange={e => setContent({ ...content, hero: { ...content.hero, title: e.target.value } })}
                    className="bg-white/5 border-glass-border" placeholder="Software that feels like the future." />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea rows={3} value={content.hero.description || ''} onChange={e => setContent({ ...content, hero: { ...content.hero, description: e.target.value } })}
                    className="bg-white/5 border-glass-border" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Primary CTA Button</Label>
                    <Input value={content.hero.ctaPrimary || ''} onChange={e => setContent({ ...content, hero: { ...content.hero, ctaPrimary: e.target.value } })}
                      className="bg-white/5 border-glass-border" placeholder="Start a project" />
                  </div>
                  <div className="space-y-2">
                    <Label>Secondary CTA Button</Label>
                    <Input value={content.hero.ctaSecondary || ''} onChange={e => setContent({ ...content, hero: { ...content.hero, ctaSecondary: e.target.value } })}
                      className="bg-white/5 border-glass-border" placeholder="See our work" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* SERVICES */}
        <TabsContent value="services">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            {(content.services || []).map((svc, i) => (
              <Card key={i} className="glass border-glass-border overflow-hidden">
                <div className="bg-primary/10 px-4 py-2 border-b border-glass-border flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">Service #{i + 1}</span>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-400 hover:bg-red-400/10 h-7 px-2 text-xs">
                        <Trash2 className="h-3 w-3 mr-1" /> Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="glass border-glass-border">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete this service?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will immediately remove the service card from the website.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-white/5 border-glass-border hover:bg-white/10 text-foreground">Cancel</AlertDialogCancel>
                        <AlertDialogAction className="bg-red-500/80 text-white hover:bg-red-500" onClick={() => removeService(i)}>Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
                <CardContent className="grid gap-4 sm:grid-cols-2 pt-4">
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input value={svc.title || ''} onChange={e => updateService(i, 'title', e.target.value)} className="bg-white/5 border-glass-border" />
                  </div>
                  <div className="space-y-2">
                    <Label>Icon (Lucide name)</Label>
                    <Input value={svc.icon || ''} onChange={e => updateService(i, 'icon', e.target.value)} className="bg-white/5 border-glass-border" placeholder="Code2" />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label>Description</Label>
                    <Textarea rows={2} value={svc.description || ''} onChange={e => updateService(i, 'description', e.target.value)} className="bg-white/5 border-glass-border" />
                  </div>
                </CardContent>
              </Card>
            ))}
            <Button variant="outline" className="w-full gap-2 border-dashed border-glass-border hover:bg-white/5" onClick={addService}>
              <Plus className="h-4 w-4" /> Add Service
            </Button>
          </motion.div>
        </TabsContent>

        {/* TEAM */}
        <TabsContent value="team">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            {(content.team || []).map((member, i) => (
              <Card key={i} className="glass border-glass-border">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <div className="flex items-center gap-3">
                    {member.imageUrl && (
                      <img src={member.imageUrl} alt={member.name} className="h-10 w-10 rounded-full object-cover border border-glass-border" />
                    )}
                    <CardTitle className="text-base">{member.name || `Team Member #${i + 1}`}</CardTitle>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-400 hover:bg-red-400/10 h-8 w-8">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="glass border-glass-border">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete team member?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will immediately remove the team member from the website.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-white/5 border-glass-border hover:bg-white/10 text-foreground">Cancel</AlertDialogCancel>
                        <AlertDialogAction className="bg-red-500/80 text-white hover:bg-red-500" onClick={() => removeTeam(i)}>Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input value={member.name} onChange={e => updateTeam(i, 'name', e.target.value)} className="bg-white/5 border-glass-border" />
                  </div>
                  <div className="space-y-2">
                    <Label>Role</Label>
                    <Input value={member.role} onChange={e => updateTeam(i, 'role', e.target.value)} className="bg-white/5 border-glass-border" />
                  </div>
                  <div className="space-y-2">
                    <Label>Image URL or Path</Label>
                    <Input value={member.imageUrl} onChange={e => updateTeam(i, 'imageUrl', e.target.value)} className="bg-white/5 border-glass-border" placeholder="/team/anya.png" />
                  </div>
                </CardContent>
              </Card>
            ))}
            <Button variant="outline" className="w-full gap-2 border-dashed border-glass-border hover:bg-white/5" onClick={addTeam}>
              <Plus className="h-4 w-4" /> Add Team Member
            </Button>
          </motion.div>
        </TabsContent>

        {/* STATS */}
        <TabsContent value="stats">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <Card className="glass border-glass-border">
              <CardHeader>
                <CardTitle>Homepage Stats</CardTitle>
                <CardDescription>The key numbers displayed on your homepage.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                {(content.stats || []).map((stat, i) => (
                  <div key={i} className="flex flex-col gap-3 p-4 rounded-xl bg-white/5 border border-glass-border relative group">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="absolute top-2 right-2 h-7 w-7 text-red-400 hover:text-red-400 hover:bg-red-400/10 opacity-0 group-hover:opacity-100 transition-opacity" 
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="glass border-glass-border">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete this stat?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will immediately remove the stat from the website.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="bg-white/5 border-glass-border hover:bg-white/10 text-foreground">Cancel</AlertDialogCancel>
                          <AlertDialogAction className="bg-red-500/80 text-white hover:bg-red-500" onClick={() => removeStat(i)}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    <div className="flex-1 space-y-2 mt-2">
                      <Label>Value</Label>
                      <Input value={stat.value} onChange={e => updateStat(i, 'value', e.target.value)} className="bg-white/5 border-glass-border font-bold" placeholder="240+" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label>Label</Label>
                      <Input value={stat.label} onChange={e => updateStat(i, 'label', e.target.value)} className="bg-white/5 border-glass-border" placeholder="Products shipped" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Button variant="outline" className="w-full gap-2 border-dashed border-glass-border hover:bg-white/5" onClick={addStat}>
              <Plus className="h-4 w-4" /> Add Stat
            </Button>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
