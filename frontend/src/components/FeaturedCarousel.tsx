import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent, PointerEvent } from 'react';
import { PropertyCard } from './PropertyCard';
import { ChevronLeftIcon, ChevronRightIcon } from '../icons';
import { Reveal } from './ui/Reveal';
import { EmptyState } from './ui/EmptyState';
import type { Property } from '../lib/types';

export function FeaturedCarousel({ properties }: { properties: Property[] }) {
  const scroller = useRef<HTMLDivElement | null>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const drag = useRef({ active: false, startX: 0, startScroll: 0, moved: false });

  const updateBounds = () => {
    const element = scroller.current;
    if (!element) return;
    const position = Math.abs(element.scrollLeft);
    const max = Math.max(0, element.scrollWidth - element.clientWidth);
    setAtStart(position < 8);
    setAtEnd(position > max - 8);
  };

  useEffect(() => {
    updateBounds();
    const element = scroller.current;
    element?.addEventListener('scroll', updateBounds, { passive: true });
    window.addEventListener('resize', updateBounds);
    return () => {
      element?.removeEventListener('scroll', updateBounds);
      window.removeEventListener('resize', updateBounds);
    };
  }, [properties.length]);

  const step = () => {
    const element = scroller.current;
    if (!element) return 360;
    const card = element.querySelector<HTMLElement>('[data-card]');
    return (card?.offsetWidth ?? 360) + 20;
  };

  const move = (direction: 1 | -1) => {
    const element = scroller.current;
    if (!element) return;
    // In RTL, moving forward through the list means scrolling to a negative offset.
    element.scrollBy({ left: direction * step(), behavior: 'smooth' });
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      move(-1);
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      move(1);
    }
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse') return;
    const element = scroller.current;
    if (!element) return;
    drag.current = {
      active: true,
      startX: event.clientX,
      startScroll: element.scrollLeft,
      moved: false,
    };
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const element = scroller.current;
    if (!element || !drag.current.active) return;
    const delta = event.clientX - drag.current.startX;
    if (Math.abs(delta) > 5) drag.current.moved = true;
    element.scrollLeft = drag.current.startScroll + delta;
  };

  const endDrag = () => {
    drag.current.active = false;
    window.setTimeout(() => {
      drag.current.moved = false;
    }, 60);
  };

  if (properties.length === 0) {
    return (
      <EmptyState
        title="هنوز ملکی به عنوان پیشنهاد ویژه انتخاب نشده است"
        description="مدیر سایت می‌تواند از پنل مدیریت، آگهی‌های شاخص را به این بخش اضافه کند."
      />
    );
  }

  return (
    <div>
      <div className="mb-7 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => move(1)}
          disabled={atStart}
          aria-label="ملک‌های قبلی"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-navy-900/15 text-navy-700 transition hover:border-navy-900 hover:bg-navy-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-navy-900/15 disabled:hover:bg-transparent disabled:hover:text-navy-700"
        >
          <ChevronRightIcon className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => move(-1)}
          disabled={atEnd}
          aria-label="ملک‌های بعدی"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-navy-900/15 text-navy-700 transition hover:border-navy-900 hover:bg-navy-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-navy-900/15 disabled:hover:bg-transparent disabled:hover:text-navy-700"
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </button>
      </div>

      <div
        ref={scroller}
        role="region"
        aria-label="املاک پیشنهادی ویژه"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onClickCapture={(event) => {
          if (drag.current.moved) {
            event.preventDefault();
            event.stopPropagation();
          }
        }}
        className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-5 pb-4 sm:-mx-8 sm:px-8"
      >
        {properties.map((property, index) => (
          <Reveal
            key={property.id}
            delay={Math.min(index, 3) * 70}
            className="w-[82vw] shrink-0 snap-start sm:w-[360px] lg:w-[390px]"
          >
            <div data-card className="h-full">
              <PropertyCard property={property} />
            </div>
          </Reveal>
        ))}
      </div>
      <p className="mt-3 text-[11px] text-navy-400">
        برای جابه‌جایی، بکشید یا با کلیدهای جهت‌دار حرکت کنید.
      </p>
    </div>
  );
}
