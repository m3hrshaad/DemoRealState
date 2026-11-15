import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { api } from '../lib/api';
import type { Service, Settings, SiteContent, TeamMember } from '../lib/types';
import { Brand } from './Brand';
import { Button } from './ui/Button';

const emptySettings: Settings = {
  brandName: 'آژانس املاک نیاز',
  brandDescriptor: 'مشاور املاک و سرمایه‌گذاری',
  logoUrl: '',
  description: '',
  heroImage: '/images/hero.jpg',
  phone: '',
  mobile: '',
  email: '',
  address: '',
  workingHours: '',
  instagram: '',
  telegram: '',
  whatsapp: '',
  linkedin: '',
  aboutTitle: '',
  aboutDescription: '',
  aboutImageMain: '',
  aboutImageSecondary: '',
  aboutHighlights: [],
  contactTitle: '',
  contactText: '',
  whyTitle: '',
  whyDescription: '',
  whyItems: [],
  ctaTitle: '',
  ctaText: '',
  ctaButton: '',
  footerNote: '',
};

type SiteContextValue = {
  settings: Settings;
  services: Service[];
  team: TeamMember[];
  reload: () => Promise<void>;
};

const SiteContext = createContext<SiteContextValue | null>(null);

export function SiteProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get<SiteContent>('/site');
      setContent(data);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'بارگذاری اطلاعات سایت انجام نشد.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const value = useMemo<SiteContextValue>(
    () => ({
      settings: content?.settings ?? emptySettings,
      services: content?.services ?? [],
      team: content?.team ?? [],
      reload: load,
    }),
    [content, load],
  );

  if (loading && !content) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-navy-900">
        <div className="flex flex-col items-center gap-5 text-white">
          <span className="text-champagne-400">
            <Brand settings={emptySettings} tone="light" layout="mark" />
          </span>
          <span className="h-px w-12 animate-pulse bg-champagne-500/60" />
          <p className="text-xs text-white/60">در حال بارگذاری</p>
        </div>
      </div>
    );
  }

  if (error && !content) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ivory px-6">
        <div className="w-full max-w-md rounded-2xl border border-navy-900/10 bg-white p-8 text-center">
          <p className="text-sm font-medium text-navy-900">اطلاعات سایت بارگذاری نشد.</p>
          <p className="mt-2 text-xs leading-6 text-navy-500">{error}</p>
          <Button className="mt-6" onClick={() => void load()}>
            تلاش دوباره
          </Button>
        </div>
      </div>
    );
  }

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite(): SiteContextValue {
  const context = useContext(SiteContext);
  if (!context) throw new Error('useSite must be used inside SiteProvider');
  return context;
}
