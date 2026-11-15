import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon } from '../icons';

type Crumb = { label: string; to?: string };

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description?: string;
  crumbs: Crumb[];
  children?: ReactNode;
};

export function PageHero({ eyebrow, title, description, crumbs, children }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-navy-950 pb-16 pt-32 text-white lg:pb-20 lg:pt-40">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_0%,rgba(194,161,115,0.18),transparent_55%)]" />
      <div className="shell relative">
        <nav aria-label="مسیر صفحه" className="flex flex-wrap items-center gap-1.5 text-[11px] text-white/45">
          {crumbs.map((crumb, index) => (
            <span key={`${crumb.label}-${index}`} className="flex items-center gap-1.5">
              {crumb.to ? (
                <Link to={crumb.to} className="transition hover:text-white">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-white/75">{crumb.label}</span>
              )}
              {index < crumbs.length - 1 ? <ChevronLeftIcon className="h-3 w-3" /> : null}
            </span>
          ))}
        </nav>

        <span className="eyebrow mt-8 text-champagne-300">{eyebrow}</span>
        <h1 className="mt-4 max-w-3xl text-[1.9rem] font-bold leading-[1.35] tracking-tight text-balance sm:text-4xl lg:text-[2.9rem]">
          {title}
        </h1>
        {description ? (
          <p className="mt-5 max-w-2xl text-[13.5px] leading-8 text-white/60">{description}</p>
        ) : null}
        {children}
      </div>
    </section>
  );
}
