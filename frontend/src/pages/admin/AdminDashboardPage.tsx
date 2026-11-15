import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';
import { AdminPageHeader, Panel } from '../../components/admin/AdminUI';
import { VisitsChart } from '../../components/admin/VisitsChart';
import { Button, ButtonLink } from '../../components/ui/Button';
import {
  ArrowLeftIcon,
  BuildingIcon,
  ChartIcon,
  InfoIcon,
  KeyIcon,
  PencilIcon,
  PhoneIcon,
  PlusIcon,
  StarIcon,
  TrashIcon,
  TrendingIcon,
  UsersIcon,
} from '../../icons';
import {
  CATEGORY_LABELS,
  TRANSACTION_LABELS,
  chartDayLabel,
  chartMonthLabel,
  faNum,
  faRelative,
  propertyLocation,
} from '../../lib/format';
import type { Activity, Overview } from '../../lib/types';

const ACTIVITY_ICONS: Record<string, typeof InfoIcon> = {
  property_created: PlusIcon,
  property_updated: PencilIcon,
  property_deleted: TrashIcon,
  property_status: ChartIcon,
  property_featured: StarIcon,
  inquiry: PhoneIcon,
  content_updated: InfoIcon,
  team_updated: UsersIcon,
};

const INQUIRY_LABELS: Record<string, string> = {
  CALL: 'درخواست تماس',
  VISIT: 'درخواست بازدید',
  INFO: 'درخواست اطلاعات',
};

function StatCard({
  label,
  value,
  change,
  hint,
}: {
  label: string;
  value: number;
  change: number | null;
  hint: string;
}) {
  return (
    <div className="admin-card">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] text-navy-400">{label}</p>
          <p className="mt-2 text-3xl font-bold text-navy-900">{faNum(value)}</p>
        </div>
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ivory text-champagne-700">
          <TrendingIcon className="h-5 w-5" />
        </span>
      </div>
      <div className="mt-4 flex items-center gap-2 border-t border-navy-900/8 pt-3">
        {change === null ? (
          <span className="text-[10.5px] text-navy-400">داده مقایسه در دسترس نیست</span>
        ) : (
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] ${
              change >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
            }`}
          >
            {change >= 0 ? `${faNum(change)}٪ افزایش` : `${faNum(Math.abs(change))}٪ کاهش`}
          </span>
        )}
        <span className="text-[10px] text-navy-300">{hint}</span>
      </div>
    </div>
  );
}

function ActivityRow({ item }: { item: Activity }) {
  const Icon = ACTIVITY_ICONS[item.kind] ?? InfoIcon;
  return (
    <li className="flex items-start gap-3 border-b border-navy-900/6 py-3 last:border-0">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ivory text-champagne-700">
        <Icon className="h-3.5 w-3.5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[11.5px] leading-6 text-navy-700">{item.message}</p>
        <p className="mt-0.5 text-[10px] text-navy-400">{faRelative(item.createdAt)}</p>
      </div>
    </li>
  );
}

export function AdminDashboardPage() {
  const [data, setData] = useState<Overview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    let active = true;
    setError(null);
    api
      .get<Overview>('/admin/overview')
      .then((overview) => {
        if (active) setData(overview);
      })
      .catch((loadError) => {
        if (active) setError(loadError instanceof Error ? loadError.message : 'دریافت آمار انجام نشد.');
      });
    return () => {
      active = false;
    };
  }, [nonce]);

  return (
    <>
      <AdminPageHeader
        title="داشبورد"
        description="آمار این بخش از بازدیدهای واقعی ثبت‌شده در سایت محاسبه می‌شود."
        actions={
          <>
            <ButtonLink to="/admin/buy/new" size="sm">
              <PlusIcon className="h-4 w-4" />
              افزودن آگهی خرید
            </ButtonLink>
            <ButtonLink to="/admin/rent" size="sm" variant="outline">
              مدیریت اجاره
            </ButtonLink>
          </>
        }
      />

      {error ? (
        <Panel>
          <p className="text-[13px] text-red-700">{error}</p>
          <Button size="sm" className="mt-4" onClick={() => setNonce((value) => value + 1)}>
            تلاش دوباره
          </Button>
        </Panel>
      ) : null}

      {!data && !error ? (
        <div className="grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-[132px] animate-pulse rounded-2xl bg-white" />
          ))}
        </div>
      ) : null}

      {data ? (
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard label="بازدید امروز" value={data.stats.daily.value} change={data.stats.daily.change} hint="نسبت به دیروز" />
            <StatCard label="بازدید هفتگی" value={data.stats.weekly.value} change={data.stats.weekly.change} hint="۷ روز اخیر" />
            <StatCard label="بازدید ماهانه" value={data.stats.monthly.value} change={data.stats.monthly.change} hint="۳۰ روز اخیر" />
          </div>

          <div className="grid gap-3 sm:grid-cols-4">
            {[
              { label: 'کل آگهی‌ها', value: data.counts.properties, to: '/admin/buy' },
              { label: 'آگهی منتشرشده', value: data.counts.published, to: '/admin/buy' },
              { label: 'پیشنهاد ویژه', value: data.counts.featured, to: '/admin/buy' },
              { label: 'درخواست جدید', value: data.counts.newInquiries, to: '/admin' },
            ].map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="flex items-center justify-between rounded-xl border border-navy-900/8 bg-white px-4 py-3 transition hover:border-champagne-500"
              >
                <span className="text-[11px] text-navy-500">{item.label}</span>
                <span className="text-[15px] font-bold text-navy-900">{faNum(item.value)}</span>
              </Link>
            ))}
          </div>

          <div className="grid gap-5 xl:grid-cols-2">
            <Panel title="بازدید روزانه" description="۱۴ روز گذشته" className="xl:col-span-2">
              <VisitsChart data={data.charts.daily} formatLabel={chartDayLabel} caption="آمار بازدید روزانه سایت" />
            </Panel>
            <Panel title="بازدید هفتگی" description="۸ هفته گذشته">
              <VisitsChart data={data.charts.weekly} kind="bar" formatLabel={chartDayLabel} caption="آمار بازدید هفتگی سایت" />
            </Panel>
            <Panel title="بازدید ماهانه" description="۶ ماه گذشته">
              <VisitsChart data={data.charts.monthly} kind="bar" formatLabel={chartMonthLabel} caption="آمار بازدید ماهانه سایت" />
            </Panel>
          </div>

          <div className="grid gap-5 xl:grid-cols-[1.05fr_1fr]">
            <Panel title="پربازدیدترین ملک" description="بر اساس بازدیدهای ثبت‌شده">
              {data.mostViewed ? (
                <div className="flex flex-col gap-4 sm:flex-row">
                  <img
                    src={data.mostViewed.images[0] ?? '/images/hero.jpg'}
                    alt={data.mostViewed.title}
                    className="h-32 w-full rounded-xl object-cover sm:h-28 sm:w-40"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-bold leading-6 text-navy-900">{data.mostViewed.title}</p>
                    <p className="mt-1.5 text-[10.5px] text-navy-400">
                      {TRANSACTION_LABELS[data.mostViewed.transactionType]} · {CATEGORY_LABELS[data.mostViewed.category]} ·{' '}
                      {propertyLocation(data.mostViewed)}
                    </p>
                    <p className="mt-3 flex items-center gap-1.5 text-[12px] text-navy-700">
                      <ChartIcon className="h-4 w-4 text-champagne-600" />
                      {faNum(data.mostViewed.views)} بازدید
                    </p>
                    {data.mostViewed.views === 0 ? (
                      <p className="mt-1 text-[10px] text-navy-400">هنوز بازدیدی برای این ملک ثبت نشده است.</p>
                    ) : null}
                    <Link
                      to={`/admin/${data.mostViewed.transactionType === 'BUY' ? 'buy' : 'rent'}/${data.mostViewed.id}`}
                      className="mt-3 inline-flex items-center gap-1.5 text-[11px] text-champagne-700 transition hover:text-champagne-800"
                    >
                      مدیریت این آگهی
                      <ArrowLeftIcon className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-navy-900/15 p-8 text-center">
                  <p className="text-[12px] text-navy-500">هنوز ملکی ثبت نشده است.</p>
                  <ButtonLink to="/admin/buy/new" size="sm" className="mt-4">
                    افزودن اولین آگهی
                  </ButtonLink>
                </div>
              )}
            </Panel>

            <Panel title="آخرین فعالیت‌ها" description="تغییرات ثبت‌شده در سیستم">
              {data.activity.length === 0 ? (
                <p className="rounded-xl border border-dashed border-navy-900/15 p-6 text-center text-[11.5px] text-navy-400">
                  هنوز فعالیتی ثبت نشده است.
                </p>
              ) : (
                <ul>
                  {data.activity.map((item) => (
                    <ActivityRow key={item.id} item={item} />
                  ))}
                </ul>
              )}
            </Panel>
          </div>

          <Panel title="درخواست‌های اخیر" description="درخواست‌های دریافت‌شده از سایت">
            {data.inquiries.length === 0 ? (
              <p className="rounded-xl border border-dashed border-navy-900/15 p-6 text-center text-[11.5px] text-navy-400">
                هنوز درخواستی از سایت ثبت نشده است.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] text-right">
                  <thead>
                    <tr className="border-b border-navy-900/8 text-[10.5px] text-navy-400">
                      <th className="pb-2 font-medium">نام</th>
                      <th className="pb-2 font-medium">موبایل</th>
                      <th className="pb-2 font-medium">نوع</th>
                      <th className="pb-2 font-medium">ملک</th>
                      <th className="pb-2 font-medium">زمان</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.inquiries.map((inquiry) => (
                      <tr key={inquiry.id} className="border-b border-navy-900/6 text-[11px] text-navy-700 last:border-0">
                        <td className="py-3">{inquiry.name}</td>
                        <td className="py-3" dir="ltr">{inquiry.phone}</td>
                        <td className="py-3">{INQUIRY_LABELS[inquiry.type] ?? 'درخواست'}</td>
                        <td className="py-3 text-navy-500">{inquiry.propertyTitle ?? '—'}</td>
                        <td className="py-3 text-navy-400">{faRelative(inquiry.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Panel>

          <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-champagne-500/30 bg-champagne-100/30 p-4">
            <BuildingIcon className="h-5 w-5 text-champagne-700" />
            <p className="text-[11.5px] leading-6 text-navy-600">
              برای نمایش آگهی در بخش «املاک منتخب» صفحه اصلی، گزینه «پیشنهاد ویژه» را در تنظیمات هر آگهی فعال کنید.
            </p>
            <Link to="/admin/settings" className="ms-auto inline-flex items-center gap-1.5 text-[11px] text-champagne-800">
              <KeyIcon className="h-3.5 w-3.5" />
              تنظیمات سایت
            </Link>
          </div>
        </div>
      ) : null}
    </>
  );
}
