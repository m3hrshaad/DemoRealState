import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';
import {
  AdminPageHeader,
  Field,
  Input,
  Panel,
  SingleImageInput,
  Switch,
  Textarea,
} from '../../components/admin/AdminUI';
import { Button } from '../../components/ui/Button';
import { Dialog } from '../../components/ui/Dialog';
import { EmptyState } from '../../components/ui/EmptyState';
import { useToast } from '../../components/ui/Toast';
import { useSite } from '../../components/SiteProvider';
import { CompassIcon, ExternalIcon, PencilIcon, PlusIcon, TrashIcon } from '../../icons';
import type { Service } from '../../lib/types';

type Draft = {
  title: string;
  description: string;
  image: string;
  sortOrder: string;
  isVisible: boolean;
};

const EMPTY: Draft = { title: '', description: '', image: '', sortOrder: '0', isVisible: true };

export function AdminServicesPage() {
  const [services, setServices] = useState<Service[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { notify } = useToast();
  const { reload } = useSite();

  const load = async () => {
    try {
      const data = await api.get<{ services: Service[] }>('/admin/services');
      setServices(data.services);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'دریافت خدمات انجام نشد.');
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const openNew = () => {
    setEditing(null);
    setDraft({ ...EMPTY, sortOrder: String(services?.length ?? 0) });
    setDialogOpen(true);
  };

  const openEdit = (service: Service) => {
    setEditing(service);
    setDraft({
      title: service.title,
      description: service.description,
      image: service.image,
      sortOrder: String(service.sortOrder ?? 0),
      isVisible: service.isVisible ?? true,
    });
    setDialogOpen(true);
  };

  const update = <K extends keyof Draft>(key: K, value: Draft[K]) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const save = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (draft.title.trim().length < 2) {
      notify('عنوان خدمت را وارد کنید.', 'error');
      return;
    }
    setSaving(true);
    try {
      const payload = { ...draft, sortOrder: Number(draft.sortOrder) || 0 };
      if (editing) {
        await api.put(`/admin/services/${editing.id}`, payload);
        notify('خدمت ذخیره شد.');
      } else {
        await api.post('/admin/services', payload);
        notify('خدمت اضافه شد.');
      }
      setDialogOpen(false);
      await load();
      await reload();
    } catch (saveError) {
      notify(saveError instanceof Error ? saveError.message : 'ذخیره خدمت انجام نشد.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/admin/services/${deleteTarget.id}`);
      notify('خدمت حذف شد.');
      setDeleteTarget(null);
      await load();
      await reload();
    } catch (deleteError) {
      notify(deleteError instanceof Error ? deleteError.message : 'حذف انجام نشد.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <AdminPageHeader
        title="مدیریت خدمات"
        description="خدماتی که در صفحه اصلی معرفی می‌شود."
        actions={
          <>
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-full border border-navy-900/15 px-4 py-2 text-[11.5px] text-navy-600 transition hover:border-champagne-500"
            >
              مشاهده سایت
              <ExternalIcon className="h-3.5 w-3.5" />
            </Link>
            <Button size="sm" onClick={openNew}>
              <PlusIcon className="h-4 w-4" />
              خدمت جدید
            </Button>
          </>
        }
      />

      {error ? (
        <Panel>
          <p className="text-[12.5px] text-red-700">{error}</p>
        </Panel>
      ) : null}

      {!services && !error ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-32 animate-pulse rounded-2xl bg-white" />
          ))}
        </div>
      ) : null}

      {services && services.length === 0 ? (
        <Panel>
          <EmptyState
            title="خدمتی ثبت نشده است"
            description="برای نمایش بخش خدمات در صفحه اصلی، اولین خدمت را اضافه کنید."
            icon={<CompassIcon className="h-6 w-6" />}
            action={<Button onClick={openNew}>افزودن خدمت</Button>}
          />
        </Panel>
      ) : null}

      {services && services.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {services.map((service) => (
            <article key={service.id} className="admin-card flex gap-4">
              <img
                src={service.image || '/images/interior-1.jpg'}
                alt=""
                className="h-20 w-24 shrink-0 rounded-xl object-cover"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[13px] font-bold text-navy-900">{service.title}</p>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] ${
                      service.isVisible ? 'bg-emerald-50 text-emerald-700' : 'bg-navy-100 text-navy-500'
                    }`}
                  >
                    {service.isVisible ? 'نمایش عمومی' : 'مخفی'}
                  </span>
                </div>
                <p className="mt-1.5 text-[11px] leading-6 text-navy-500">{service.description}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[9.5px] text-navy-300">ترتیب: {service.sortOrder ?? 0}</span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => openEdit(service)}
                      aria-label={`ویرایش ${service.title}`}
                      className="rounded-lg p-2 text-navy-500 transition hover:bg-ivory hover:text-navy-900"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(service)}
                      aria-label={`حذف ${service.title}`}
                      className="rounded-lg p-2 text-navy-400 transition hover:bg-red-50 hover:text-red-600"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : null}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} title={editing ? 'ویرایش خدمت' : 'افزودن خدمت'}>
        <form onSubmit={save} className="space-y-4">
          <Field label="عنوان خدمت" htmlFor="service-title" required>
            <Input id="service-title" value={draft.title} onChange={(event) => update('title', event.target.value)} />
          </Field>
          <Field label="توضیح" htmlFor="service-description">
            <Textarea
              id="service-description"
              value={draft.description}
              onChange={(event) => update('description', event.target.value)}
              className="min-h-[90px]"
            />
          </Field>
          <SingleImageInput label="تصویر" value={draft.image} onChange={(value) => update('image', value)} />
          <Field label="ترتیب نمایش" htmlFor="service-order">
            <Input
              id="service-order"
              value={draft.sortOrder}
              onChange={(event) => update('sortOrder', event.target.value.replace(/[^\d۰-۹]/g, ''))}
              inputMode="numeric"
              dir="ltr"
            />
          </Field>
          <Switch
            checked={draft.isVisible}
            onChange={(value) => update('isVisible', value)}
            label="نمایش در سایت"
          />
          <div className="flex items-center justify-end gap-2 pt-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setDialogOpen(false)}>
              انصراف
            </Button>
            <Button type="submit" size="sm" disabled={saving}>
              {saving ? 'در حال ذخیره…' : 'ذخیره'}
            </Button>
          </div>
        </form>
      </Dialog>

      <Dialog open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)} title="حذف خدمت" size="sm">
        <p className="text-[13px] leading-7 text-navy-600">
          آیا از حذف «{deleteTarget?.title}» مطمئن هستید؟
        </p>
        <div className="mt-6 flex items-center justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => setDeleteTarget(null)}>
            انصراف
          </Button>
          <Button variant="danger" size="sm" onClick={() => void confirmDelete()} disabled={deleting}>
            {deleting ? 'در حال حذف…' : 'حذف'}
          </Button>
        </div>
      </Dialog>
    </>
  );
}
