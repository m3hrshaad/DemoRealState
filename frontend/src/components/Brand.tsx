import type { Settings } from '../lib/types';

type BrandProps = {
  settings: Pick<Settings, 'brandName' | 'brandDescriptor' | 'logoUrl'>;
  tone?: 'dark' | 'light';
  layout?: 'full' | 'mark';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

const markSizes = { sm: 'h-8 w-8', md: 'h-10 w-10', lg: 'h-16 w-16' };
const nameSizes = { sm: 'text-[15px]', md: 'text-lg', lg: 'text-2xl' };
const descriptorSizes = { sm: 'text-[9px]', md: 'text-[10px]', lg: 'text-[11px]' };

export function LogoMark({ className = 'h-10 w-10' }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" aria-hidden="true" className={className}>
      <path d="M3.5 36.5V13L20 3l16.5 10v23.5" stroke="currentColor" strokeWidth="1.2" opacity="0.55" />
      <path d="M9.5 33.5V16.8L20 10.3l10.5 6.5v16.7" stroke="currentColor" strokeWidth="1.3" />
      <path d="M15.5 33.5v-9h9v9" stroke="currentColor" strokeWidth="1.3" />
      <path d="M20 10.3v5.6" stroke="currentColor" strokeWidth="1.3" />
      <path d="M3.5 36.5h33" stroke="currentColor" strokeWidth="1.2" opacity="0.55" />
    </svg>
  );
}

export function Brand({ settings, tone = 'dark', layout = 'full', size = 'md', className = '' }: BrandProps) {
  const isLight = tone === 'light';
  return (
    <span className={`inline-flex items-center gap-3 ${className}`} dir="rtl">
      <span className={isLight ? 'text-champagne-400' : 'text-champagne-600'}>
        {settings.logoUrl ? (
          <img
            src={settings.logoUrl}
            alt={settings.brandName}
            className={`${markSizes[size]} rounded-sm object-contain`}
          />
        ) : (
          <LogoMark className={markSizes[size]} />
        )}
      </span>
      {layout === 'full' ? (
        <span className="flex flex-col leading-tight">
          <span
            className={`font-bold tracking-tight ${nameSizes[size]} ${
              isLight ? 'text-white' : 'text-navy-900'
            }`}
          >
            {settings.brandName}
          </span>
          <span
            className={`mt-1 font-medium ${descriptorSizes[size]} ${
              isLight ? 'text-white/60' : 'text-navy-400'
            }`}
          >
            {settings.brandDescriptor}
          </span>
        </span>
      ) : null}
    </span>
  );
}
