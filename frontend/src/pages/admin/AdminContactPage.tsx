import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';
import { AdminPageHeader, Field, Input, Panel, Textarea } from '../../components/admin/AdminUI';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';
import { useSite } from '../../components/SiteProvider';
import { ExternalIcon, InfoIcon } from '../../icons';
import type { Settings } from '../../lib/types';

export function AdminContactPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { notify } = useToast();
  const { reload } = useSite();

  useEffect(() => {
    let active = true;
    api
      .get<{ settings: Settings }>('/admin/settings')
      .then((data) => {
        if (active) setSettings(data.settings);
      })
      .catch((loadError) => {
        if (active) setError(loadError instanceof Error ? loadError.message : 'دریافت اطلاعات انجام نشد.');
      });
    return () => {
      active = false;
    };
  }, []);

  const update = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings((current) => (current ? { ...current, [key]: value } : current));
  };

  const save = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!settings) return;
    if (settings.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(settings.email)) {
      setError('ایمیل وارد‌شده معتبر نیست.');
      return;
    }
    setError(null);
    setSaving(true);
    try {
      await api.put('/admin/settings', {
        contactTitle: settings.contactTitle,
        contactText: settings.contactText,
        phone: settings.phone,
        mobile: settings.mobile,
        email: settings.email,
        address: settings.address,
        workingHours: settings.workingHours,
        instagram: settings.instagram,
        telegram: settings.telegram,
        whatsapp: settings.whatsapp,
        linkedin: settings.linkedin,
      });
      await reload();
      notify('اطلاعات تماس ذخیره شد.');
    } catch (saveError) {
      const message = saveError instanceof Error ? saveError.message : 'ذخیره اطلاعات انجام نشد.';
      setError(message);
      notify(message, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <AdminPageHeader
        title="مدیریت تماس با ما"
        description="اطلاعات تماس و شبکه‌های اجتماعی که در سایت نمایش داده می‌شود."
        actions={
          <>
            <Link
              to="/contact"
              className="inline-flex items-center gap-1.5 rounded-full border border-navy-900/15 px-4 py-2 text-[11.5px] text-navy-600 transition hover:border-champagne-500"
            >
              مشاهده صفحه
              <ExternalIcon className="h-3.5 w-3.5" />
            </Link>
            <Button type="submit" form="contact-form" size="sm" disabled={saving || !settings}>
              {saving ? 'در حال ذخیره…' : 'ذخیره تغییرات'}
            </Button>
          </>
        }
      />

      {error ? (
        <p role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[12px] text-red-700">
          {error}
        </p>
      ) : null}

      {!settings ? (
        <div className="h-80 animate-pulse rounded-2xl bg-white" />
      ) : (
        <form id="contact-form" onSubmit={save} className="space-y-5">
          <div className="flex items-start gap-3 rounded-xl border border-champagne-500/30 bg-champagne-100/30 p-4">
            <InfoIcon className="mt-0.5 h-4 w-4 shrink-0 text-champagne-700" />
            <p className="text-[11px] leading-6 text-navy-600">
              فیلدهایی که خالی بمانند در سایت نمایش داده نمی‌شوند؛ اطلاعات تماس واقعی را وارد کنید.
            </p>
          </div>

          <Panel title="محتوا صفحه تماس">
            <div className="space-y-4">
              <Field label="عنوان صفحه" htmlFor="contactTitle">
                <Input
                  id="contactTitle"
                  value={settings.contactTitle}
                  onChange={(event) => update('contactTitle', event.target.value)}
                />
              </Field>
              <Field label="توضیح کوتاه" htmlFor="contactText">
                <Textarea
                  id="contactText"
                  value={settings.contactText}
                  onChange={(event) => update('contactText', event.target.value)}
                  className="min-h-[90px]"
                />
              </Field>
            </div>
          </Panel>

          <Panel title="اطلاعات تماس">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="تلفن ثابت" htmlFor="phone">
                <Input id="phone" value={settings.phone} onChange={(event) => update('phone', event.target.value)} dir="ltr" />
              </Field>
              <Field label="موبایل" htmlFor="mobile">
                <Input id="mobile" value={settings.mobile} onChange={(event) => update('mobile', event.target.value)} dir="ltr" />
              </Field>
              <Field label="ایمیل" htmlFor="email">
                <Input id="email" value={settings.email} onChange={(event) => update('email', event.target.value)} dir="ltr" />
              </Field>
              <Field label="ساعات پاسخ‌گویی" htmlFor="workingHours">
                <Input
                  id="workingHours"
                  value={settings.workingHours}
                  onChange={(event) => update('workingHours', event.target.value)}
                  placeholder="مثلاً شنبه تا پنجشنبه، ۹ تا ۱۸"
                />
              </Field>
              <div className="sm:col-span-2">
                <Field label="نشانی دفتر" htmlFor="address">
                  <Textarea
                    id="address"
                    value={settings.address}
                    onChange={(event) => update('address', event.target.value)}
                    className="min-h-[80px]"
                  />
                </Field>
              </div>
            </div>
          </Panel>

          <Panel title="شبکه‌های اجتماعی">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="اینستاگرام" htmlFor="instagram" hint="نام کاربری یا آدرس کامل">
                <Input
                  id="instagram"
                  value={settings.instagram}
                  onChange={(event) => update('instagram', event.target.value)}
                  dir="ltr"
                  placeholder="@agency"
                />
              </Field>
              <Field label="تلگرام" htmlFor="telegram" hint="آدرس کامل کانال یا حساب">
                <Input
                  id="telegram"
                  value={settings.telegram}
                  onChange={(event) => update('telegram', event.target.value)}
                  dir="ltr"
                />
              </Field>
              <Field label="واتس‌اپ" htmlFor="whatsapp" hint="لینک واتس‌اپ">
                <Input
                  id="whatsapp"
                  value={settings.whatsapp}
                  onChange={(event) => update('whatsapp', event.target.value)}
                  dir="ltr"
                />
              </Field>
              <Field label="لینکدین" htmlFor="linkedin">
                <Input
                  id="linkedin"
                  value={settings.linkedin}
                  onChange={(event) => update('linkedin', event.target.value)}
                  dir="ltr"
                />
              </Field>
            </div>
          </Panel>

          <div className="flex justify-end pb-4">
            <Button type="submit" disabled={saving}>
              {saving ? 'در حال ذخیره…' : 'ذخیره تغییرات'}
            </Button>
          </div>
        </form>
      )}
    </>
  );
}
