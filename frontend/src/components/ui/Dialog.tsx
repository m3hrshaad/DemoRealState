import { useEffect, useId } from 'react';
import type { ReactNode } from 'react';
import { CloseIcon } from '../../icons';

type DialogProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  bare?: boolean;
};

const sizes = { sm: 'max-w-md', md: 'max-w-xl', lg: 'max-w-3xl' };

export function Dialog({ open, onClose, title, children, size = 'md', bare = false }: DialogProps) {
  const titleId = useId();

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-navy-950/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        className={`relative z-10 w-full ${sizes[size]} ${
          bare ? '' : 'max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-lift sm:p-8'
        }`}
      >
        {!bare ? (
          <div className="mb-6 flex items-start justify-between gap-4">
            {title ? (
              <h2 id={titleId} className="text-lg font-bold text-navy-900">
                {title}
              </h2>
            ) : (
              <span />
            )}
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-navy-400 transition hover:bg-navy-50 hover:text-navy-900"
              aria-label="بستن"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>
        ) : null}
        {children}
      </div>
    </div>
  );
}
