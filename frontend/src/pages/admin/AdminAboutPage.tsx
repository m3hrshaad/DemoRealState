import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';
import { AdminPageHeader, Field, Input, Panel, SingleImageInput, TagInput, Textarea } from '../../components/admin/AdminUI';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';
import { useSite } from '../../components/SiteProvider';
import { ExternalIcon } from '../../icons';
import type { Settings } from '../../lib/types';

export function AdminAboutPage() {
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
        if (active) setError(loadError instanceof Error ? loadError.message : 'دریافت محتوا انجام نشد.');
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
    if (!settings.aboutTitle.trim()) {
      setError('عنوان بخش درباره ما را وارد کنید.');
      return;
    }
    setError(null);
    setSaving(true);
    try {
      await api.put('/admin/settings', {
        aboutTitle: settings.aboutTitle,
        aboutDescription: settings.aboutDescription,
        aboutImageMain: settings.aboutImageMain,
        aboutImageSecondary: settings.aboutImageSecondary,
        aboutHighlights: settings.aboutHighlights,
      });
      await reload();
      notify('محتوای درباره ما ذخیره شد.');
    } catch (saveError) {
      const message = saveError instanceof Error ? saveError.message : 'ذخیره محتوا انجام نشد.';
      setError(message);
      notify(message, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <AdminPageHeader
        title="مدیریت درباره ما"
        description="محتوای بخش معرفی در صفحه اصلی و صفحه درباره ما."
        actions={
          <>
            <Link
              to="/about"
              className="inline-flex items-center gap-1.5 rounded-full border border-navy-900/15 px-4 py-2 text-[11.5px] text-navy-600 transition hover:border-champagne-500"
            >
              مشاهده صفحه
              <ExternalIcon className="h-3.5 w-3.5" />
            </Link>
            <Button type="submit" form="about-form" size="sm" disabled={saving || !settings}>
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
        <form id="about-form" onSubmit={save} className="space-y-5">
          <Panel title="متن معرفی">
            <div className="space-y-4">
              <Field label="عنوان" htmlFor="aboutTitle" required>
                <Input
                  id="aboutTitle"
                  value={settings.aboutTitle}
                  onChange={(event) => update('aboutTitle', event.target.value)}
                />
              </Field>
              <Field label="توضیحات" htmlFor="aboutDescription" hint="در صفحه اصلی و صفحه درباره ما نمایش داده می‌شود.">
                <Textarea
                  id="aboutDescription"
                  value={settings.aboutDescription}
                  onChange={(event) => update('aboutDescription', event.target.value)}
                />
              </Field>
            </div>
          </Panel>

          <Panel title="تصاویر بخش معرفی">
            <div className="grid gap-6 sm:grid-cols-2">
              <SingleImageInput
                label="تصویر اصلی"
                value={settings.aboutImageMain}
                onChange={(value) => update('aboutImageMain', value)}
                hint="نسبت پیشنهادی ۴:۵"
              />
              <SingleImageInput
                label="تصویر دوم"
                value={settings.aboutImageSecondary}
                onChange={(value) => update('aboutImageSecondary', value)}
                hint="نسبت پیشنهادی ۳:۴"
              />
            </div>
          </Panel>

          <Panel title="نکات کلیدی" description="حداکثر ۸ مورد در صفحه اصلی و درباره ما نمایش داده می‌شود.">
            <TagInput
              label="موارد کلیدی"
              value={settings.aboutHighlights}
              onChange={(value) => update('aboutHighlights', value)}
              placeholder="مثلاً بررسی دقیق مدارک"
            />
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
