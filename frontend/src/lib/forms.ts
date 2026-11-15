const PERSIAN_DIGITS = '۰۱۲۳۴۵۶۷۸۹';
const ARABIC_DIGITS = '٠١٢٣٤٥٦٧٨٩';

export function normalizeDigits(value: string): string {
  return value.replace(/[۰-۹٠-٩]/g, (character) => {
    const persianIndex = PERSIAN_DIGITS.indexOf(character);
    if (persianIndex >= 0) return String(persianIndex);
    return String(ARABIC_DIGITS.indexOf(character));
  });
}

export function isIranianMobile(value: string): boolean {
  return /^09\d{9}$/.test(normalizeDigits(value).replace(/[\s-]/g, ''));
}

export function digitsOnly(value: string): string {
  return normalizeDigits(value).replace(/[^\d]/g, '');
}

export function faIndex(value: number): string {
  return new Intl.NumberFormat('fa-IR', { minimumIntegerDigits: 2, useGrouping: false }).format(value);
}
