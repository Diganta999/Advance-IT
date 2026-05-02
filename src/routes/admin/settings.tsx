import { createFileRoute } from '@tanstack/react-router';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Settings as SettingsIcon, Globe, Shield, Share2, Save, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const Route = createFileRoute('/admin/settings')({
  component: AdminSettingsPage,
});

interface SiteSettings {
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
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/settings');
        const data = await res.json();
        if (res.ok) setSettings(data);
      } catch (err) {
        toast.error('Failed to load settings');
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.token) return;

    setIsSaving(true);
    try {
      const res = await fetch('http://localhost:5000/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        toast.success('Settings updated successfully');
      } else {
        throw new Error('Failed to update settings');
      }
    } catch (err) {
      toast.error('Error saving settings');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !settings) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 animate-fade-up">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gradient">Site Settings</h2>
          <p className="text-muted-foreground mt-2">Configure your global website preferences and SEO.</p>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={isSaving}
          className="gap-2 glow-primary bg-primary text-primary-foreground"
        >
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="glass mb-8 p-1">
          <TabsTrigger value="general" className="gap-2">
            <Globe className="h-4 w-4" /> General
          </TabsTrigger>
          <TabsTrigger value="seo" className="gap-2">
            <Shield className="h-4 w-4" /> SEO
          </TabsTrigger>
          <TabsTrigger value="social" className="gap-2">
            <Share2 className="h-4 w-4" /> Social
          </TabsTrigger>
        </TabsList>

        <form onSubmit={handleSave}>
          <TabsContent value="general" className="space-y-6">
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
                      value={settings.siteName} 
                      onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                      className="bg-white/5 border-glass-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Contact Email</Label>
                    <Input 
                      id="contactEmail" 
                      type="email"
                      value={settings.contactEmail} 
                      onChange={(e) => setSettings({...settings, contactEmail: e.target.value})}
                      className="bg-white/5 border-glass-border"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siteDescription">Site Description</Label>
                  <Input 
                    id="siteDescription" 
                    value={settings.siteDescription} 
                    onChange={(e) => setSettings({...settings, siteDescription: e.target.value})}
                    className="bg-white/5 border-glass-border"
                  />
                </div>
                <div className="flex items-center justify-between rounded-xl border border-glass-border bg-white/5 p-4">
                  <div className="space-y-0.5">
                    <Label className="text-base">Maintenance Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable to show a maintenance page to all visitors.
                    </p>
                  </div>
                  <Switch 
                    checked={settings.maintenanceMode}
                    onCheckedChange={(checked) => setSettings({...settings, maintenanceMode: checked})}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="seo" className="space-y-6">
            <Card className="glass border-glass-border">
              <CardHeader>
                <CardTitle>SEO Configuration</CardTitle>
                <CardDescription>Optimize your site for search engines.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="metaTitle">Meta Title</Label>
                  <Input 
                    id="metaTitle" 
                    value={settings.seo.metaTitle || ''} 
                    onChange={(e) => setSettings({
                      ...settings, 
                      seo: {...settings.seo, metaTitle: e.target.value}
                    })}
                    className="bg-white/5 border-glass-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="metaDescription">Meta Description</Label>
                  <Input 
                    id="metaDescription" 
                    value={settings.seo.metaDescription || ''} 
                    onChange={(e) => setSettings({
                      ...settings, 
                      seo: {...settings.seo, metaDescription: e.target.value}
                    })}
                    className="bg-white/5 border-glass-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="keywords">Keywords (comma separated)</Label>
                  <Input 
                    id="keywords" 
                    value={settings.seo.keywords?.join(', ') || ''} 
                    onChange={(e) => setSettings({
                      ...settings, 
                      seo: {...settings.seo, keywords: e.target.value.split(',').map(k => k.trim())}
                    })}
                    className="bg-white/5 border-glass-border"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="social" className="space-y-6">
            <Card className="glass border-glass-border">
              <CardHeader>
                <CardTitle>Social Media Links</CardTitle>
                <CardDescription>Connect your social profiles.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter URL</Label>
                  <Input 
                    id="twitter" 
                    value={settings.socialLinks?.twitter || ''} 
                    onChange={(e) => setSettings({
                      ...settings, 
                      socialLinks: {...settings.socialLinks, twitter: e.target.value}
                    })}
                    className="bg-white/5 border-glass-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="github">GitHub URL</Label>
                  <Input 
                    id="github" 
                    value={settings.socialLinks?.github || ''} 
                    onChange={(e) => setSettings({
                      ...settings, 
                      socialLinks: {...settings.socialLinks, github: e.target.value}
                    })}
                    className="bg-white/5 border-glass-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn URL</Label>
                  <Input 
                    id="linkedin" 
                    value={settings.socialLinks?.linkedin || ''} 
                    onChange={(e) => setSettings({
                      ...settings, 
                      socialLinks: {...settings.socialLinks, linkedin: e.target.value}
                    })}
                    className="bg-white/5 border-glass-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram URL</Label>
                  <Input 
                    id="instagram" 
                    value={settings.socialLinks?.instagram || ''} 
                    onChange={(e) => setSettings({
                      ...settings, 
                      socialLinks: {...settings.socialLinks, instagram: e.target.value}
                    })}
                    className="bg-white/5 border-glass-border"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </form>
      </Tabs>
    </div>
  );
}
