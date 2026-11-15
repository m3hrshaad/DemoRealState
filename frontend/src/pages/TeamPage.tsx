import { useSite } from '../components/SiteProvider';
import { PageHero } from '../components/PageHero';
import { Reveal } from '../components/ui/Reveal';
import { EmptyState } from '../components/ui/EmptyState';
import { ButtonLink } from '../components/ui/Button';
import { InstagramIcon, MailIcon, PhoneIcon, UsersIcon } from '../icons';
import { instagramUrl, phoneHref } from '../lib/format';

export function TeamPage() {
  const { settings, team } = useSite();

  return (
    <>
      <PageHero
        eyebrow="تیم ما"
        title="کارشناسانی که در کنار شما هستند"
        description="هر عضو تیم روی بخش مشخصی از بازار مسکن تمرکز دارد؛ از املاک مسکونی لوکس تا زمین و املاک تجاری."
        crumbs={[{ label: 'خانه', to: '/' }, { label: 'تیم ما' }]}
      />

      <section className="bg-white py-16 lg:py-24">
        <div className="shell">
          {team.length === 0 ? (
            <EmptyState
              title="اطلاعات تیم هنوز ثبت نشده است"
              description="اعضای تیم از بخش «مدیریت تیم ما» در پنل مدیریت اضافه می‌شوند."
              icon={<UsersIcon className="h-6 w-6" />}
            />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {team.map((member, index) => (
                <Reveal key={member.id} delay={Math.min(index, 4) * 60}>
                  <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-navy-900/8 bg-white transition duration-500 hover:-translate-y-1 hover:shadow-lift">
                    <div className="overflow-hidden bg-navy-900">
                      <img
                        src={member.photo || '/images/team-1.jpg'}
                        alt={member.name}
                        loading="lazy"
                        className="aspect-[4/3] w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <h2 className="text-[15.5px] font-bold text-navy-900">{member.name}</h2>
                      <p className="mt-1 text-[11.5px] text-champagne-700">{member.role}</p>
                      {member.bio ? <p className="mt-3 text-[12px] leading-7 text-navy-500">{member.bio}</p> : null}
                      <div className="mt-auto flex flex-wrap items-center gap-2 pt-5">
                        {member.phone ? (
                          <a
                            href={phoneHref(member.phone)}
                            className="inline-flex items-center gap-1.5 rounded-full border border-navy-900/12 px-3 py-1.5 text-[10.5px] text-navy-600 transition hover:border-champagne-500 hover:text-champagne-700"
                          >
                            <PhoneIcon className="h-3.5 w-3.5" />
                            <span dir="ltr">{member.phone}</span>
                          </a>
                        ) : null}
                        {member.email ? (
                          <a
                            href={`mailto:${member.email}`}
                            className="inline-flex items-center gap-1.5 rounded-full border border-navy-900/12 px-3 py-1.5 text-[10.5px] text-navy-600 transition hover:border-champagne-500 hover:text-champagne-700"
                          >
                            <MailIcon className="h-3.5 w-3.5" />
                            ایمیل
                          </a>
                        ) : null}
                        {member.instagram ? (
                          <a
                            href={instagramUrl(member.instagram)}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="inline-flex items-center gap-1.5 rounded-full border border-navy-900/12 px-3 py-1.5 text-[10.5px] text-navy-600 transition hover:border-champagne-500 hover:text-champagne-700"
                          >
                            <InstagramIcon className="h-3.5 w-3.5" />
                            اینستاگرام
                          </a>
                        ) : null}
                      </div>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          )}

          <div className="mt-14 rounded-2xl bg-ivory p-7 sm:flex sm:items-center sm:justify-between sm:gap-6">
            <div>
              <h2 className="text-lg font-bold text-navy-900">می‌خواهید با یک کارشناس صحبت کنید؟</h2>
              <p className="mt-2 text-[13px] leading-7 text-navy-500">{settings.ctaText}</p>
            </div>
            <ButtonLink to="/contact" className="mt-5 sm:mt-0">
              {settings.ctaButton || 'تماس با ما'}
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
