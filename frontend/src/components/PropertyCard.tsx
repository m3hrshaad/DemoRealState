import { Link } from 'react-router-dom';
import { ArrowLeftIcon, BedIcon, CalendarIcon, MapPinIcon, RulerIcon, StarIcon } from '../icons';
import {
  CATEGORY_LABELS,
  TRANSACTION_LABELS,
  faNum,
  propertyArea,
  propertyLocation,
  propertyPath,
  propertyPrice,
} from '../lib/format';
import type { Property } from '../lib/types';

export function PropertyCard({ property }: { property: Property }) {
  const price = propertyPrice(property);
  const image = property.images[0] ?? '/images/hero.jpg';

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-navy-900/8 bg-white transition duration-500 hover:-translate-y-1 hover:shadow-lift">
      <Link
        to={propertyPath(property)}
        className="relative block aspect-[4/3] overflow-hidden bg-sand"
        tabIndex={-1}
        aria-hidden="true"
      >
        <img
          src={image}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.05]"
        />
        <span className="absolute inset-0 bg-gradient-to-t from-navy-950/45 via-transparent to-transparent" />
        <span className="absolute inset-x-3.5 top-3.5 flex items-center justify-between gap-2">
          <span className="rounded-full bg-white/95 px-3 py-1 text-[10px] font-medium text-navy-800 backdrop-blur">
            {CATEGORY_LABELS[property.category]}
          </span>
          <span className="rounded-full bg-navy-950/65 px-3 py-1 text-[10px] font-medium text-white backdrop-blur">
            {TRANSACTION_LABELS[property.transactionType]}
          </span>
        </span>
        {property.isFeatured ? (
          <span className="absolute bottom-3.5 right-3.5 inline-flex items-center gap-1 rounded-full bg-champagne-500/95 px-2.5 py-1 text-[9.5px] font-medium text-navy-900">
            <StarIcon className="h-3 w-3" />
            پیشنهاد ویژه
          </span>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <p className="flex items-center gap-1.5 text-[11px] text-navy-400">
          <MapPinIcon className="h-3.5 w-3.5 text-champagne-600" />
          {propertyLocation(property)}
        </p>
        <h3 className="mt-2 text-[14.5px] font-bold leading-7 text-navy-900">
          <Link to={propertyPath(property)} className="transition hover:text-champagne-700">
            {property.title}
          </Link>
        </h3>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-navy-500">
          <span className="inline-flex items-center gap-1.5">
            <RulerIcon className="h-3.5 w-3.5" />
            {propertyArea(property)}
          </span>
          {property.category !== 'LAND' && property.roomsCount ? (
            <span className="inline-flex items-center gap-1.5">
              <BedIcon className="h-3.5 w-3.5" />
              {faNum(property.roomsCount)} اتاق
            </span>
          ) : null}
          {property.buildYear ? (
            <span className="inline-flex items-center gap-1.5">
              <CalendarIcon className="h-3.5 w-3.5" />
              ساخت {faNum(property.buildYear)}
            </span>
          ) : null}
        </div>

        <div className="mt-4 flex items-end justify-between gap-3 border-t border-navy-900/8 pt-4">
          <div>
            <p className="text-[13px] font-bold text-navy-900">{price.primary}</p>
            {price.secondary ? <p className="mt-1 text-[10.5px] text-navy-400">{price.secondary}</p> : null}
          </div>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-navy-900/12 text-navy-500 transition duration-300 group-hover:border-champagne-500 group-hover:bg-champagne-500 group-hover:text-navy-900">
            <ArrowLeftIcon className="h-4 w-4" />
          </span>
        </div>
      </div>
    </article>
  );
}

export function PropertyCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-navy-900/8 bg-white">
      <div className="aspect-[4/3] animate-pulse bg-sand" />
      <div className="space-y-3 p-5">
        <div className="h-3 w-1/3 animate-pulse rounded bg-sand" />
        <div className="h-4 w-4/5 animate-pulse rounded bg-sand" />
        <div className="h-3 w-2/3 animate-pulse rounded bg-sand" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-sand" />
      </div>
    </div>
  );
}
