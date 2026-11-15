import { useState } from 'react';
import { api } from '../lib/api';
import { isIranianMobile, normalizeDigits } from '../lib/forms';
import { Button } from './ui/Button';
import { CheckIcon } from '../icons';

export type InquiryType = 'CALL' | 'VISIT' | 'INFO';

type InquiryFormProps = {
  propertyId?: string;
  type?: InquiryType;
  onSuccess?: () => void;
  submitLabel?: string;
};

export function InquiryForm({ propertyId, type = 'INFO', onSuccess, submitLabel = 'ارسال درخواست' }: InquiryFormProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (name.trim().length < 3) {
      setError('نام و نام خانوادگی را کامل وارد کنید.');
      return;
    }
    if (!isIranianMobile(phone)) {
      setError('شماره موبایل باید ۱۱ رقم و با ۰۹ شروع شود.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/inquiries', {
        propertyId,
        type,
        name: name.trim(),
        phone: normalizeDigits(phone).replace(/[\s-]/g, ''),
        message: message.trim(),
      });
      setDone(true);
      onSuccess?.();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'ارسال درخواست انجام نشد.');
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center">
        <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-emerald-600 text-white">
          <CheckIcon className="h-5 w-5" />
        </span>
        <p className="mt-4 text-sm font-semibold text-emerald-900">درخواست شما ثبت شد</p>
        <p className="mt-2 text-[12px] leading-6 text-emerald-800">
          کارشناسان ما در اولین فرصت با شما تماس می‌گیرند.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`inquiry-name-${type}`} className="field-label">
            نام و نام خانوادگی
          </label>
          <input
            id={`inquiry-name-${type}`}
            className="field-input"
            value={name}
            onChange={(event) => setName(event.target.value)}
            autoComplete="name"
            placeholder="مثلاً سارا احمدی"
            required
          />
        </div>
        <div>
          <label htmlFor={`inquiry-phone-${type}`} className="field-label">
            شماره موبایل
          </label>
          <input
            id={`inquiry-phone-${type}`}
            className="field-input"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            inputMode="tel"
            autoComplete="tel"
            placeholder="۰۹۱۲۳۴۵۶۷۸۹"
            dir="ltr"
            required
          />
        </div>
      </div>
      <div>
        <label htmlFor={`inquiry-message-${type}`} className="field-label">
          توضیحات <span className="font-normal text-navy-400">(اختیاری)</span>
        </label>
        <textarea
          id={`inquiry-message-${type}`}
          className="field-input min-h-[104px] resize-y"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="زمان مناسب برای بازدید یا سؤال خود را بنویسید."
          maxLength={1000}
        />
      </div>
      {error ? (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-[12px] text-red-700">
          {error}
        </p>
      ) : null}
      <Button type="submit" disabled={loading} className="w-full sm:w-auto">
        {loading ? 'در حال ارسال…' : submitLabel}
      </Button>
      <p className="text-[10.5px] leading-5 text-navy-400">
        اطلاعات شما فقط برای پاسخ‌گویی به همین درخواست استفاده می‌شود.
      </p>
    </form>
  );
}
