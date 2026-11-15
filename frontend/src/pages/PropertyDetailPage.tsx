import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PropertyGallery } from '../components/PropertyGallery';
import { PropertyCard } from '../components/PropertyCard';
import { InquiryDialog } from '../components/InquiryDialog';
import type { InquiryType } from '../components/InquiryForm';
import { Button, ButtonLink } from '../components/ui/Button';
import { ArrowLeftIcon, BuildingIcon, CheckIcon, MapPinIcon, PhoneIcon, StarIcon, UsersIcon } from '../icons';
import { api } from '../lib/api';
import {
  CATEGORY_LABELS,
  TRANSACTION_LABELS,
  compactToman,
  faDate,
  faNum,
  listingPath,
  phoneHref,
  propertyArea,
  propertyLocation,
  propertyPrice,
  toman,
} from '../lib/format';
import { getVisitorId } from '../lib/visitor';
import type { Property } from '../lib/types';

type Spec = { label: string; value: string };

const yesNo = (value: boolean | null) => (value ? 'دارد' : 'ندارد');

function buildSpecs(property: Property): Spec[] {
  if (property.category === 'LAND') {
    return [
      { label: 'کد زمین', value: property.code },
      { label: 'متراژ زمین', value: `${faNum(property.landArea)} متر` },
      { label: 'ارزش هر متر', value: toman(property.pricePerMeter) },
      { label: 'بر زمین', value: yesNo(property.isOnLand) },
      { label: 'تفکیک', value: yesNo(property.isSubdivided) },
      { label: 'چاه آب', value: yesNo(property.hasWaterWell) },
      { label: 'انشعابات برق', value: yesNo(property.hasElectricity) },
      { label: 'انشعابات آب', value: yesNo(property.hasWater) },
      { label: 'انشعابات گاز', value: yesNo(property.hasGas) },
    ];
  }

  const specs: Spec[] = [
    { label: 'کد ملک', value: property.code },
    { label: 'نوع ملک', value: CATEGORY_LABELS[property.category] },
    { label: 'متراژ', value: propertyArea(property) },
  ];

  if (property.landArea) specs.push({ label: 'متراژ زمین', value: `${faNum(property.landArea)} متر` });
  specs.push({ label: 'سال ساخت', value: property.buildYear ? faNum(property.buildYear) : '—' });

  if (property.category === 'APARTMENT') {
    specs.push({ label: 'تعداد واحد', value: faNum(property.unitsCount) });
    specs.push({ label: 'طبقه واحد', value: property.floor === 0 ? 'همکف' : faNum(property.floor) });
    specs.push({ label: 'تعداد اتاق', value: faNum(property.roomsCount) });
    specs.push({ label: 'انباری', value: yesNo(property.hasStorage) });
    specs.push({ label: 'آسانسور', value: yesNo(property.hasElevator) });
    specs.push({ label: 'پارکینگ', value: yesNo(property.hasParking) });
  }

  if (property.category === 'VILLA') {
    if (property.roomsCount) specs.push({ label: 'تعداد اتاق', value: faNum(property.roomsCount) });
    if (property.unitsCount) specs.push({ label: 'تعداد واحد', value: faNum(property.unitsCount) });
    specs.push({ label: 'انباری', value: yesNo(property.hasStorage) });
    specs.push({ label: 'پارکینگ', value: yesNo(property.hasParking) });
  }

  if (property.category === 'COMMERCIAL') {
    if (property.floor !== null) {
      specs.push({ label: 'طبقه واحد', value: property.floor === 0 ? 'همکف' : faNum(property.floor) });
    }
    if (property.unitsCount) specs.push({ label: 'تعداد واحد', value: faNum(property.unitsCount) });
  }

  return specs;
}

export function PropertyDetailPage() {
  const { id } = useParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [related, setRelated] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<InquiryType>('INFO');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    setProperty(null);

    api
      .get<{ property: Property; related: Property[] }>(`/properties/${id}`)
      .then((data) => {
        if (!active) return;
        setProperty(data.property);
        setRelated(data.related);
        void api
          .post(`/properties/${data.property.id}/view`, { visitorId: getVisitorId() })
          .catch(() => undefined);
      })
      .catch((loadError) => {
        if (active) setError(loadError instanceof Error ? loadError.message : 'دریافت اطلاعات ملک انجام نشد.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  const openInquiry = (type: InquiryType) => {
    setDialogType(type);
    setDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="shell pb-20 pt-32 lg:pt-36">
        <div className="h-4 w-56 animate-pulse rounded bg-sand" />
        <div className="mt-6 h-9 w-2/3 animate-pulse rounded bg-sand" />
        <div className="mt-8 aspect-[16/10] w-full animate-pulse rounded-2xl bg-sand" />
        <div className="mt-10 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          <div className="space-y-4">
            <div className="h-28 animate-pulse rounded-2xl bg-sand" />
            <div className="h-64 animate-pulse rounded-2xl bg-sand" />
          </div>
          <div className="h-64 animate-pulse rounded-2xl bg-sand" />
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <section className="shell flex min-h-[70vh] flex-col items-center justify-center py-32 text-center">
        <p className="eyebrow">خطای ۴۰۴</p>
        <h1 className="display-2 mt-4">این ملک در دسترس نیست</h1>
        <p className="body-text mt-4 max-w-md">{error ?? 'ممکن است آگهی حذف شده یا از انتشار خارج شده باشد.'}</p>
        <ButtonLink to="/buy" className="mt-8">
          مشاهده آگهی‌های خرید
          <ArrowLeftIcon className="h-4 w-4" />
        </ButtonLink>
      </section>
    );
  }

  const specs = buildSpecs(property);
  const price = propertyPrice(property);
  const isLand = property.category === 'LAND';
  const isRent = property.transactionType === 'RENT';
  const location = propertyLocation(property);
  const deposit = Number(property.deposit ?? 0);

  return (
    <>
      <div className="bg-white pb-16 pt-28 lg:pt-32">
        <div className="shell">
          <nav aria-label="مسیر صفحه" className="flex flex-wrap items-center gap-1.5 text-[11px] text-navy-400">
            <Link to="/" className="transition hover:text-navy-800">خانه</Link>
            <span>/</span>
            <Link to={listingPath(property.transactionType)} className="transition hover:text-navy-800">
              {TRANSACTION_LABELS[property.transactionType]}
            </Link>
            <span>/</span>
            <Link
              to={listingPath(property.transactionType, property.category)}
              className="transition hover:text-navy-800"
            >
              {CATEGORY_LABELS[property.category]}
            </Link>
            <span>/</span>
            <span className="line-clamp-1 max-w-[220px] text-navy-600">{property.title}</span>
          </nav>

          <div className="mt-6 flex flex-wrap items-start justify-between gap-5">
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-navy-900 px-3 py-1 text-[10px] text-white">
                  {TRANSACTION_LABELS[property.transactionType]}
                </span>
                <span className="rounded-full border border-champagne-500/50 px-3 py-1 text-[10px] text-champagne-700">
                  {CATEGORY_LABELS[property.category]}
                </span>
                {property.isFeatured ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-champagne-100 px-3 py-1 text-[10px] text-champagne-800">
                    <StarIcon className="h-3 w-3" />
                    پیشنهاد ویژه
                  </span>
                ) : null}
              </div>
              <h1 className="mt-4 text-[1.65rem] font-bold leading-[1.4] tracking-tight sm:text-3xl lg:text-[2.3rem]">
                {property.title}
              </h1>
              <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12px] text-navy-500">
                <span className="inline-flex items-center gap-1.5">
                  <MapPinIcon className="h-4 w-4 text-champagne-600" />
                  {location}
                </span>
                <span className="text-navy-300">|</span>
                <span>{faNum(property.views)} بازدید</span>
                <span className="text-navy-300">|</span>
                <span>ثبت {faDate(property.createdAt)}</span>
              </p>
            </div>
            <div className="rounded-xl border border-navy-900/10 px-4 py-3 text-left">
              <p className="text-[9.5px] text-navy-400">
                {isLand ? 'کد زمین' : 'کد ملک'}
              </p>
              <p className="mt-1 text-[13px] font-semibold text-navy-900" dir="ltr">
                {property.code}
              </p>
            </div>
          </div>

          <div className="mt-8">
            <PropertyGallery images={property.images} title={property.title} />
          </div>

          <div className="mt-10 grid items-start gap-8 lg:grid-cols-[1.65fr_1fr]">
            <div className="space-y-6">
              {/* price */}
              <div className="rounded-2xl border border-champagne-500/30 bg-ivory/80 p-5 sm:p-6">
                {isRent ? (
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <p className="text-[11px] text-navy-500">مبلغ پیش‌پرداخت / رهن</p>
                      <p className="mt-2 text-xl font-bold text-navy-900">
                        {deposit > 0 ? compactToman(deposit) : 'بدون رهن'}
                      </p>
                      {deposit > 0 ? (
                        <p className="mt-1 text-[10.5px] text-navy-400">{toman(deposit)}</p>
                      ) : null}
                    </div>
                    <div className="sm:border-r sm:border-navy-900/10 sm:pr-5">
                      <p className="text-[11px] text-navy-500">اجاره ماهانه</p>
                      <p className="mt-2 text-xl font-bold text-navy-900">{compactToman(property.monthlyRent)}</p>
                      <p className="mt-1 text-[10.5px] text-navy-400">{toman(property.monthlyRent)}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                      <p className="text-[11px] text-navy-500">
                        {isLand ? 'ارزش کل زمین' : 'قیمت فروش'}
                      </p>
                      <p className="mt-2 text-2xl font-bold text-navy-900">{price.primary}</p>
                      {isLand ? (
                        <p className="mt-1.5 text-[11px] text-navy-400">
                          ارزش هر متر: {toman(property.pricePerMeter)}
                        </p>
                      ) : (
                        <p className="mt-1.5 text-[10.5px] text-navy-400">{toman(property.salePrice)}</p>
                      )}
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] text-navy-400">
                        {isLand ? 'متراژ زمین' : 'قیمت هر متر'}
                      </p>
                      <p className="mt-1 text-[13px] font-semibold text-navy-800">
                        {isLand
                          ? `${faNum(property.landArea)} متر`
                          : compactToman(
                              property.area ? Math.round(Number(property.salePrice ?? 0) / property.area) : 0,
                            )}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* specs */}
              <div className="rounded-2xl border border-navy-900/10 p-5 sm:p-6">
                <h2 className="flex items-center gap-2 text-[15px] font-bold text-navy-900">
                  <BuildingIcon className="h-4 w-4 text-champagne-600" />
                  مشخصات ملک
                </h2>
                <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3">
                  {specs.map((spec) => (
                    <div key={spec.label}>
                      <dt className="text-[10.5px] text-navy-400">{spec.label}</dt>
                      <dd className="mt-1 text-[12.5px] font-medium text-navy-800">{spec.value}</dd>
                    </div>
                  ))}
                </dl>
                {property.address ? (
                  <p className="mt-6 flex items-start gap-2 border-t border-navy-900/8 pt-4 text-[11.5px] leading-6 text-navy-500">
                    <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0 text-champagne-600" />
                    {property.address}
                  </p>
                ) : null}
              </div>

              {property.features.length > 0 ? (
                <div className="rounded-2xl border border-navy-900/10 p-5 sm:p-6">
                  <h2 className="text-[15px] font-bold text-navy-900">ویژگی‌های اصلی</h2>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {property.features.map((feature) => (
                      <li
                        key={feature}
                        className="inline-flex items-center gap-1.5 rounded-full bg-ivory px-3 py-1.5 text-[11px] text-navy-700"
                      >
                        <CheckIcon className="h-3 w-3 text-champagne-600" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {property.amenities.length > 0 ? (
                <div className="rounded-2xl border border-navy-900/10 p-5 sm:p-6">
                  <h2 className="text-[15px] font-bold text-navy-900">امکانات رفاهی</h2>
                  <ul className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                    {property.amenities.map((amenity) => (
                      <li key={amenity} className="flex items-center gap-2 text-[11.5px] text-navy-600">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full border border-champagne-500/40 text-champagne-600">
                          <CheckIcon className="h-2.5 w-2.5" />
                        </span>
                        {amenity}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {property.description ? (
                <div className="rounded-2xl border border-navy-900/10 p-5 sm:p-6">
                  <h2 className="text-[15px] font-bold text-navy-900">توضیحات</h2>
                  <p className="mt-3 whitespace-pre-line text-[13px] leading-8 text-navy-600">{property.description}</p>
                </div>
              ) : null}
            </div>

            <aside className="space-y-5 lg:sticky lg:top-28">
              <div className="rounded-2xl border border-navy-900/10 p-5 sm:p-6">
                <div className="flex items-center gap-3">
                  {property.agentPhoto ? (
                    <img
                      src={property.agentPhoto}
                      alt={property.agentName ?? 'مشاور املاک'}
                      className="h-14 w-14 rounded-full object-cover"
                    />
                  ) : (
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-sand text-champagne-700">
                      <UsersIcon className="h-6 w-6" />
                    </span>
                  )}
                  <div>
                    <p className="text-[13.5px] font-bold text-navy-900">{property.agentName || 'مشاور املاک'}</p>
                    <p className="mt-0.5 text-[10.5px] text-navy-400">{property.agentTitle || 'مشاور این ملک'}</p>
                  </div>
                </div>

                {property.agentPhone ? (
                  <a
                    href={phoneHref(property.agentPhone)}
                    className="mt-5 flex items-center justify-center gap-2 rounded-full border border-navy-900/15 py-2.5 text-[12px] text-navy-800 transition hover:border-navy-900"
                  >
                    <PhoneIcon className="h-4 w-4 text-champagne-600" />
                    <span dir="ltr">{property.agentPhone}</span>
                  </a>
                ) : null}

                <div className="mt-4 space-y-2">
                  <Button className="w-full" onClick={() => openInquiry('CALL')}>
                    تماس با مشاور
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => openInquiry('VISIT')}>
                    درخواست بازدید
                  </Button>
                  <Button variant="ghost" className="w-full text-[12px]" onClick={() => openInquiry('INFO')}>
                    ارسال درخواست اطلاعات
                  </Button>
                </div>
                {!property.agentPhone ? (
                  <p className="mt-3 text-center text-[10px] leading-5 text-navy-400">
                    شماره تماس مستقیم مشاور از پنل مدیریت قابل ثبت است.
                  </p>
                ) : null}
              </div>

              <div className="rounded-2xl bg-navy-950 p-5 text-white sm:p-6">
                <p className="text-[10px] text-champagne-400">مشاوره اختصاصی</p>
                <p className="mt-2 text-[13.5px] font-semibold leading-7">
                  برای بررسی دقیق‌تر این ملک با ما گفت‌وگو کنید
                </p>
                <button
                  type="button"
                  onClick={() => openInquiry('INFO')}
                  className="mt-4 inline-flex items-center gap-2 text-[11.5px] text-champagne-300 transition hover:text-champagne-200"
                >
                  دریافت مشاوره
                  <ArrowLeftIcon className="h-3.5 w-3.5" />
                </button>
              </div>
            </aside>
          </div>
        </div>
      </div>

      {related.length > 0 ? (
        <section className="bg-ivory py-14 lg:py-16">
          <div className="shell">
            <div className="flex items-end justify-between gap-4">
              <div>
                <span className="eyebrow">پیشنهاد مرتبط</span>
                <h2 className="display-2 mt-3">ملک‌های مشابه</h2>
              </div>
              <Link
                to={listingPath(property.transactionType, property.category)}
                className="text-[12px] text-navy-600 transition hover:text-champagne-700"
              >
                مشاهده همه ←
              </Link>
            </div>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <PropertyCard key={item.id} property={item} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <InquiryDialog open={dialogOpen} onClose={() => setDialogOpen(false)} property={property} type={dialogType} />
    </>
  );
}
