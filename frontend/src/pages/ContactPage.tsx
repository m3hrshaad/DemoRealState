import { useSite } from '../components/SiteProvider';
import { PageHero } from '../components/PageHero';
import { InquiryForm } from '../components/InquiryForm';
import {
  InstagramIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  TelegramIcon,
  WhatsAppIcon,
} from '../icons';
import { instagramUrl, phoneHref } from '../lib/format';

export function ContactPage() {
  const { settings } = useSite();
  const hasContact = Boolean(settings.phone || settings.mobile || settings.email || settings.address);
  const socials = [
    { key: 'instagram', label: 'اینستاگرام', value: settings.instagram, icon: <InstagramIcon className="h-4 w-4" /> },
    { key: 'telegram', label: 'تلگرام', value: settings.telegram, icon: <TelegramIcon className="h-4 w-4" /> },
    { key: 'whatsapp', label: 'واتس‌اپ', value: settings.whatsapp, icon: <WhatsAppIcon className="h-4 w-4" /> },
  ].filter((social) => social.value.trim().length > 0);

  return (
    <>
      <PageHero
        eyebrow="تماس با ما"
        title={settings.contactTitle || 'با ما در ارتباط باشید'}
        description={settings.contactText}
        crumbs={[{ label: 'خانه', to: '/' }, { label: 'تماس با ما' }]}
      />

      <section className="bg-white py-16 lg:py-24">
        <div className="shell grid items-start gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-2xl border border-navy-900/10 p-6 sm:p-8">
            <h2 className="text-lg font-bold text-navy-900">ارسال پیام</h2>
            <p className="mt-2 text-[12.5px] leading-7 text-navy-500">
              فرم را تکمیل کنید؛ برای مشاوره، بازدید یا ثبت ملک با شما تماس می‌گیریم.
            </p>
            <div className="mt-6">
              <InquiryForm type="INFO" submitLabel="ارسال پیام" />
            </div>
          </div>

          <div className="space-y-5">
            <div className="rounded-2xl bg-ivory p-6 sm:p-8">
              <h2 className="text-[15px] font-bold text-navy-900">اطلاعات تماس</h2>
              {hasContact ? (
                <ul className="mt-5 space-y-4 text-[13px] text-navy-600">
                  {settings.phone ? (
                    <li className="flex items-start gap-3">
                      <PhoneIcon className="mt-0.5 h-4 w-4 shrink-0 text-champagne-600" />
                      <span className="flex flex-col gap-0.5">
                        <span className="text-[10.5px] text-navy-400">تلفن</span>
                        <a href={phoneHref(settings.phone)} dir="ltr" className="hover:text-champagne-700">
                          {settings.phone}
                        </a>
                      </span>
                    </li>
                  ) : null}
                  {settings.mobile ? (
                    <li className="flex items-start gap-3">
                      <PhoneIcon className="mt-0.5 h-4 w-4 shrink-0 text-champagne-600" />
                      <span className="flex flex-col gap-0.5">
                        <span className="text-[10.5px] text-navy-400">همراه</span>
                        <a href={phoneHref(settings.mobile)} dir="ltr" className="hover:text-champagne-700">
                          {settings.mobile}
                        </a>
                      </span>
                    </li>
                  ) : null}
                  {settings.email ? (
                    <li className="flex items-start gap-3">
                      <MailIcon className="mt-0.5 h-4 w-4 shrink-0 text-champagne-600" />
                      <span className="flex flex-col gap-0.5">
                        <span className="text-[10.5px] text-navy-400">ایمیل</span>
                        <a href={`mailto:${settings.email}`} dir="ltr" className="break-all hover:text-champagne-700">
                          {settings.email}
                        </a>
                      </span>
                    </li>
                  ) : null}
                  {settings.address ? (
                    <li className="flex items-start gap-3">
                      <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0 text-champagne-600" />
                      <span className="flex flex-col gap-0.5">
                        <span className="text-[10.5px] text-navy-400">نشانی دفتر</span>
                        <span className="leading-7">{settings.address}</span>
                      </span>
                    </li>
                  ) : null}
                </ul>
              ) : (
                <p className="mt-4 rounded-xl border border-dashed border-navy-900/15 bg-white/60 p-4 text-[12px] leading-7 text-navy-500">
                  اطلاعات تماس هنوز ثبت نشده است. برای ارسال پیام از فرم روبه‌رو استفاده کنید.
                </p>
              )}

              {settings.workingHours ? (
                <p className="mt-5 border-t border-navy-900/10 pt-4 text-[11.5px] leading-6 text-navy-500">
                  ساعات پاسخ‌گویی: {settings.workingHours}
                </p>
              ) : null}

              {socials.length > 0 ? (
                <div className="mt-6 flex flex-wrap gap-2">
                  {socials.map((social) => (
                    <a
                      key={social.key}
                      href={social.key === 'instagram' ? instagramUrl(social.value) : social.value}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-2 rounded-full border border-navy-900/12 px-3.5 py-1.5 text-[11px] text-navy-600 transition hover:border-champagne-500 hover:text-champagne-700"
                    >
                      {social.icon}
                      {social.label}
                    </a>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="rounded-2xl border border-navy-900/10 p-6">
              <h2 className="text-[14px] font-bold text-navy-900">درخواست بازدید</h2>
              <p className="mt-2 text-[12px] leading-7 text-navy-500">
                برای هماهنگی بازدید از یک ملک مشخص، از دکمه «درخواست بازدید» در صفحه همان ملک استفاده کنید.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
