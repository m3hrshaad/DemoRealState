import { Link } from 'react-router-dom';
import { useSite } from '../components/SiteProvider';
import { PageHero } from '../components/PageHero';
import { Reveal } from '../components/ui/Reveal';
import { ButtonLink } from '../components/ui/Button';
import { ArrowLeftIcon, BuildingIcon, CheckIcon, CompassIcon, KeyIcon, ShieldIcon } from '../icons';

const whyIcons = [CompassIcon, ShieldIcon, BuildingIcon, KeyIcon];

export function AboutPage() {
  const { settings, team } = useSite();

  return (
    <>
      <PageHero
        eyebrow="درباره ما"
        title={settings.aboutTitle}
        description={settings.aboutDescription}
        crumbs={[{ label: 'خانه', to: '/' }, { label: 'درباره ما' }]}
      />

      <section className="bg-white py-16 lg:py-24">
        <div className="shell grid items-center gap-14 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
          <Reveal className="order-2 lg:order-1">
            <span className="eyebrow">روایت ما</span>
            <h2 className="display-2 mt-4">انتخاب درست، نتیجه شناخت دقیق</h2>
            <p className="body-text mt-5">{settings.aboutDescription}</p>
            <p className="body-text mt-4">
              هر ملک ویژگی‌های خاص خود را دارد؛ موقعیت، نور، دسترسی، سند و پتانسیل رشد. کارشناسان ما این جزئیات را
              بررسی می‌کنند تا انتخابی متناسب با نیاز واقعی شما پیشنهاد شود.
            </p>

            {settings.aboutHighlights.length > 0 ? (
              <ul className="mt-8 grid gap-3.5 sm:grid-cols-2">
                {settings.aboutHighlights.map((highlight) => (
                  <li key={highlight} className="flex items-start gap-2.5 text-[13px] text-navy-700">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-champagne-500/50 text-champagne-600">
                      <CheckIcon className="h-3 w-3" />
                    </span>
                    {highlight}
                  </li>
                ))}
              </ul>
            ) : null}

            <ButtonLink to="/contact" variant="outline" className="mt-9">
              گفت‌وگو با کارشناس
              <ArrowLeftIcon className="h-4 w-4" />
            </ButtonLink>
          </Reveal>

          <Reveal delay={120} className="order-1 grid grid-cols-2 gap-4 lg:order-2">
            <div className="col-span-2 overflow-hidden rounded-2xl">
              <img
                src={settings.aboutImageMain || '/images/villa-2.jpg'}
                alt="معماری ملک"
                loading="lazy"
                className="aspect-[16/10] w-full object-cover"
              />
            </div>
            <div className="overflow-hidden rounded-2xl">
              <img
                src={settings.aboutImageSecondary || '/images/interior-1.jpg'}
                alt="فضای داخلی ملک"
                loading="lazy"
                className="aspect-[4/5] w-full object-cover"
              />
            </div>
            <div className="flex flex-col justify-between rounded-2xl bg-ivory p-6">
              <p className="text-[12px] leading-6 text-navy-500">
                از بازدید اول تا انتقال سند، یک کارشناس مشخص پاسخگوی شماست.
              </p>
              <div className="mt-6">
                <p className="text-3xl font-bold text-navy-900">{team.length > 0 ? `${team.length}` : '—'}</p>
                <p className="mt-1 text-[11px] text-navy-400">کارشناس تخصصی</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {settings.whyItems.length > 0 ? (
        <section className="bg-ivory py-16 lg:py-24">
          <div className="shell">
            <div className="max-w-2xl">
              <span className="eyebrow">اصول کار ما</span>
              <h2 className="display-2 mt-4">{settings.whyTitle || 'چرا با ما کار می‌کنید؟'}</h2>
              {settings.whyDescription ? <p className="body-text mt-4">{settings.whyDescription}</p> : null}
            </div>
            <div className="mt-10 grid gap-x-12 sm:grid-cols-2">
              {settings.whyItems.map((item, index) => {
                const Icon = whyIcons[index % whyIcons.length] ?? CompassIcon;
                return (
                  <Reveal key={item.title} delay={Math.min(index, 3) * 70}>
                    <div className="flex items-start gap-4 border-t border-navy-900/10 py-7">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-champagne-500/40 text-champagne-600">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <h3 className="text-[15px] font-semibold text-navy-900">{item.title}</h3>
                        <p className="mt-2 text-[12.5px] leading-7 text-navy-500">{item.description}</p>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}

      {team.length > 0 ? (
        <section className="bg-white py-16 lg:py-20">
          <div className="shell">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="eyebrow">تیم ما</span>
                <h2 className="display-2 mt-4">چهره‌های آشنا</h2>
              </div>
              <Link to="/team" className="text-[12.5px] font-medium text-navy-700 transition hover:text-champagne-600">
                مشاهده همه اعضای تیم ←
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              {team.slice(0, 4).map((member) => (
                <Link
                  key={member.id}
                  to="/team"
                  className="group flex items-center gap-3 rounded-full border border-navy-900/10 py-2 pl-5 pr-2 transition hover:border-champagne-500"
                >
                  <img
                    src={member.photo || '/images/team-1.jpg'}
                    alt={member.name}
                    loading="lazy"
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <span>
                    <span className="block text-[12.5px] font-semibold text-navy-900">{member.name}</span>
                    <span className="block text-[10.5px] text-navy-400">{member.role}</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="bg-mist py-16">
        <div className="shell flex flex-col items-center gap-5 text-center">
          <h2 className="display-2 max-w-xl text-balance">{settings.ctaTitle}</h2>
          <p className="body-text max-w-xl">{settings.ctaText}</p>
          <ButtonLink to="/contact" className="mt-2">
            {settings.ctaButton || 'تماس با ما'}
            <ArrowLeftIcon className="h-4 w-4" />
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
