import { useEffect, useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon, ExpandIcon } from '../icons';

type GalleryProps = { images: string[]; title: string };

export function PropertyGallery({ images, title }: GalleryProps) {
  const [active, setActive] = useState(0);
  const [viewer, setViewer] = useState(false);
  const safeImages = images.length > 0 ? images : ['/images/hero.jpg'];

  useEffect(() => {
    if (!viewer) return undefined;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setViewer(false);
      if (event.key === 'ArrowLeft') setActive((index) => (index + 1) % safeImages.length);
      if (event.key === 'ArrowRight') {
        setActive((index) => (index - 1 + safeImages.length) % safeImages.length);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [viewer, safeImages.length]);

  return (
    <>
      <div className="relative overflow-hidden rounded-2xl bg-navy-900">
        <button
          type="button"
          onClick={() => setViewer(true)}
          className="group block w-full"
          aria-label={`نمایش تمام‌صفحه تصویر ${active + 1}`}
        >
          <img
            src={safeImages[active]}
            alt={`${title} — تصویر ${active + 1}`}
            className="aspect-[16/10] w-full object-cover transition duration-700 group-hover:scale-[1.015]"
          />
        </button>
        <div className="pointer-events-none absolute inset-x-4 bottom-4 flex items-center justify-between">
          <span className="rounded-full bg-navy-950/70 px-3 py-1 text-[10.5px] text-white backdrop-blur">
            {active + 1} / {safeImages.length}
          </span>
          <button
            type="button"
            onClick={() => setViewer(true)}
            className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-navy-900 transition hover:bg-white"
            aria-label="نمایش تصویر در اندازه کامل"
          >
            <ExpandIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {safeImages.length > 1 ? (
        <div className="mt-3 grid grid-cols-4 gap-2.5 sm:grid-cols-5 lg:grid-cols-6">
          {safeImages.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`تصویر ${index + 1}`}
              aria-pressed={index === active}
              className={`overflow-hidden rounded-lg border-2 transition ${
                index === active ? 'border-champagne-500' : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <img src={image} alt="" loading="lazy" className="aspect-[4/3] w-full object-cover" />
            </button>
          ))}
        </div>
      ) : null}

      {viewer ? (
        <div className="fixed inset-0 z-[85] flex flex-col bg-navy-950/95 p-4">
          <div className="flex items-center justify-between text-white">
            <span className="text-[11px] text-white/60">
              {active + 1} از {safeImages.length}
            </span>
            <button
              type="button"
              onClick={() => setViewer(false)}
              aria-label="بستن نمایش تصویر"
              className="rounded-full border border-white/20 p-2 transition hover:bg-white hover:text-navy-900"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>
          <div className="relative flex flex-1 items-center justify-center">
            <button
              type="button"
              onClick={() => setActive((index) => (index - 1 + safeImages.length) % safeImages.length)}
              aria-label="تصویر قبلی"
              className="absolute right-2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white hover:text-navy-900 sm:right-6"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
            <img
              src={safeImages[active]}
              alt={`${title} — تصویر ${active + 1}`}
              className="max-h-[76vh] w-auto max-w-full rounded-lg object-contain"
            />
            <button
              type="button"
              onClick={() => setActive((index) => (index + 1) % safeImages.length)}
              aria-label="تصویر بعدی"
              className="absolute left-2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white hover:text-navy-900 sm:left-6"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
