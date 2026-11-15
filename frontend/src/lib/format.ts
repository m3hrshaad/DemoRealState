import type { Category, Property, Transaction } from './types';

const numberFormatter = new Intl.NumberFormat('fa-IR');
const decimalFormatter = new Intl.NumberFormat('fa-IR', { maximumFractionDigits: 1 });

export const CATEGORY_LABELS: Record<Category, string> = {
  LAND: 'زمین',
  APARTMENT: 'آپارتمان',
  VILLA: 'ویلایی',
  COMMERCIAL: 'تجاری',
};

export const TRANSACTION_LABELS: Record<Transaction, string> = {
  BUY: 'خرید',
  RENT: 'اجاره',
};

export const CATEGORY_SLUGS: Record<Category, string> = {
  LAND: 'land',
  APARTMENT: 'apartment',
  VILLA: 'villa',
  COMMERCIAL: 'commercial',
};

export const SLUG_CATEGORIES: Record<string, Category> = {
  land: 'LAND',
  apartment: 'APARTMENT',
  villa: 'VILLA',
  commercial: 'COMMERCIAL',
};

export const CATEGORIES_BY_TRANSACTION: Record<Transaction, Category[]> = {
  BUY: ['LAND', 'APARTMENT', 'VILLA', 'COMMERCIAL'],
  RENT: ['APARTMENT', 'VILLA', 'COMMERCIAL'],
};

export function faNum(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === '') return '—';
  const parsed = Number(value);
  return Number.isFinite(parsed) ? numberFormatter.format(parsed) : '—';
}

export function compactToman(value: number | string | null | undefined): string {
  const amount = Number(value ?? 0);
  if (!Number.isFinite(amount) || amount <= 0) return 'توافقی';
  if (amount >= 1_000_000_000) return `${decimalFormatter.format(amount / 1_000_000_000)} میلیارد تومان`;
  if (amount >= 1_000_000) return `${decimalFormatter.format(amount / 1_000_000)} میلیون تومان`;
  if (amount >= 1_000) return `${decimalFormatter.format(amount / 1_000)} هزار تومان`;
  return `${numberFormatter.format(amount)} تومان`;
}

export function toman(value: number | string | null | undefined): string {
  return `${faNum(value)} تومان`;
}

export function faDate(iso: string | null | undefined): string {
  if (!iso) return '—';
  return new Intl.DateTimeFormat('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' }).format(
    new Date(iso),
  );
}

export function faDateTime(iso: string | null | undefined): string {
  if (!iso) return '—';
  return new Intl.DateTimeFormat('fa-IR', {
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso));
}

export function faRelative(iso: string): string {
  const diffSeconds = Math.round((Date.now() - new Date(iso).getTime()) / 1000);
  if (diffSeconds < 60) return 'همین حالا';
  if (diffSeconds < 3600) return `${faNum(Math.round(diffSeconds / 60))} دقیقه پیش`;
  if (diffSeconds < 86_400) return `${faNum(Math.round(diffSeconds / 3600))} ساعت پیش`;
  if (diffSeconds < 2_592_000) return `${faNum(Math.round(diffSeconds / 86_400))} روز پیش`;
  return faDate(iso);
}

export function chartDayLabel(date: string): string {
  return new Intl.DateTimeFormat('fa-IR', { month: 'short', day: 'numeric' }).format(
    new Date(`${date}T00:00:00`),
  );
}

export function chartMonthLabel(date: string): string {
  return new Intl.DateTimeFormat('fa-IR', { month: 'long' }).format(new Date(`${date}T00:00:00`));
}

export function propertyLocation(property: Pick<Property, 'city' | 'neighborhood'>): string {
  const parts = [property.city, property.neighborhood].filter((part) => part && part.trim().length > 0);
  return parts.length > 0 ? parts.join('، ') : 'موقعیت ثبت نشده';
}

export function landTotalValue(property: Pick<Property, 'landArea' | 'pricePerMeter'>): number {
  return Number(property.landArea ?? 0) * Number(property.pricePerMeter ?? 0);
}

export function propertyPrice(property: Property): { primary: string; secondary: string } {
  if (property.category === 'LAND') {
    return {
      primary: compactToman(landTotalValue(property)),
      secondary: `هر متر ${compactToman(property.pricePerMeter)}`,
    };
  }
  if (property.transactionType === 'RENT') {
    const deposit = Number(property.deposit ?? 0);
    return {
      primary: deposit > 0 ? `رهن ${compactToman(deposit)}` : 'بدون رهن',
      secondary: `اجاره ماهانه ${compactToman(property.monthlyRent)}`,
    };
  }
  return { primary: compactToman(property.salePrice), secondary: '' };
}

export function propertyArea(property: Property): string {
  if (property.category === 'LAND') return `${faNum(property.landArea)} متر`;
  return `${faNum(property.area)} متر`;
}

export function propertyPath(property: Pick<Property, 'id'>): string {
  return `/property/${property.id}`;
}

export function listingPath(transaction: Transaction, category?: Category): string {
  const base = transaction === 'BUY' ? '/buy' : '/rent';
  return category ? `${base}/${CATEGORY_SLUGS[category]}` : base;
}

export function instagramUrl(handle: string): string {
  if (/^https?:\/\//i.test(handle)) return handle;
  return `https://instagram.com/${handle.replace(/^@/, '')}`;
}

export function phoneHref(value: string): string {
  return `tel:${value.replace(/[\s-]/g, '')}`;
}
