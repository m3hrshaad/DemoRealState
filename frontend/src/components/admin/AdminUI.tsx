import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { useId, useRef, useState } from 'react';
import { api } from '../../lib/api';
import { useToast } from '../ui/Toast';
import { CloseIcon, ImageIcon, PlusIcon, UploadIcon } from '../../icons';

export function AdminPageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-xl font-bold text-navy-900 sm:text-2xl">{title}</h1>
        {description ? <p className="mt-1.5 text-[12px] leading-6 text-navy-400">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}

export function Panel({
  title,
  description,
  actions,
  children,
  className = '',
}: {
  title?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`admin-card ${className}`}>
      {title || actions ? (
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            {title ? <h2 className="text-[14px] font-bold text-navy-900">{title}</h2> : null}
            {description ? <p className="mt-1 text-[11px] leading-5 text-navy-400">{description}</p> : null}
          </div>
          {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}

export function Field({
  label,
  hint,
  htmlFor,
  required = false,
  children,
}: {
  label: string;
  hint?: string;
  htmlFor?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="field-label">
        {label}
        {required ? <span className="text-champagne-600"> *</span> : null}
      </label>
      {children}
      {hint ? <p className="field-hint">{hint}</p> : null}
    </div>
  );
}

export function Input({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`field-input ${className}`} {...props} />;
}

export function Textarea({ className = '', ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={`field-input min-h-[110px] resize-y leading-7 ${className}`} {...props} />;
}

export function Select({ className = '', children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={`field-input ${className}`} {...props}>
      {children}
    </select>
  );
}

export function Switch({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
  description?: string;
}) {
  const id = useId();
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p id={id} className="text-[12.5px] font-medium text-navy-800">
          {label}
        </p>
        {description ? <p className="mt-1 text-[10.5px] leading-5 text-navy-400">{description}</p> : null}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={id}
        onClick={() => onChange(!checked)}
        className={`flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition ${
          checked ? 'justify-end bg-navy-900' : 'justify-start bg-navy-200'
        }`}
      >
        <span className="h-5 w-5 rounded-full bg-white shadow transition" />
      </button>
    </div>
  );
}

export function TagInput({
  value,
  onChange,
  label,
  hint,
  placeholder,
}: {
  value: string[];
  onChange: (value: string[]) => void;
  label: string;
  hint?: string;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState('');

  const add = () => {
    const items = draft
      .split(/[,،]/)
      .map((item) => item.trim())
      .filter((item) => item.length > 0 && !value.includes(item));
    if (items.length > 0) onChange([...value, ...items]);
    setDraft('');
  };

  return (
    <div>
      <span className="field-label">{label}</span>
      <div className="rounded-xl border border-navy-900/12 bg-white p-2.5">
        {value.length > 0 ? (
          <div className="mb-2 flex flex-wrap gap-1.5">
            {value.map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-1.5 rounded-full bg-ivory px-2.5 py-1 text-[11px] text-navy-700"
              >
                {item}
                <button
                  type="button"
                  onClick={() => onChange(value.filter((entry) => entry !== item))}
                  aria-label={`حذف ${item}`}
                  className="text-navy-400 transition hover:text-red-600"
                >
                  <CloseIcon className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        ) : null}
        <div className="flex items-center gap-2">
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ',') {
                event.preventDefault();
                add();
              }
              if (event.key === 'Backspace' && draft.length === 0 && value.length > 0) {
                onChange(value.slice(0, -1));
              }
            }}
            onBlur={add}
            placeholder={placeholder ?? 'بنویسید و Enter بزنید'}
            className="min-w-0 flex-1 bg-transparent px-1.5 py-1 text-[12.5px] outline-none placeholder:text-navy-300"
          />
          <button
            type="button"
            onClick={add}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-navy-900/10 text-navy-500 transition hover:border-champagne-500 hover:text-champagne-700"
            aria-label="افزودن"
          >
            <PlusIcon className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      {hint ? <p className="field-hint">{hint}</p> : null}
    </div>
  );
}

async function uploadFile(file: File): Promise<string> {
  return api.upload(file);
}

export function SingleImageInput({
  value,
  onChange,
  label,
  hint,
}: {
  value: string;
  onChange: (value: string) => void;
  label: string;
  hint?: string;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [busy, setBusy] = useState(false);
  const { notify } = useToast();

  const handleUpload = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true);
    try {
      const url = await uploadFile(file);
      onChange(url);
      notify('تصویر بارگذاری شد.');
    } catch (error) {
      notify(error instanceof Error ? error.message : 'بارگذاری تصویر انجام نشد.', 'error');
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div>
      <span className="field-label">{label}</span>
      <div className="flex items-start gap-3">
        <div className="h-20 w-24 shrink-0 overflow-hidden rounded-lg border border-navy-900/10 bg-ivory">
          {value ? (
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-navy-300">
              <ImageIcon className="h-6 w-6" />
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <input
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="/images/hero.jpg یا آدرس تصویر"
            dir="ltr"
            className="field-input py-2 text-[11px]"
          />
          <div className="flex flex-wrap items-center gap-2">
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => void handleUpload(event.target.files?.[0])}
            />
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={busy}
              className="inline-flex items-center gap-1.5 rounded-full border border-navy-900/15 px-3 py-1.5 text-[11px] text-navy-700 transition hover:border-champagne-500 disabled:opacity-50"
            >
              <UploadIcon className="h-3.5 w-3.5" />
              {busy ? 'در حال بارگذاری…' : 'بارگذاری تصویر'}
            </button>
            {value ? (
              <button
                type="button"
                onClick={() => onChange('')}
                className="text-[10.5px] text-navy-400 transition hover:text-red-600"
              >
                حذف
              </button>
            ) : null}
          </div>
          {hint ? <p className="field-hint">{hint}</p> : null}
        </div>
      </div>
    </div>
  );
}

export function ImageManager({
  images,
  onChange,
}: {
  images: string[];
  onChange: (images: string[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [url, setUrl] = useState('');
  const [busy, setBusy] = useState(false);
  const { notify } = useToast();

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setBusy(true);
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        uploaded.push(await uploadFile(file));
      }
      onChange([...images, ...uploaded]);
      notify(uploaded.length > 1 ? 'تصاویر بارگذاری شدند.' : 'تصویر بارگذاری شد.');
    } catch (error) {
      notify(error instanceof Error ? error.message : 'بارگذاری تصویر انجام نشد.', 'error');
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="field-label mb-0">تصاویر ملک</span>
        <span className="text-[10.5px] text-navy-400">اولین تصویر، تصویر اصلی آگهی است.</span>
      </div>

      {images.length > 0 ? (
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((image, index) => (
            <div key={`${image}-${index}`} className="group relative overflow-hidden rounded-xl border border-navy-900/10">
              <img src={image} alt="" className="aspect-[4/3] w-full object-cover" />
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 bg-navy-950/70 px-2 py-1.5 backdrop-blur">
                {index === 0 ? (
                  <span className="text-[9.5px] text-champagne-300">تصویر اصلی</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      const next = [...images];
                      const [picked] = next.splice(index, 1);
                      next.unshift(picked);
                      onChange(next);
                    }}
                    className="text-[9.5px] text-white/80 transition hover:text-white"
                  >
                    اصلی شود
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onChange(images.filter((_, itemIndex) => itemIndex !== index))}
                  className="text-[9.5px] text-white/70 transition hover:text-red-300"
                  aria-label="حذف تصویر"
                >
                  حذف
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-3 rounded-xl border border-dashed border-navy-900/15 p-4 text-center text-[11.5px] text-navy-400">
          هنوز تصویری اضافه نشده است.
        </p>
      )}

      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(event) => void handleFiles(event.target.files)}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-navy-900/15 px-4 py-2.5 text-[11.5px] text-navy-700 transition hover:border-champagne-500 disabled:opacity-50"
        >
          <UploadIcon className="h-4 w-4" />
          {busy ? 'در حال بارگذاری…' : 'بارگذاری تصویر'}
        </button>
        <div className="flex flex-1 gap-2">
          <input
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="افزودن با آدرس تصویر"
            dir="ltr"
            className="field-input py-2 text-[11px]"
          />
          <button
            type="button"
            aria-label="افزودن تصویر با آدرس"
            onClick={() => {
              const trimmed = url.trim();
              if (!trimmed) return;
              onChange([...images, trimmed]);
              setUrl('');
            }}
            className="shrink-0 rounded-xl bg-navy-900 px-4 text-[11px] text-white transition hover:bg-navy-800"
          >
            افزودن
          </button>
        </div>
      </div>
    </div>
  );
}
