import type { ReactNode } from 'react';

type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
  action?: ReactNode;
  tone?: 'dark' | 'light';
  align?: 'start' | 'center';
  className?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  tone = 'dark',
  align = 'start',
  className = '',
}: SectionHeaderProps) {
  const isCenter = align === 'center';
  return (
    <div
      className={`flex flex-col gap-6 ${
        isCenter ? 'items-center text-center' : 'md:flex-row md:items-end md:justify-between'
      } ${className}`}
    >
      <div className={`max-w-2xl ${isCenter ? 'flex flex-col items-center' : ''}`}>
        <span className={`eyebrow ${tone === 'light' ? 'text-champagne-300' : ''}`}>{eyebrow}</span>
        <h2 className={`display-2 mt-4 text-balance ${tone === 'light' ? 'text-white' : ''}`}>{title}</h2>
        {description ? (
          <p
            className={`mt-4 text-[15px] leading-8 ${
              tone === 'light' ? 'text-white/70' : 'text-navy-500'
            }`}
          >
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
