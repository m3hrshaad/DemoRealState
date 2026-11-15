import { Link } from 'react-router-dom';
import { Brand } from './Brand';
import { useSite } from './SiteProvider';
import {
  InstagramIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  TelegramIcon,
  WhatsAppIcon,
} from '../icons';
import { CATEGORY_LABELS, CATEGORY_SLUGS, instagramUrl, phoneHref } from '../lib/format';
import type { Category } from '../lib/types';

const buyCategories: Category[] = ['LAND', 'APARTMENT', 'VILLA', 'COMMERCIAL'];
const rentCategories: Category[] = ['APARTMENT', 'VILLA', 'COMMERCIAL'];

export function PublicFooter() {
  const { settings } = useSite();
  const year = new Intl.DateTimeFormat('fa-IR', { year: 'numeric' }).format(new Date());
  const hasContact = Boolean(settings.phone || settings.mobile || settings.email || settings.address);
  const socials = [
    { key: 'instagram', value: settings.instagram, icon: <InstagramIcon className="h-4 w-4" />, label: 'اینستاگرام' },
    { key: 'telegram', value: settings.telegram, icon: <TelegramIcon className="h-4 w-4" />, label: 'تلگرام' },
    { key: 'whatsapp', value: settings.whatsapp, icon: <WhatsAppIcon className="h-4 w-4" />, label: 'واتس‌اپ' },
  ].filter((social) => social.value.trim().length > 0);

  return (
    <footer className="bg-navy-950 text-white">
      <div className="shell grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_0.8fr_1fr]">
        <div>
          <Brand settings={settings} tone="light" size="md" />
          <p className="mt-5 max-w-sm text-[13px] leading-7 text-white/55">{settings.description}</p>
          {socials.length > 0 ? (
            <div className="mt-6 flex items-center gap-2">
              {socials.map((social) => {
                const href = social.key === 'instagram' ? instagramUrl(social.value) : social.value;
                return (
                  <a
                    key={social.key}
                    href={href}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={social.label}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/70 transition hover:border-champagne-500 hover:text-champagne-400"
                  >
                    {social.icon}
                  </a>
                );
              })}
            </div>
          ) : null}
        </div>

        <div>
          <h3 className="text-[11px] font-medium text-champagne-400">دسترسی سریع</h3>
          <ul className="mt-5 space-y-3 text-[13px] text-white/60">
            <li><Link className="transition hover:text-white" to="/about">درباره ما</Link></li>
            <li><Link className="transition hover:text-white" to="/contact">تماس با ما</Link></li>
            <li><Link className="transition hover:text-white" to="/team">تیم ما</Link></li>
            <li><Link className="transition hover:text-white" to="/buy">خرید ملک</Link></li>
            <li><Link className="transition hover:text-white" to="/rent">اجاره ملک</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-[11px] font-medium text-champagne-400">خرید</h3>
          <ul className="mt-5 space-y-3 text-[13px] text-white/60">
            {buyCategories.map((category) => (
              <li key={category}>
                <Link className="transition hover:text-white" to={`/buy/${CATEGORY_SLUGS[category]}`}>
                  {CATEGORY_LABELS[category]}
                </Link>
              </li>
            ))}
          </ul>
          <h3 className="mt-7 text-[11px] font-medium text-champagne-400">اجاره</h3>
          <ul className="mt-5 space-y-3 text-[13px] text-white/60">
            {rentCategories.map((category) => (
              <li key={category}>
                <Link className="transition hover:text-white" to={`/rent/${CATEGORY_SLUGS[category]}`}>
                  {CATEGORY_LABELS[category]}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-[11px] font-medium text-champagne-400">تماس با ما</h3>
          {hasContact ? (
            <ul className="mt-5 space-y-4 text-[13px] text-white/60">
              {settings.address ? (
                <li className="flex items-start gap-2.5">
                  <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0 text-champagne-500" />
                  <span className="leading-6">{settings.address}</span>
                </li>
              ) : null}
              {settings.phone || settings.mobile ? (
                <li className="flex items-start gap-2.5">
                  <PhoneIcon className="mt-0.5 h-4 w-4 shrink-0 text-champagne-500" />
                  <span className="flex flex-col gap-1">
                    {settings.phone ? <a href={phoneHref(settings.phone)} dir="ltr" className="transition hover:text-white">{settings.phone}</a> : null}
                    {settings.mobile ? <a href={phoneHref(settings.mobile)} dir="ltr" className="transition hover:text-white">{settings.mobile}</a> : null}
                  </span>
                </li>
              ) : null}
              {settings.email ? (
                <li className="flex items-start gap-2.5">
                  <MailIcon className="mt-0.5 h-4 w-4 shrink-0 text-champagne-500" />
                  <a href={`mailto:${settings.email}`} dir="ltr" className="break-all">{settings.email}</a>
                </li>
              ) : null}
            </ul>
          ) : (
            <p className="mt-5 text-[12px] leading-6 text-white/40">
              اطلاعات تماس از بخش «مدیریت تماس با ما» در پنل مدیریت ثبت می‌شود.
            </p>
          )}
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="shell flex flex-col items-center justify-between gap-3 py-6 text-[11px] text-white/40 sm:flex-row">
          <p>
            © {year} {settings.brandName} — تمامی حقوق محفوظ است.
          </p>
          {settings.footerNote ? <p>{settings.footerNote}</p> : null}
        </div>
      </div>
    </footer>
  );
}
