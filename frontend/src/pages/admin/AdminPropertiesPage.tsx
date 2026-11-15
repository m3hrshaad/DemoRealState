import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, queryString } from '../../lib/api';
import { AdminPageHeader, Input, Panel, Select } from '../../components/admin/AdminUI';
import { Button } from '../../components/ui/Button';
import { Dialog } from '../../components/ui/Dialog';
import { EmptyState } from '../../components/ui/EmptyState';
import { useToast } from '../../components/ui/Toast';
import {
  EyeIcon,
  EyeOffIcon,
  PencilIcon,
  PlusIcon,
  SearchIcon,
  StarIcon,
  TrashIcon,
} from '../../icons';
import {
  CATEGORY_LABELS,
  TRANSACTION_LABELS,
  faNum,
  faRelative,
  propertyArea,
  propertyLocation,
  propertyPrice,
} from '../../lib/format';
import type { Category, Property, PropertyList, Transaction } from '../../lib/types';

const BASE = { BUY: '/admin/buy', RENT: '/admin/rent' } as const;

export function AdminPropertiesPage({ transaction }: { transaction: Transaction }) {
  const [q, setQ] = useState('');
  const [category, setCategory] = useState<Category | ''>('');
  const [status, setStatus] = useState<'all' | 'published' | 'draft'>('all');
  const [page, setPage] = useState(1);
  const [data, setData] = useState<PropertyList | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);
  const [deleteTarget, setDeleteTarget] = useState<Property | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { notify } = useToast();

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    const timer = window.setTimeout(() => {
      api
        .get<PropertyList>(
          `/admin/properties${queryString({
            transaction,
            category: category || undefined,
            status: status === 'all' ? undefined : status,
            q: q.trim() || undefined,
            page,
            limit: 10,
          })}`,
        )
        .then((result) => {
          if (active) setData(result);
        })
        .catch((loadError) => {
          if (active) setError(loadError instanceof Error ? loadError.message : 'دریافت آگهی‌ها انجام نشد.');
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    }, 250);
    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [transaction, q, category, status, page, nonce]);

  const toggle = async (property: Property, field: 'isPublished' | 'isFeatured') => {
    try {
      await api.patch(`/admin/properties/${property.id}`, { [field]: !property[field] });
      notify(
        field === 'isPublished'
          ? property.isPublished
            ? 'آگهی از انتشار خارج شد.'
            : 'آگهی منتشر شد.'
          : property.isFeatured
            ? 'از پیشنهادهای ویژه حذف شد.'
            : 'به پیشنهادهای ویژه اضافه شد.',
      );
      setNonce((value) => value + 1);
    } catch (toggleError) {
      notify(toggleError instanceof Error ? toggleError.message : 'تغییر وضعیت انجام نشد.', 'error');
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/admin/properties/${deleteTarget.id}`);
      notify('آگهی حذف شد.');
      setDeleteTarget(null);
      setNonce((value) => value + 1);
    } catch (deleteError) {
      notify(deleteError instanceof Error ? deleteError.message : 'حذف آگهی انجام نشد.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const categories = (transaction === 'BUY'
    ? ['LAND', 'APARTMENT', 'VILLA', 'COMMERCIAL']
    : ['APARTMENT', 'VILLA', 'COMMERCIAL']) as Category[];

  const statusTabs: { key: typeof status; label: string }[] = [
    { key: 'all', label: 'همه' },
    { key: 'published', label: 'منتشرشده' },
    { key: 'draft', label: 'پیش‌نویس' },
  ];

  return (
    <>
      <AdminPageHeader
        title={`مدیریت ${TRANSACTION_LABELS[transaction]}`}
        description={`آگهی‌های ${TRANSACTION_LABELS[transaction]} را ایجاد، ویرایش و مدیریت کنید.`}
        actions={
          <Link
            to={`${BASE[transaction]}/new`}
            className="inline-flex items-center gap-2 rounded-full bg-navy-900 px-5 py-2.5 text-[12px] text-white transition hover:bg-navy-800"
          >
            <PlusIcon className="h-4 w-4" />
            افزودن آگهی
          </Link>
        }
      />

      <Panel className="mb-5">
        <div className="grid gap-3 lg:grid-cols-[1fr_220px_auto] lg:items-end">
          <div>
            <label htmlFor="admin-search" className="field-label">
              جست‌وجو
            </label>
            <div className="relative">
              <SearchIcon className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-300" />
              <Input
                id="admin-search"
                value={q}
                onChange={(event) => {
                  setQ(event.target.value);
                  setPage(1);
                }}
                className="pr-10"
                placeholder="عنوان، کد ملک یا محله"
              />
            </div>
          </div>
          <div>
            <label htmlFor="admin-category" className="field-label">
              دسته‌بندی
            </label>
            <Select
              id="admin-category"
              value={category}
              onChange={(event) => {
                setCategory(event.target.value as Category | '');
                setPage(1);
              }}
            >
              <option value="">همه دسته‌ها</option>
              {categories.map((item) => (
                <option key={item} value={item}>
                  {CATEGORY_LABELS[item]}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex gap-2" role="group" aria-label="وضعیت انتشار">
            {statusTabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => {
                  setStatus(tab.key);
                  setPage(1);
                }}
                aria-pressed={status === tab.key}
                className={`rounded-full border px-4 py-2.5 text-[11px] transition ${
                  status === tab.key
                    ? 'border-navy-900 bg-navy-900 text-white'
                    : 'border-navy-900/15 text-navy-600 hover:border-navy-900/40'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </Panel>

      {error ? (
        <Panel>
          <p className="text-[12.5px] text-red-700">{error}</p>
          <Button size="sm" className="mt-3" onClick={() => setNonce((value) => value + 1)}>
            تلاش دوباره
          </Button>
        </Panel>
      ) : null}

      {!error ? (
        <Panel className="p-0 sm:p-0">
          {loading && !data ? (
            <div className="space-y-3 p-5">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="h-16 animate-pulse rounded-xl bg-navy-50" />
              ))}
            </div>
          ) : data && data.items.length === 0 ? (
            <div className="p-5">
              <EmptyState
                title="آگهی‌ای پیدا نشد"
                description="با تغییر فیلترها جست‌وجو کنید یا اولین آگهی را اضافه کنید."
                action={
                  <Link
                    to={`${BASE[transaction]}/new`}
                    className="inline-flex items-center gap-2 rounded-full bg-navy-900 px-5 py-2.5 text-[12px] text-white"
                  >
                    <PlusIcon className="h-4 w-4" />
                    افزودن آگهی
                  </Link>
                }
              />
            </div>
          ) : data ? (
            <>
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[900px] text-right">
                  <thead>
                    <tr className="border-b border-navy-900/8 bg-ivory/60 text-[10.5px] text-navy-400">
                      <th className="px-4 py-3 font-medium">آگهی</th>
                      <th className="px-4 py-3 font-medium">دسته</th>
                      <th className="px-4 py-3 font-medium">موقعیت</th>
                      <th className="px-4 py-3 font-medium">قیمت</th>
                      <th className="px-4 py-3 font-medium">بازدید</th>
                      <th className="px-4 py-3 font-medium">وضعیت</th>
                      <th className="px-4 py-3 font-medium">عملیات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.items.map((property) => {
                      const price = propertyPrice(property);
                      return (
                        <tr key={property.id} className="border-b border-navy-900/6 text-[11.5px] last:border-0">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <img
                                src={property.images[0] ?? '/images/hero.jpg'}
                                alt=""
                                className="h-12 w-16 shrink-0 rounded-lg object-cover"
                              />
                              <div className="min-w-0">
                                <p className="max-w-[240px] truncate font-medium text-navy-900">{property.title}</p>
                                <p className="mt-0.5 text-[10px] text-navy-400">
                                  {property.code} · {propertyArea(property)} · {faRelative(property.updatedAt)}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-navy-600">{CATEGORY_LABELS[property.category]}</td>
                          <td className="px-4 py-3 text-navy-500">{propertyLocation(property)}</td>
                          <td className="px-4 py-3">
                            <p className="font-medium text-navy-800">{price.primary}</p>
                            {price.secondary ? <p className="mt-0.5 text-[9.5px] text-navy-400">{price.secondary}</p> : null}
                          </td>
                          <td className="px-4 py-3 text-navy-500">{faNum(property.views)}</td>
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-1.5">
                              <span
                                className={`rounded-full px-2 py-0.5 text-[9.5px] ${
                                  property.isPublished
                                    ? 'bg-emerald-50 text-emerald-700'
                                    : 'bg-navy-100 text-navy-500'
                                }`}
                              >
                                {property.isPublished ? 'منتشرشده' : 'پیش‌نویس'}
                              </span>
                              {property.isFeatured ? (
                                <span className="rounded-full bg-champagne-100 px-2 py-0.5 text-[9.5px] text-champagne-800">
                                  ویژه
                                </span>
                              ) : null}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              <Link
                                to={`${BASE[transaction]}/${property.id}`}
                                aria-label={`ویرایش ${property.title}`}
                                title="ویرایش"
                                className="rounded-lg p-2 text-navy-500 transition hover:bg-ivory hover:text-navy-900"
                              >
                                <PencilIcon className="h-4 w-4" />
                              </Link>
                              <button
                                type="button"
                                onClick={() => void toggle(property, 'isPublished')}
                                aria-label={property.isPublished ? 'خروج از انتشار' : 'انتشار آگهی'}
                                title={property.isPublished ? 'خروج از انتشار' : 'انتشار'}
                                className="rounded-lg p-2 text-navy-500 transition hover:bg-ivory hover:text-navy-900"
                              >
                                {property.isPublished ? <EyeIcon className="h-4 w-4" /> : <EyeOffIcon className="h-4 w-4" />}
                              </button>
                              <button
                                type="button"
                                onClick={() => void toggle(property, 'isFeatured')}
                                aria-label={property.isFeatured ? 'حذف از پیشنهاد ویژه' : 'افزودن به پیشنهاد ویژه'}
                                title="پیشنهاد ویژه"
                                className={`rounded-lg p-2 transition hover:bg-ivory ${
                                  property.isFeatured ? 'text-champagne-600' : 'text-navy-300'
                                }`}
                              >
                                <StarIcon className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeleteTarget(property)}
                                aria-label={`حذف ${property.title}`}
                                title="حذف"
                                className="rounded-lg p-2 text-navy-400 transition hover:bg-red-50 hover:text-red-600"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="divide-y divide-navy-900/6 md:hidden">
                {data.items.map((property) => {
                  const price = propertyPrice(property);
                  return (
                    <div key={property.id} className="p-4">
                      <div className="flex gap-3">
                        <img
                          src={property.images[0] ?? '/images/hero.jpg'}
                          alt=""
                          className="h-20 w-24 shrink-0 rounded-lg object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-[12px] font-semibold leading-6 text-navy-900">{property.title}</p>
                          <p className="mt-1 text-[10px] text-navy-400">
                            {CATEGORY_LABELS[property.category]} · {property.code}
                          </p>
                          <p className="mt-1 text-[11px] text-navy-700">{price.primary}</p>
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[9.5px] ${
                            property.isPublished ? 'bg-emerald-50 text-emerald-700' : 'bg-navy-100 text-navy-500'
                          }`}
                        >
                          {property.isPublished ? 'منتشرشده' : 'پیش‌نویس'}
                        </span>
                        <span className="text-[10px] text-navy-400">{faNum(property.views)} بازدید</span>
                        <div className="ms-auto flex items-center gap-1">
                          <Link
                            to={`${BASE[transaction]}/${property.id}`}
                            className="rounded-lg border border-navy-900/12 p-2 text-navy-600"
                            aria-label="ویرایش"
                          >
                            <PencilIcon className="h-3.5 w-3.5" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => void toggle(property, 'isPublished')}
                            className="rounded-lg border border-navy-900/12 p-2 text-navy-600"
                            aria-label="تغییر وضعیت انتشار"
                          >
                            {property.isPublished ? <EyeIcon className="h-3.5 w-3.5" /> : <EyeOffIcon className="h-3.5 w-3.5" />}
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(property)}
                            className="rounded-lg border border-navy-900/12 p-2 text-red-500"
                            aria-label="حذف"
                          >
                            <TrashIcon className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-navy-900/8 px-4 py-3">
                <p className="text-[10.5px] text-navy-400" aria-live="polite">
                  {loading ? 'در حال به‌روزرسانی…' : `${faNum(data.total)} آگهی`}
                </p>
                {data.pages > 1 ? (
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setPage((value) => Math.max(1, value - 1))}
                      disabled={data.page <= 1}
                      className="rounded-full border border-navy-900/15 px-3 py-1.5 text-[10.5px] text-navy-600 disabled:opacity-40"
                    >
                      قبلی
                    </button>
                    <span className="px-2 text-[10.5px] text-navy-500">
                      {faNum(data.page)} / {faNum(data.pages)}
                    </span>
                    <button
                      type="button"
                      onClick={() => setPage((value) => Math.min(data.pages, value + 1))}
                      disabled={data.page >= data.pages}
                      className="rounded-full border border-navy-900/15 px-3 py-1.5 text-[10.5px] text-navy-600 disabled:opacity-40"
                    >
                      بعدی
                    </button>
                  </div>
                ) : null}
              </div>
            </>
          ) : null}
        </Panel>
      ) : null}

      <Dialog open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)} title="حذف آگهی" size="sm">
        <p className="text-[13px] leading-7 text-navy-600">
          آیا از حذف «{deleteTarget?.title}» مطمئن هستید؟ این عملیات قابل بازگشت نیست.
        </p>
        <div className="mt-6 flex items-center justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => setDeleteTarget(null)}>
            انصراف
          </Button>
          <Button variant="danger" size="sm" onClick={() => void confirmDelete()} disabled={deleting}>
            {deleting ? 'در حال حذف…' : 'حذف آگهی'}
          </Button>
        </div>
      </Dialog>
    </>
  );
}
