import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSite } from '../components/SiteProvider';
import { Brand } from '../components/Brand';
import { ScrollVideoHero } from '../components/hero/ScrollVideoHero';
import { FeaturedCarousel } from '../components/FeaturedCarousel';
import { PropertyCardSkeleton } from '../components/PropertyCard';
import { ButtonLink } from '../components/ui/Button';
import { Reveal } from '../components/ui/Reveal';
import { SectionHeader } from '../components/ui/SectionHeader';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BuildingIcon,
  CheckIcon,
  CompassIcon,
  KeyIcon,
  ShieldIcon,
} from '../icons';
import { api } from '../lib/api';
import { faIndex } from '../lib/forms';
import { instagramUrl } from '../lib/format';
import type { Property } from '../lib/types';

const whyIcons = [CompassIcon, ShieldIcon, BuildingIcon, KeyIcon];

export function HomePage() {
  const { settings, services, team } = useSite();
  const [featured, setFeatured] = useState<Property[] | null>(null);

  useEffect(() => {
    let active = true;
    api
      .get<{ items: Property[] }>('/properties/featured')
      .then((data) => {
        if (active) setFeatured(data.items);
      })
      .catch(() => {
        if (active) setFeatured([]);
      });
    return () => {
      active = false;
    };
  }, []);

  const whyItems = settings.whyItems ?? [];
  const visibleTeam = team.slice(0, 4);

  return (
    <>
      {/* ---------------------------------------------------------------- hero */}
      <ScrollVideoHero />

      {/* ----------------------------------------------------------- who we are */}
      <section className="overflow-hidden bg-white py-20 lg:py-28">
        <div className="shell grid items-center gap-14 lg:grid-cols-[1.02fr_1fr] lg:gap-20">
          <Reveal>
            <span className="eyebrow">درباره ما</span>
            <h2 className="display-2 mt-4 text-balance">{settings.aboutTitle}</h2>
            <p className="body-text mt-5">{settings.aboutDescription}</p>

            {settings.aboutHighlights.length > 0 ? (
              <ul className="mt-7 space-y-3.5">
                {settings.aboutHighlights.map((highlight) => (
                  <li key={highlight} className="flex items-start gap-3 text-[13.5px] text-navy-700">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-champagne-500/50 text-champagne-600">
                      <CheckIcon className="h-3 w-3" />
                    </span>
                    {highlight}
                  </li>
                ))}
              </ul>
            ) : null}

            <ButtonLink to="/about" variant="outline" className="mt-9">
              بیشتر درباره ما بدانید
              <ArrowLeftIcon className="h-4 w-4" />
            </ButtonLink>
          </Reveal>

          <Reveal delay={120} className="relative pb-10">
            <div className="overflow-hidden rounded-2xl">
              <img
                src={settings.aboutImageMain || '/images/villa-2.jpg'}
                alt="نمای معماری یکی از املاک"
                loading="lazy"
                className="aspect-[4/5] w-full object-cover transition duration-700 hover:scale-[1.03]"
              />
            </div>
            <div className="absolute -bottom-2 left-4 w-36 overflow-hidden rounded-xl border-[6px] border-white shadow-lift sm:left-8 sm:w-48">
              <img
                src={settings.aboutImageSecondary || '/images/interior-1.jpg'}
                alt="فضای داخلی ملک"
                loading="lazy"
                className="aspect-[3/4] w-full object-cover"
              />
            </div>
            <Link
              to="/about"
              aria-label="صفحه درباره ما"
              className="absolute bottom-8 right-5 flex h-14 w-14 items-center justify-center rounded-full border border-white/50 bg-white/90 text-navy-900 backdrop-blur transition hover:bg-champagne-500 hover:text-navy-900"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------------------- featured */}
      <section className="bg-ivory py-20 lg:py-24">
        <div className="shell">
          <SectionHeader
            eyebrow="پیشنهادهای ویژه"
            title="املاک منتخب"
            description="گزیده‌ای از آگهی‌های شاخص، انتخاب‌شده توسط کارشناسان ما."
            action={
              <ButtonLink to="/buy" variant="ghost" size="sm">
                مشاهده همه املاک
                <ArrowLeftIcon className="h-3.5 w-3.5" />
              </ButtonLink>
            }
          />
          <div className="mt-10">
            {featured === null ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <PropertyCardSkeleton />
                <PropertyCardSkeleton />
                <PropertyCardSkeleton />
              </div>
            ) : (
              <FeaturedCarousel properties={featured} />
            )}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- services */}
      {services.length > 0 ? (
        <section className="bg-white py-20 lg:py-28">
          <div className="shell">
            <SectionHeader
              eyebrow="خدمات"
              title="چه کاری برای شما انجام می‌دهیم؟"
              description="از انتخاب و بازدید تا مذاکره و انتقال سند، هر مرحله را با شما پیش می‌بریم."
            />
            <div className="mt-10 grid gap-x-14 md:grid-cols-2">
              {services.map((service, index) => (
                <Reveal key={service.id} delay={Math.min(index, 3) * 80}>
                  <article className="group flex items-start gap-5 border-t border-navy-900/10 py-7">
                    <span className="w-7 shrink-0 pt-2 text-[11px] text-champagne-600">{faIndex(index + 1)}</span>
                    {service.image ? (
                      <span className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-sand">
                        <img
                          src={service.image}
                          alt=""
                          loading="lazy"
                          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                        />
                      </span>
                    ) : null}
                    <div className="flex-1">
                      <h3 className="text-[15.5px] font-bold text-navy-900">{service.title}</h3>
                      <p className="mt-2 text-[12.5px] leading-7 text-navy-500">{service.description}</p>
                    </div>
                    <span className="mt-2 text-navy-300 transition duration-300 group-hover:-translate-x-1 group-hover:text-champagne-600">
                      <ArrowLeftIcon className="h-4 w-4" />
                    </span>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* -------------------------------------------------------------- why us */}
      {whyItems.length > 0 ? (
        <section className="relative overflow-hidden bg-navy-950 py-20 text-white lg:py-28">
          <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_top_right,rgba(194,161,115,0.12),transparent_60%)]" />
          <div className="shell relative">
            <SectionHeader
              eyebrow="رویکرد ما"
              title={settings.whyTitle || 'چرا با ما کار می‌کنید؟'}
              description={settings.whyDescription}
              tone="light"
            />
            <div className="mt-12 grid gap-x-14 sm:grid-cols-2">
              {whyItems.map((item, index) => {
                const Icon = whyIcons[index % whyIcons.length] ?? CompassIcon;
                return (
                  <Reveal key={item.title} delay={Math.min(index, 3) * 70}>
                    <div className="flex items-start gap-4 border-t border-white/10 py-7">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-champagne-500/40 text-champagne-400">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <h3 className="text-[15px] font-semibold text-white">{item.title}</h3>
                        <p className="mt-2 text-[12.5px] leading-7 text-white/55">{item.description}</p>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}

      {/* ---------------------------------------------------------------- team */}
      {visibleTeam.length > 0 ? (
        <section className="bg-white py-20 lg:py-28">
          <div className="shell">
            <SectionHeader
              eyebrow="تیم ما"
              title="کارشناسانی که همراه شما هستند"
              description="هر معامله توسط یک کارشناس مشخص پیگیری می‌شود."
              action={
                <ButtonLink to="/team" variant="ghost" size="sm">
                  همه اعضای تیم
                  <ArrowLeftIcon className="h-3.5 w-3.5" />
                </ButtonLink>
              }
            />
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {visibleTeam.map((member, index) => (
                <Reveal key={member.id} delay={Math.min(index, 3) * 70}>
                  <article className="group relative overflow-hidden rounded-2xl bg-navy-900">
                    <img
                      src={member.photo || '/images/team-1.jpg'}
                      alt={member.name}
                      loading="lazy"
                      className="aspect-[3/4] w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-navy-950/10 to-transparent" />
                    <div className="absolute inset-x-5 bottom-5 text-white">
                      <p className="text-[15px] font-semibold">{member.name}</p>
                      <p className="mt-1 text-[11px] text-white/60">{member.role}</p>
                      {member.instagram ? (
                        <a
                          href={instagramUrl(member.instagram)}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="mt-3 inline-flex items-center gap-1.5 text-[10.5px] text-champagne-300 transition hover:text-champagne-200"
                        >
                          اینستاگرام
                          <ArrowRightIcon className="h-3 w-3 rotate-180" />
                        </a>
                      ) : null}
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* ----------------------------------------------------------------- cta */}
      <section className="bg-mist py-16 lg:py-20">
        <div className="shell">
          <Reveal className="mx-auto flex max-w-2xl flex-col items-center text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full border border-champagne-500/50 text-champagne-600">
              <KeyIcon className="h-6 w-6" />
            </span>
            <h2 className="display-2 mt-6 text-balance">{settings.ctaTitle}</h2>
            <p className="body-text mt-4">{settings.ctaText}</p>
            <ButtonLink to="/contact" className="mt-8">
              {settings.ctaButton || 'تماس با ما'}
              <ArrowLeftIcon className="h-4 w-4" />
            </ButtonLink>
            <div className="mt-10 flex items-center gap-3">
              <Brand settings={settings} size="sm" />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
