import { createFileRoute } from '@tanstack/react-router';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Globe, Shield, Share2, Save, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings } from '@/context/SettingsContext';

export const Route = createFileRoute('/admin/settings')({
  component: AdminSettingsPage,
});

interface SiteSettings {
  _id?: string;
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  maintenanceMode: boolean;
  socialLinks: {
    twitter: string;
    github: string;
    linkedin: string;
    instagram: string;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
}

function AdminSettingsPage() {
  const { user } = useAuth();
  const { refreshSettings } = useSettings();
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/settings');
        const data = await res.json();
        if (res.ok) {
          // Ensure nested objects exist
          setSettings({
            ...data,
            socialLinks: data.socialLinks || { twitter: '', github: '', linkedin: '', instagram: '' },
            seo: data.seo || { metaTitle: '', metaDescription: '', keywords: [] }
          });
        }
      } catch (err) {
        toast.error('Failed to load settings');
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!user?.token || !settings) return;

    setIsSaving(true);
    const promise = new Promise(async (resolve, reject) => {
      try {
        const res = await fetch('http://localhost:5000/api/settings', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`,
          },
          body: JSON.stringify(settings),
        });

        const data = await res.json();
        if (res.ok) {
          setSettings(data);
          await refreshSettings();
          resolve(data);
        } else {
          reject(new Error(data.message || 'Failed to update settings'));
        }
      } catch (err) {
        reject(err);
      } finally {
        setIsSaving(false);
      }
    });

    toast.promise(promise, {
      loading: 'Saving changes...',
      success: 'Settings updated successfully!',
      error: (err) => err.message || 'Error saving settings',
    });
  };

  if (isLoading || !settings) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground animate-pulse">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 animate-fade-up">
      <form onSubmit={handleSave} className="space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gradient">Site Settings</h2>
            <p className="text-muted-foreground mt-2">Configure your global website preferences and SEO.</p>
          </div>
          <Button 
            type="submit"
            disabled={isSaving}
            className="gap-2 glow-primary bg-primary text-primary-foreground h-11 px-6 shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]"
          >
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Changes
          </Button>
        </div>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="glass mb-8 p-1 w-full sm:w-auto overflow-x-auto justify-start">
            <TabsTrigger value="general" className="gap-2 px-6">
              <Globe className="h-4 w-4" /> General
            </TabsTrigger>
            <TabsTrigger value="seo" className="gap-2 px-6">
              <Shield className="h-4 w-4" /> SEO
            </TabsTrigger>
            <TabsTrigger value="social" className="gap-2 px-6">
              <Share2 className="h-4 w-4" /> Social
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <TabsContent value="general" className="space-y-6 outline-none">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <Card className="glass border-glass-border">
                  <CardHeader>
                    <CardTitle>General Information</CardTitle>
                    <CardDescription>Basic site identity and operational status.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="siteName">Site Name</Label>
                        <Input 
                          id="siteName" 
                          placeholder="e.g. NebulaLabs"
                          value={settings.siteName} 
                          onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                          className="bg-white/5 border-glass-border focus:bg-white/10 transition-colors"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contactEmail">Contact Email</Label>
                        <Input 
                          id="contactEmail" 
                          type="email"
                          placeholder="e.g. contact@example.com"
                          value={settings.contactEmail} 
                          onChange={(e) => setSettings({...settings, contactEmail: e.target.value})}
                          className="bg-white/5 border-glass-border focus:bg-white/10 transition-colors"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="siteDescription">Site Description</Label>
                      <Input 
                        id="siteDescription" 
                        placeholder="A short description of your site"
                        value={settings.siteDescription} 
                        onChange={(e) => setSettings({...settings, siteDescription: e.target.value})}
                        className="bg-white/5 border-glass-border focus:bg-white/10 transition-colors"
                      />
                    </div>
                    <div className="flex items-center justify-between rounded-2xl border border-glass-border bg-white/5 p-5 transition-colors hover:bg-white/10">
                      <div className="space-y-1">
                        <Label className="text-base font-semibold">Maintenance Mode</Label>
                        <p className="text-sm text-muted-foreground">
                          Toggle this to put your site offline for visitors.
                        </p>
                      </div>
                      <Switch 
                        checked={settings.maintenanceMode}
                        onCheckedChange={(checked) => setSettings({...settings, maintenanceMode: checked})}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="seo" className="space-y-6 outline-none">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <Card className="glass border-glass-border">
                  <CardHeader>
                    <CardTitle>SEO Configuration</CardTitle>
                    <CardDescription>Optimize how your site appears in search results.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="metaTitle">Meta Title</Label>
                      <Input 
                        id="metaTitle" 
                        placeholder="Search engine title"
                        value={settings.seo.metaTitle || ''} 
                        onChange={(e) => setSettings({
                          ...settings, 
                          seo: {...settings.seo, metaTitle: e.target.value}
                        })}
                        className="bg-white/5 border-glass-border focus:bg-white/10 transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="metaDescription">Meta Description</Label>
                      <Input 
                        id="metaDescription" 
                        placeholder="Search engine description"
                        value={settings.seo.metaDescription || ''} 
                        onChange={(e) => setSettings({
                          ...settings, 
                          seo: {...settings.seo, metaDescription: e.target.value}
                        })}
                        className="bg-white/5 border-glass-border focus:bg-white/10 transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="keywords">Keywords</Label>
                      <Input 
                        id="keywords" 
                        placeholder="Comma-separated keywords (e.g. tech, design, ai)"
                        value={settings.seo.keywords?.join(', ') || ''} 
                        onChange={(e) => setSettings({
                          ...settings, 
                          seo: {...settings.seo, keywords: e.target.value.split(',').map(k => k.trim())}
                        })}
                        className="bg-white/5 border-glass-border focus:bg-white/10 transition-colors"
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="social" className="space-y-6 outline-none">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <Card className="glass border-glass-border">
                  <CardHeader>
                    <CardTitle>Social Presence</CardTitle>
                    <CardDescription>Connect with your audience across platforms.</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="twitter">Twitter / X URL</Label>
                      <Input 
                        id="twitter" 
                        placeholder="https://twitter.com/..."
                        value={settings.socialLinks?.twitter || ''} 
                        onChange={(e) => setSettings({
                          ...settings, 
                          socialLinks: {...settings.socialLinks, twitter: e.target.value}
                        })}
                        className="bg-white/5 border-glass-border focus:bg-white/10 transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="github">GitHub URL</Label>
                      <Input 
                        id="github" 
                        placeholder="https://github.com/..."
                        value={settings.socialLinks?.github || ''} 
                        onChange={(e) => setSettings({
                          ...settings, 
                          socialLinks: {...settings.socialLinks, github: e.target.value}
                        })}
                        className="bg-white/5 border-glass-border focus:bg-white/10 transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="linkedin">LinkedIn URL</Label>
                      <Input 
                        id="linkedin" 
                        placeholder="https://linkedin.com/in/..."
                        value={settings.socialLinks?.linkedin || ''} 
                        onChange={(e) => setSettings({
                          ...settings, 
                          socialLinks: {...settings.socialLinks, linkedin: e.target.value}
                        })}
                        className="bg-white/5 border-glass-border focus:bg-white/10 transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="instagram">Instagram URL</Label>
                      <Input 
                        id="instagram" 
                        placeholder="https://instagram.com/..."
                        value={settings.socialLinks?.instagram || ''} 
                        onChange={(e) => setSettings({
                          ...settings, 
                          socialLinks: {...settings.socialLinks, instagram: e.target.value}
                        })}
                        className="bg-white/5 border-glass-border focus:bg-white/10 transition-colors"
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </form>
    </div>
  );
}
