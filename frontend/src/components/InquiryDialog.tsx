import { useEffect, useState } from 'react';
import { Dialog } from './ui/Dialog';
import { InquiryForm, type InquiryType } from './InquiryForm';
import type { Property } from '../lib/types';

const TITLES: Record<InquiryType, string> = {
  CALL: 'تماس با مشاور',
  VISIT: 'درخواست بازدید',
  INFO: 'دریافت اطلاعات بیشتر',
};

type InquiryDialogProps = {
  open: boolean;
  onClose: () => void;
  property?: Property;
  type?: InquiryType;
};

export function InquiryDialog({ open, onClose, property, type = 'INFO' }: InquiryDialogProps) {
  const [activeType, setActiveType] = useState<InquiryType>(type);

  useEffect(() => {
    if (open) setActiveType(type);
  }, [open, type]);

  const resolvedType = activeType;

  return (
    <Dialog
      open={open}
      onClose={() => {
        setActiveType(type);
        onClose();
      }}
      title={TITLES[resolvedType]}
    >
      {property ? (
        <div className="mb-5 rounded-xl border border-navy-900/8 bg-ivory p-4">
          <p className="text-[13px] font-semibold text-navy-900">{property.title}</p>
          <p className="mt-1 text-[11px] text-navy-500">کد ملک: {property.code}</p>
        </div>
      ) : (
        <p className="mb-5 text-[13px] leading-7 text-navy-500">
          فرم زیر را تکمیل کنید؛ کارشناسان ما در اولین فرصت با شما تماس می‌گیرند.
        </p>
      )}

      <div className="mb-5 flex flex-wrap gap-2" role="group" aria-label="نوع درخواست">
        {(Object.keys(TITLES) as InquiryType[]).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setActiveType(option)}
            aria-pressed={resolvedType === option}
            className={`rounded-full border px-3.5 py-1.5 text-[11px] transition ${
              resolvedType === option
                ? 'border-navy-900 bg-navy-900 text-white'
                : 'border-navy-900/15 text-navy-600 hover:border-navy-900/40'
            }`}
          >
            {TITLES[option]}
          </button>
        ))}
      </div>

      <InquiryForm key={`${property?.id ?? 'general'}-${resolvedType}`} propertyId={property?.id} type={resolvedType} />
    </Dialog>
  );
}
