import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';
import {
  AdminPageHeader,
  Field,
  Input,
  Panel,
  SingleImageInput,
  Textarea,
} from '../../components/admin/AdminUI';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';
import { useSite } from '../../components/SiteProvider';
import { ExternalIcon, PlusIcon, TrashIcon } from '../../icons';
import type { Settings } from '../../lib/types';

export function AdminSettingsPage() {
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
        if (active) setError(loadError instanceof Error ? loadError.message : 'دریافت تنظیمات انجام نشد.');
      });
    return () => {
      active = false;
    };
  }, []);

  const update = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings((current) => (current ? { ...current, [key]: value } : current));
  };

  const updateWhyItem = (index: number, key: 'title' | 'description', value: string) => {
    setSettings((current) =>
      current
        ? {
            ...current,
            whyItems: current.whyItems.map((item, itemIndex) =>
              itemIndex === index ? { ...item, [key]: value } : item,
            ),
          }
        : current,
    );
  };

  const save = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!settings) return;
    if (!settings.brandName.trim()) {
      setError('نام برند را وارد کنید.');
      return;
    }
    setError(null);
    setSaving(true);
    try {
      await api.put('/admin/settings', {
        brandName: settings.brandName,
        brandDescriptor: settings.brandDescriptor,
        description: settings.description,
        logoUrl: settings.logoUrl,
        heroImage: settings.heroImage,
        ctaTitle: settings.ctaTitle,
        ctaText: settings.ctaText,
        ctaButton: settings.ctaButton,
        footerNote: settings.footerNote,
        whyTitle: settings.whyTitle,
        whyDescription: settings.whyDescription,
        whyItems: settings.whyItems,
      });
      await reload();
      notify('تنظیمات سایت ذخیره شد.');
    } catch (saveError) {
      const message = saveError instanceof Error ? saveError.message : 'ذخیره تنظیمات انجام نشد.';
      setError(message);
      notify(message, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <AdminPageHeader
        title="تنظیمات سایت"
        description="نام برند، لوگو، تصویر هدر و محتوای بخش‌های صفحه اصلی."
        actions={
          <>
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-full border border-navy-900/15 px-4 py-2 text-[11.5px] text-navy-600 transition hover:border-champagne-500"
            >
              مشاهده سایت
              <ExternalIcon className="h-3.5 w-3.5" />
            </Link>
            <Button type="submit" form="settings-form" size="sm" disabled={saving || !settings}>
              {saving ? 'در حال ذخیره…' : 'ذخیره تنظیمات'}
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
        <form id="settings-form" onSubmit={save} className="space-y-5">
          <Panel title="هویت برند" description="این اطلاعات در هدر، هیرو، فوتر و پنل مدیریت نمایش داده می‌شود.">
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="نام برند" htmlFor="brandName" required hint="این نام به‌عنوان نام آژانس در کل سایت استفاده می‌شود.">
                  <Input
                    id="brandName"
                    value={settings.brandName}
                    onChange={(event) => update('brandName', event.target.value)}
                  />
                </Field>
                <Field label="زیرعنوان برند" htmlFor="brandDescriptor">
                  <Input
                    id="brandDescriptor"
                    value={settings.brandDescriptor}
                    onChange={(event) => update('brandDescriptor', event.target.value)}
                  />
                </Field>
              </div>
              <Field label="توضیح کوتاه" htmlFor="description" hint="در فوتر نمایش داده می‌شود.">
                <Textarea
                  id="description"
                  value={settings.description}
                  onChange={(event) => update('description', event.target.value)}
                  className="min-h-[80px]"
                />
              </Field>
              <SingleImageInput
                label="لوگو"
                value={settings.logoUrl}
                onChange={(value) => update('logoUrl', value)}
                hint="در صورت خالی بودن، نماد پیش‌فرض استفاده می‌شود."
              />
            </div>
          </Panel>

          <Panel title="بخش هیرو" description="تصویر اصلی صفحه‌ی اول سایت">
            <SingleImageInput
              label="تصویر هیرو"
              value={settings.heroImage}
              onChange={(value) => update('heroImage', value)}
              hint="تصویر افقی با کیفیت بالا؛ پیشنهاد: معماری لوکس در غروب"
            />
          </Panel>

          <Panel title="بخش دعوت به اقدام" description="انتهای صفحه اصلی">
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="عنوان" htmlFor="ctaTitle">
                  <Input id="ctaTitle" value={settings.ctaTitle} onChange={(event) => update('ctaTitle', event.target.value)} />
                </Field>
                <Field label="متن دکمه" htmlFor="ctaButton">
                  <Input id="ctaButton" value={settings.ctaButton} onChange={(event) => update('ctaButton', event.target.value)} />
                </Field>
              </div>
              <Field label="توضیح" htmlFor="ctaText">
                <Textarea
                  id="ctaText"
                  value={settings.ctaText}
                  onChange={(event) => update('ctaText', event.target.value)}
                  className="min-h-[80px]"
                />
              </Field>
            </div>
          </Panel>

          <Panel
            title="بخش چرا ما"
            description="مزیت‌های آژانس که در صفحه اصلی و درباره ما نمایش داده می‌شود."
            actions={
              settings.whyItems.length < 6 ? (
                <button
                  type="button"
                  onClick={() =>
                    update('whyItems', [...settings.whyItems, { title: '', description: '' }])
                  }
                  className="inline-flex items-center gap-1 rounded-full border border-navy-900/15 px-3 py-1.5 text-[10.5px] text-navy-600 transition hover:border-champagne-500"
                >
                  <PlusIcon className="h-3 w-3" />
                  افزودن مورد
                </button>
              ) : null
            }
          >
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="عنوان بخش" htmlFor="whyTitle">
                  <Input id="whyTitle" value={settings.whyTitle} onChange={(event) => update('whyTitle', event.target.value)} />
                </Field>
                <Field label="توضیح بخش" htmlFor="whyDescription">
                  <Input
                    id="whyDescription"
                    value={settings.whyDescription}
                    onChange={(event) => update('whyDescription', event.target.value)}
                  />
                </Field>
              </div>

              {settings.whyItems.length === 0 ? (
                <p className="rounded-xl border border-dashed border-navy-900/15 p-4 text-center text-[11px] text-navy-400">
                  موردی اضافه نشده است؛ این بخش در سایت نمایش داده نمی‌شود.
                </p>
              ) : null}

              {settings.whyItems.map((item, index) => (
                <div key={index} className="grid gap-3 rounded-xl border border-navy-900/8 bg-ivory/40 p-4 sm:grid-cols-[1fr_1.4fr_auto]">
                  <Field label={`عنوان ${index + 1}`} htmlFor={`why-title-${index}`}>
                    <Input
                      id={`why-title-${index}`}
                      value={item.title}
                      onChange={(event) => updateWhyItem(index, 'title', event.target.value)}
                    />
                  </Field>
                  <Field label="توضیح" htmlFor={`why-desc-${index}`}>
                    <Input
                      id={`why-desc-${index}`}
                      value={item.description}
                      onChange={(event) => updateWhyItem(index, 'description', event.target.value)}
                    />
                  </Field>
                  <button
                    type="button"
                    onClick={() => update('whyItems', settings.whyItems.filter((_, itemIndex) => itemIndex !== index))}
                    aria-label="حذف مورد"
                    className="self-end rounded-lg border border-navy-900/10 p-2.5 text-navy-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="فوتر">
            <Field label="یادداشت فوتر" htmlFor="footerNote" hint="متن کوتاه کنار کپی‌رایت؛ اختیاری.">
              <Input
                id="footerNote"
                value={settings.footerNote}
                onChange={(event) => update('footerNote', event.target.value)}
              />
            </Field>
          </Panel>

          <div className="flex justify-end pb-4">
            <Button type="submit" disabled={saving}>
              {saving ? 'در حال ذخیره…' : 'ذخیره تنظیمات'}
            </Button>
          </div>
        </form>
      )}
    </>
  );
}
