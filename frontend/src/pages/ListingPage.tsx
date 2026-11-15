import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PageHero } from '../components/PageHero';
import { PropertyCard, PropertyCardSkeleton } from '../components/PropertyCard';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';
import { SearchIcon, SlidersIcon } from '../icons';
import { api, queryString } from '../lib/api';
import {
  CATEGORIES_BY_TRANSACTION,
  CATEGORY_LABELS,
  SLUG_CATEGORIES,
  TRANSACTION_LABELS,
  faNum,
  listingPath,
} from '../lib/format';
import type { Category, PropertyList, Transaction } from '../lib/types';
import { NotFoundPage } from './NotFoundPage';

type SortKey = 'newest' | 'price_asc' | 'price_desc' | 'area_desc';

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'newest', label: 'جدیدترین' },
  { value: 'price_asc', label: 'ارزان‌ترین' },
  { value: 'price_desc', label: 'گران‌ترین' },
  { value: 'area_desc', label: 'بزرگ‌ترین متراژ' },
];

function pageNumbers(current: number, total: number): number[] {
  const start = Math.max(1, Math.min(current - 2, total - 4));
  const end = Math.min(total, start + 4);
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

function ListingContent({ transaction, category }: { transaction: Transaction; category?: Category }) {
  const [q, setQ] = useState('');
  const [minArea, setMinArea] = useState('');
  const [maxArea, setMaxArea] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [rooms, setRooms] = useState('');
  const [sort, setSort] = useState<SortKey>('newest');
  const [page, setPage] = useState(1);
  const [result, setResult] = useState<PropertyList | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    const timer = window.setTimeout(() => {
      const params = {
        transaction,
        category,
        q: q.trim() || undefined,
        minArea: minArea ? Number(minArea) : undefined,
        maxArea: maxArea ? Number(maxArea) : undefined,
        minPrice: minPrice ? Number(minPrice) * 1_000_000 : undefined,
        maxPrice: maxPrice ? Number(maxPrice) * 1_000_000 : undefined,
        rooms: category && category !== 'LAND' && rooms ? Number(rooms) : undefined,
        sort,
        page,
        limit: 9,
      };

      api
        .get<PropertyList>(`/properties${queryString(params)}`)
        .then((data) => {
          if (active) setResult(data);
        })
        .catch((loadError) => {
          if (active) setError(loadError instanceof Error ? loadError.message : 'دریافت آگهی‌ها انجام نشد.');
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    }, 280);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [transaction, category, q, minArea, maxArea, minPrice, maxPrice, rooms, sort, page, nonce]);

  const reset = () => {
    setQ('');
    setMinArea('');
    setMaxArea('');
    setMinPrice('');
    setMaxPrice('');
    setRooms('');
    setSort('newest');
    setPage(1);
  };

  const title = category
    ? `${TRANSACTION_LABELS[transaction]} ${CATEGORY_LABELS[category]}`
    : transaction === 'BUY'
      ? 'خرید ملک'
      : 'اجاره ملک';

  const description = category
    ? `آگهی‌های ${TRANSACTION_LABELS[transaction]} ${CATEGORY_LABELS[category]}، بازبینی‌شده توسط کارشناسان ما.`
    : transaction === 'BUY'
      ? 'زمین، آپارتمان، ویلایی و تجاری؛ همه گزینه‌های خرید در یک نگاه.'
      : 'گزینه‌های اجاره در دسته‌های آپارتمان، ویلایی و تجاری.';

  const categories = CATEGORIES_BY_TRANSACTION[transaction];
  const priceLabel = transaction === 'RENT' ? 'اجاره ماهانه' : 'قیمت';

  const changePage = (next: number) => {
    setPage(next);
    window.requestAnimationFrame(() => {
      document.getElementById('listing-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  return (
    <>
      <PageHero
        eyebrow={`${TRANSACTION_LABELS[transaction]} ملک`}
        title={title}
        description={description}
        crumbs={[
          { label: 'خانه', to: '/' },
          { label: TRANSACTION_LABELS[transaction], to: listingPath(transaction) },
          ...(category ? [{ label: CATEGORY_LABELS[category] }] : []),
        ]}
      >
        <div className="mt-8 flex flex-wrap gap-2">
          <Link
            to={listingPath(transaction)}
            className={`rounded-full border px-4 py-2 text-[11.5px] transition ${
              !category
                ? 'border-champagne-400 bg-champagne-400 text-navy-950'
                : 'border-white/20 text-white/70 hover:border-white/50 hover:text-white'
            }`}
          >
            همه
          </Link>
          {categories.map((item) => (
            <Link
              key={item}
              to={listingPath(transaction, item)}
              className={`rounded-full border px-4 py-2 text-[11.5px] transition ${
                category === item
                  ? 'border-champagne-400 bg-champagne-400 text-navy-950'
                  : 'border-white/20 text-white/70 hover:border-white/50 hover:text-white'
              }`}
            >
              {CATEGORY_LABELS[item]}
            </Link>
          ))}
        </div>
      </PageHero>

      <div className="shell relative z-10 -mt-8">
        <form
          className="rounded-2xl border border-navy-900/10 bg-white p-4 shadow-soft sm:p-5"
          onSubmit={(event) => event.preventDefault()}
          aria-label="فیلتر آگهی‌ها"
        >
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="sm:col-span-2">
              <label htmlFor="listing-q" className="field-label">
                جست‌وجو
              </label>
              <div className="relative">
                <SearchIcon className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-300" />
                <input
                  id="listing-q"
                  value={q}
                  onChange={(event) => {
                    setQ(event.target.value);
                    setPage(1);
                  }}
                  className="field-input pr-10"
                  placeholder="عنوان، کد ملک یا محله"
                />
              </div>
            </div>

            <div>
              <label htmlFor="listing-area-min" className="field-label">
                حداقل متراژ
              </label>
              <input
                id="listing-area-min"
                value={minArea}
                onChange={(event) => {
                  setMinArea(event.target.value.replace(/[^\d]/g, ''));
                  setPage(1);
                }}
                inputMode="numeric"
                className="field-input"
                placeholder="مثلاً ۱۰۰"
              />
            </div>
            <div>
              <label htmlFor="listing-area-max" className="field-label">
                حداکثر متراژ
              </label>
              <input
                id="listing-area-max"
                value={maxArea}
                onChange={(event) => {
                  setMaxArea(event.target.value.replace(/[^\d]/g, ''));
                  setPage(1);
                }}
                inputMode="numeric"
                className="field-input"
                placeholder="مثلاً ۳۰۰"
              />
            </div>

            <div>
              <label htmlFor="listing-price-min" className="field-label">
                حداقل {priceLabel} <span className="font-normal text-navy-400">(میلیون تومان)</span>
              </label>
              <input
                id="listing-price-min"
                value={minPrice}
                onChange={(event) => {
                  setMinPrice(event.target.value.replace(/[^\d]/g, ''));
                  setPage(1);
                }}
                inputMode="numeric"
                className="field-input"
                placeholder={transaction === 'RENT' ? 'مثلاً ۲۰' : 'مثلاً ۵۰۰۰'}
              />
            </div>
            <div>
              <label htmlFor="listing-price-max" className="field-label">
                حداکثر {priceLabel} <span className="font-normal text-navy-400">(میلیون تومان)</span>
              </label>
              <input
                id="listing-price-max"
                value={maxPrice}
                onChange={(event) => {
                  setMaxPrice(event.target.value.replace(/[^\d]/g, ''));
                  setPage(1);
                }}
                inputMode="numeric"
                className="field-input"
                placeholder={transaction === 'RENT' ? 'مثلاً ۱۰۰' : 'مثلاً ۲۰۰۰۰'}
              />
            </div>

            {category && category !== 'LAND' ? (
              <div>
                <label htmlFor="listing-rooms" className="field-label">
                  تعداد اتاق
                </label>
                <select
                  id="listing-rooms"
                  value={rooms}
                  onChange={(event) => {
                    setRooms(event.target.value);
                    setPage(1);
                  }}
                  className="field-input"
                >
                  <option value="">همه</option>
                  <option value="1">۱ اتاق و بیشتر</option>
                  <option value="2">۲ اتاق و بیشتر</option>
                  <option value="3">۳ اتاق و بیشتر</option>
                  <option value="4">۴ اتاق و بیشتر</option>
                </select>
              </div>
            ) : null}

            <div>
              <label htmlFor="listing-sort" className="field-label">
                ترتیب نمایش
              </label>
              <select
                id="listing-sort"
                value={sort}
                onChange={(event) => {
                  setSort(event.target.value as SortKey);
                  setPage(1);
                }}
                className="field-input"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <Button type="button" variant="outline" size="sm" className="w-full" onClick={reset}>
                <SlidersIcon className="h-4 w-4" />
                حذف فیلترها
              </Button>
            </div>
          </div>
        </form>
      </div>

      <section id="listing-results" className="scroll-mt-28 bg-white py-10 lg:py-14">
        <div className="shell">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-[15px] font-bold text-navy-900">{title}</h2>
            <p className="text-[11.5px] text-navy-400" aria-live="polite">
              {loading
                ? 'در حال دریافت آگهی‌ها…'
                : result
                  ? `${faNum(result.total)} ملک یافت شد`
                  : error
                    ? 'خطا در دریافت آگهی‌ها'
                    : ''}
            </p>
          </div>

          {error ? (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
              <p className="text-[13px] text-red-800">{error}</p>
              <Button size="sm" className="mt-4" onClick={() => setNonce((value) => value + 1)}>
                تلاش دوباره
              </Button>
            </div>
          ) : null}

          {!error && loading && !result ? (
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <PropertyCardSkeleton key={index} />
              ))}
            </div>
          ) : null}

          {!error && result && result.items.length === 0 ? (
            <div className="mt-6">
              <EmptyState
                title="ملکی با این مشخصات پیدا نشد"
                description="فیلترها را تغییر دهید یا همه آگهی‌های این دسته را ببینید."
                action={
                  <Button variant="outline" onClick={reset}>
                    حذف فیلترها
                  </Button>
                }
              />
            </div>
          ) : null}

          {!error && result && result.items.length > 0 ? (
            <>
              <div className={`mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 ${loading ? 'opacity-60' : ''}`}>
                {result.items.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>

              {result.pages > 1 ? (
                <nav aria-label="صفحه‌بندی" className="mt-10 flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => changePage(Math.max(1, result.page - 1))}
                    disabled={result.page <= 1}
                    className="rounded-full border border-navy-900/15 px-4 py-2 text-[11.5px] text-navy-600 transition hover:border-navy-900 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    قبلی
                  </button>
                  {pageNumbers(result.page, result.pages).map((number) => (
                    <button
                      key={number}
                      type="button"
                      onClick={() => changePage(number)}
                      aria-current={number === result.page ? 'page' : undefined}
                      className={`h-9 w-9 rounded-full text-[12px] transition ${
                        number === result.page
                          ? 'bg-navy-900 text-white'
                          : 'border border-navy-900/15 text-navy-600 hover:border-navy-900'
                      }`}
                    >
                      {faNum(number)}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => changePage(Math.min(result.pages, result.page + 1))}
                    disabled={result.page >= result.pages}
                    className="rounded-full border border-navy-900/15 px-4 py-2 text-[11.5px] text-navy-600 transition hover:border-navy-900 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    بعدی
                  </button>
                </nav>
              ) : null}
            </>
          ) : null}
        </div>
      </section>
    </>
  );
}

export function ListingPage({ transaction }: { transaction: Transaction }) {
  const { category: slug } = useParams();
  const category = slug ? SLUG_CATEGORIES[slug] : undefined;
  const invalid =
    Boolean(slug) && (!category || !CATEGORIES_BY_TRANSACTION[transaction].includes(category));

  if (invalid) return <NotFoundPage />;

  return (
    <ListingContent
      key={`${transaction}-${category ?? 'all'}`}
      transaction={transaction}
      category={category}
    />
  );
}
