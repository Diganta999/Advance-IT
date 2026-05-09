import React, { createContext, useContext, useState, useEffect } from 'react';

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

export interface SiteContent {
  hero: HeroContent;
  services: Service[];
  team: TeamMember[];
  stats: Stat[];
}

interface ContentContextType {
  content: SiteContent | null;
  refreshContent: () => Promise<void>;
  isLoading: boolean;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchContent = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/content');
      const data = await res.json();
      if (res.ok) setContent(data);
    } catch (error) {
      console.error('Failed to fetch content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  return (
    <ContentContext.Provider value={{ content, refreshContent: fetchContent, isLoading }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
}
