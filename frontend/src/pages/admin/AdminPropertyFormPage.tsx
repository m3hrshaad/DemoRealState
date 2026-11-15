import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../../lib/api';
import {
  AdminPageHeader,
  Field,
  ImageManager,
  Input,
  Panel,
  Select,
  SingleImageInput,
  Switch,
  TagInput,
  Textarea,
} from '../../components/admin/AdminUI';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';
import {
  ArrowLeftIcon,
  BuildingIcon,
  ExternalIcon,
  HomeIcon,
  LandIcon,
  PlusIcon,
  StoreIcon,
} from '../../icons';
import { CATEGORIES_BY_TRANSACTION, CATEGORY_LABELS, TRANSACTION_LABELS, compactToman } from '../../lib/format';
import type { Category, Property, Transaction } from '../../lib/types';

type Draft = {
  code: string;
  title: string;
  city: string;
  neighborhood: string;
  address: string;
  area: string;
  landArea: string;
  buildYear: string;
  unitsCount: string;
  floor: string;
  roomsCount: string;
  pricePerMeter: string;
  salePrice: string;
  deposit: string;
  monthlyRent: string;
  hasStorage: boolean;
  hasElevator: boolean;
  hasParking: boolean;
  isOnLand: boolean;
  isSubdivided: boolean;
  hasWaterWell: boolean;
  hasElectricity: boolean;
  hasWater: boolean;
  hasGas: boolean;
  features: string[];
  amenities: string[];
  images: string[];
  description: string;
  agentName: string;
  agentTitle: string;
  agentPhone: string;
  agentPhoto: string;
  isFeatured: boolean;
  isPublished: boolean;
};

const EMPTY_DRAFT: Draft = {
  code: '',
  title: '',
  city: 'تهران',
  neighborhood: '',
  address: '',
  area: '',
  landArea: '',
  buildYear: '',
  unitsCount: '',
  floor: '',
  roomsCount: '',
  pricePerMeter: '',
  salePrice: '',
  deposit: '',
  monthlyRent: '',
  hasStorage: false,
  hasElevator: false,
  hasParking: false,
  isOnLand: false,
  isSubdivided: false,
  hasWaterWell: false,
  hasElectricity: false,
  hasWater: false,
  hasGas: false,
  features: [],
  amenities: [],
  images: [],
  description: '',
  agentName: '',
  agentTitle: '',
  agentPhone: '',
  agentPhoto: '',
  isFeatured: false,
  isPublished: true,
};

const CATEGORY_META: Record<Category, { icon: typeof LandIcon; hint: string }> = {
  LAND: { icon: LandIcon, hint: 'متراژ، ارزش هر متر و انشعابات' },
  APARTMENT: { icon: BuildingIcon, hint: 'متراژ، اتاق، طبقه و امکانات' },
  VILLA: { icon: HomeIcon, hint: 'متراژ، زمین، اتاق و پارکینگ' },
  COMMERCIAL: { icon: StoreIcon, hint: 'متراژ، طبقه و کاربری تجاری' },
};

const digits = (value: string) => value.replace(/[^\d۰-۹٠-٩]/g, '');
const toNumber = (value: string) => (value.trim() === '' ? null : Number(value));
const text = (value: string | null) => value ?? '';

function toDraft(property: Property): Draft {
  return {
    code: property.code,
    title: property.title,
    city: text(property.city),
    neighborhood: text(property.neighborhood),
    address: text(property.address),
    area: property.area?.toString() ?? '',
    landArea: property.landArea?.toString() ?? '',
    buildYear: property.buildYear?.toString() ?? '',
    unitsCount: property.unitsCount?.toString() ?? '',
    floor: property.floor?.toString() ?? '',
    roomsCount: property.roomsCount?.toString() ?? '',
    pricePerMeter: property.pricePerMeter?.toString() ?? '',
    salePrice: property.salePrice?.toString() ?? '',
    deposit: property.deposit?.toString() ?? '',
    monthlyRent: property.monthlyRent?.toString() ?? '',
    hasStorage: property.hasStorage,
    hasElevator: property.hasElevator,
    hasParking: property.hasParking,
    isOnLand: Boolean(property.isOnLand),
    isSubdivided: Boolean(property.isSubdivided),
    hasWaterWell: Boolean(property.hasWaterWell),
    hasElectricity: Boolean(property.hasElectricity),
    hasWater: Boolean(property.hasWater),
    hasGas: Boolean(property.hasGas),
    features: property.features ?? [],
    amenities: property.amenities ?? [],
    images: property.images ?? [],
    description: text(property.description),
    agentName: text(property.agentName),
    agentTitle: text(property.agentTitle),
    agentPhone: text(property.agentPhone),
    agentPhoto: text(property.agentPhoto),
    isFeatured: property.isFeatured,
    isPublished: property.isPublished,
  };
}

function MoneyField({
  id,
  label,
  value,
  onChange,
  hint,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
}) {
  return (
    <Field label={label} htmlFor={id} hint={hint}>
      <Input
        id={id}
        value={value}
        onChange={(event) => onChange(digits(event.target.value))}
        inputMode="numeric"
        dir="ltr"
        placeholder="۰"
      />
      {value ? <p className="mt-1 text-[10.5px] text-champagne-700">{compactToman(Number(value))}</p> : null}
    </Field>
  );
}

export function AdminPropertyFormPage({ transaction }: { transaction: Transaction }) {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { notify } = useToast();

  const [record, setRecord] = useState<Property | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const effectiveTransaction: Transaction = record?.transactionType ?? transaction;
  const base = effectiveTransaction === 'BUY' ? '/admin/buy' : '/admin/rent';

  useEffect(() => {
    if (!id) {
      setRecord(null);
      setCategory(null);
      setDraft(EMPTY_DRAFT);
      setLoading(false);
      return undefined;
    }

    let active = true;
    setLoading(true);
    setError(null);
    api
      .get<{ property: Property }>(`/admin/properties/${id}`)
      .then(({ property }) => {
        if (!active) return;
        setRecord(property);
        setCategory(property.category);
        setDraft(toDraft(property));
      })
      .catch((loadError) => {
        if (active) setError(loadError instanceof Error ? loadError.message : 'دریافت آگهی انجام نشد.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  const update = <K extends keyof Draft>(key: K, value: Draft[K]) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!category) {
      setError('دسته‌بندی ملک را انتخاب کنید.');
      return;
    }
    if (!draft.title.trim() || !draft.code.trim()) {
      setError('عنوان آگهی و کد ملک الزامی است.');
      return;
    }
    if (draft.images.length === 0) {
      setError('حداقل یک تصویر برای آگهی اضافه کنید.');
      return;
    }

    const isLand = category === 'LAND';
    const isApartment = category === 'APARTMENT';
    const isVilla = category === 'VILLA';
    const isCommercial = category === 'COMMERCIAL';

    const showUnits = isApartment || ((isVilla || isCommercial) && effectiveTransaction === 'BUY');
    const showFloor = isApartment || isCommercial || (isVilla && effectiveTransaction === 'BUY');
    const showRooms = isApartment || isVilla;
    const showStorage = isApartment || isVilla;
    const showParking = isApartment || isVilla;
    const showElevator = isApartment;

    const payload: Record<string, unknown> = {
      transactionType: effectiveTransaction,
      category,
      code: draft.code,
      title: draft.title,
      city: draft.city,
      neighborhood: draft.neighborhood,
      address: draft.address,
      description: draft.description,
      images: draft.images,
      agentName: draft.agentName,
      agentTitle: draft.agentTitle,
      agentPhone: draft.agentPhone,
      agentPhoto: draft.agentPhoto,
      isFeatured: draft.isFeatured,
      isPublished: draft.isPublished,
    };

    if (isLand) {
      Object.assign(payload, {
        landArea: toNumber(draft.landArea),
        pricePerMeter: toNumber(draft.pricePerMeter),
        isOnLand: draft.isOnLand,
        isSubdivided: draft.isSubdivided,
        hasWaterWell: draft.hasWaterWell,
        hasElectricity: draft.hasElectricity,
        hasWater: draft.hasWater,
        hasGas: draft.hasGas,
        area: null,
        buildYear: null,
        unitsCount: null,
        floor: null,
        roomsCount: null,
        hasStorage: false,
        hasElevator: false,
        hasParking: false,
        salePrice: null,
        deposit: null,
        monthlyRent: null,
        features: [],
        amenities: [],
      });
    } else {
      Object.assign(payload, {
        area: toNumber(draft.area),
        buildYear: toNumber(draft.buildYear),
        landArea: isVilla ? toNumber(draft.landArea) : null,
        pricePerMeter: null,
        isOnLand: null,
        isSubdivided: null,
        hasWaterWell: null,
        hasElectricity: null,
        hasWater: null,
        hasGas: null,
        unitsCount: showUnits ? toNumber(draft.unitsCount) : null,
        floor: showFloor ? toNumber(draft.floor) : null,
        roomsCount: showRooms ? toNumber(draft.roomsCount) : null,
        hasStorage: showStorage ? draft.hasStorage : false,
        hasElevator: showElevator ? draft.hasElevator : false,
        hasParking: showParking ? draft.hasParking : false,
        features: draft.features,
        amenities: draft.amenities,
      });

      if (effectiveTransaction === 'BUY') {
        Object.assign(payload, { salePrice: toNumber(draft.salePrice), deposit: null, monthlyRent: null });
      } else {
        Object.assign(payload, {
          salePrice: null,
          deposit: toNumber(draft.deposit) ?? 0,
          monthlyRent: toNumber(draft.monthlyRent),
        });
      }
    }

    setSaving(true);
    try {
      if (isEdit && id) {
        await api.put(`/admin/properties/${id}`, payload);
        notify('تغییرات آگهی ذخیره شد.');
      } else {
        await api.post('/admin/properties', payload);
        notify('آگهی جدید ثبت شد.');
      }
      navigate(base);
    } catch (saveError) {
      const message = saveError instanceof Error ? saveError.message : 'ذخیره آگهی انجام نشد.';
      setError(message);
      notify(message, 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-10 w-52 animate-pulse rounded bg-white" />
        <div className="h-64 animate-pulse rounded-2xl bg-white" />
        <div className="h-64 animate-pulse rounded-2xl bg-white" />
      </div>
    );
  }

  if (error && isEdit && !record) {
    return (
      <Panel>
        <p className="text-[13px] text-red-700">{error}</p>
        <Link to={base} className="mt-4 inline-flex items-center gap-1.5 text-[12px] text-navy-700">
          <ArrowLeftIcon className="h-4 w-4" />
          بازگشت به لیست آگهی‌ها
        </Link>
      </Panel>
    );
  }

  if (!isEdit && !category) {
    const categories = CATEGORIES_BY_TRANSACTION[transaction];
    return (
      <>
        <AdminPageHeader
          title={`آگهی جدید — ${TRANSACTION_LABELS[transaction]}`}
          description="برای شروع، دسته‌بندی ملک را انتخاب کنید تا فرم مناسب نمایش داده شود."
          actions={
            <Link
              to={transaction === 'BUY' ? '/admin/buy' : '/admin/rent'}
              className="inline-flex items-center gap-1.5 rounded-full border border-navy-900/15 px-4 py-2 text-[11.5px] text-navy-600 transition hover:border-navy-900"
            >
              بازگشت
            </Link>
          }
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((item) => {
            const Icon = CATEGORY_META[item].icon;
            return (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className="group rounded-2xl border border-navy-900/10 bg-white p-6 text-right transition hover:-translate-y-0.5 hover:border-champagne-500 hover:shadow-soft"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-ivory text-champagne-700 transition group-hover:bg-champagne-500 group-hover:text-navy-900">
                  <Icon className="h-5 w-5" />
                </span>
                <p className="mt-4 text-[14px] font-bold text-navy-900">
                  {TRANSACTION_LABELS[transaction]} {CATEGORY_LABELS[item]}
                </p>
                <p className="mt-1.5 text-[10.5px] leading-5 text-navy-400">{CATEGORY_META[item].hint}</p>
              </button>
            );
          })}
        </div>
      </>
    );
  }

  const activeCategory = category ?? 'APARTMENT';
  const isLand = activeCategory === 'LAND';
  const isApartment = activeCategory === 'APARTMENT';
  const isVilla = activeCategory === 'VILLA';
  const isCommercial = activeCategory === 'COMMERCIAL';
  const showUnits = isApartment || ((isVilla || isCommercial) && effectiveTransaction === 'BUY');
  const showFloor = isApartment || isCommercial || (isVilla && effectiveTransaction === 'BUY');
  const showRooms = isApartment || isVilla;
  const showStorage = isApartment || isVilla;
  const showParking = isApartment || isVilla;
  const showElevator = isApartment;
  const categories = CATEGORIES_BY_TRANSACTION[effectiveTransaction];

  return (
    <>
      <AdminPageHeader
        title={isEdit ? `ویرایش آگهی ${record?.code ?? ''}` : `آگهی جدید — ${TRANSACTION_LABELS[effectiveTransaction]}`}
        description={`${CATEGORY_LABELS[activeCategory]} · فقط فیلدهای مرتبط با این دسته‌بندی نمایش داده می‌شود.`}
        actions={
          <>
            {isEdit && record?.isPublished ? (
              <Link
                to={`/property/${record.id}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-navy-900/15 px-4 py-2 text-[11.5px] text-navy-600 transition hover:border-champagne-500"
              >
                مشاهده صفحه
                <ExternalIcon className="h-3.5 w-3.5" />
              </Link>
            ) : null}
            <Link
              to={base}
              className="rounded-full border border-navy-900/15 px-4 py-2 text-[11.5px] text-navy-600 transition hover:border-navy-900"
            >
              بازگشت
            </Link>
            <Button type="submit" form="property-form" size="sm" disabled={saving}>
              {saving ? 'در حال ذخیره…' : isEdit ? 'ذخیره تغییرات' : 'ثبت آگهی'}
            </Button>
          </>
        }
      />

      {error ? (
        <p role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[12px] text-red-700">
          {error}
        </p>
      ) : null}

      <form id="property-form" onSubmit={submit} className="space-y-5">
        <Panel title="اطلاعات اصلی" description="عنوان و موقعیت آگهی">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Field label="عنوان آگهی" htmlFor="title" required>
                <Input
                  id="title"
                  value={draft.title}
                  onChange={(event) => update('title', event.target.value)}
                  placeholder="مثلاً آپارتمان ۱۴۰ متری در جردن"
                />
              </Field>
            </div>
            <Field label="کد ملک" htmlFor="code" required hint="برای هر آگهی یکتا باشد.">
              <Input
                id="code"
                value={draft.code}
                onChange={(event) => update('code', event.target.value)}
                dir="ltr"
                placeholder="AP-1404"
              />
            </Field>
            <Field label="دسته‌بندی" htmlFor="category" required>
              <Select
                id="category"
                value={activeCategory}
                onChange={(event) => setCategory(event.target.value as Category)}
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {CATEGORY_LABELS[item]}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="شهر" htmlFor="city">
              <Input id="city" value={draft.city} onChange={(event) => update('city', event.target.value)} />
            </Field>
            <Field label="محله" htmlFor="neighborhood">
              <Input
                id="neighborhood"
                value={draft.neighborhood}
                onChange={(event) => update('neighborhood', event.target.value)}
                placeholder="مثلاً زعفرانیه"
              />
            </Field>
            <div className="sm:col-span-2">
              <Field label="نشانی" htmlFor="address">
                <Input id="address" value={draft.address} onChange={(event) => update('address', event.target.value)} />
              </Field>
            </div>
          </div>
        </Panel>

        <Panel title="مشخصات ملک" description="فیلدهای مرتبط با دسته‌بندی انتخاب‌شده">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {isLand ? (
              <>
                <Field label="متراژ زمین" htmlFor="landArea" required>
                  <Input
                    id="landArea"
                    value={draft.landArea}
                    onChange={(event) => update('landArea', digits(event.target.value))}
                    inputMode="numeric"
                    dir="ltr"
                  />
                </Field>
                <Field label="سال ساخت" htmlFor="buildYear">
                  <Input
                    id="buildYear"
                    value={draft.buildYear}
                    onChange={(event) => update('buildYear', digits(event.target.value))}
                    inputMode="numeric"
                    dir="ltr"
                  />
                </Field>
              </>
            ) : (
              <>
                <Field label={isCommercial ? 'متراژ ملک' : 'متراژ'} htmlFor="area" required>
                  <Input
                    id="area"
                    value={draft.area}
                    onChange={(event) => update('area', digits(event.target.value))}
                    inputMode="numeric"
                    dir="ltr"
                  />
                </Field>
                {isVilla ? (
                  <Field label="متراژ زمین" htmlFor="landArea" hint="اختیاری">
                    <Input
                      id="landArea"
                      value={draft.landArea}
                      onChange={(event) => update('landArea', digits(event.target.value))}
                      inputMode="numeric"
                      dir="ltr"
                    />
                  </Field>
                ) : null}
                <Field label="سال ساخت" htmlFor="buildYear">
                  <Input
                    id="buildYear"
                    value={draft.buildYear}
                    onChange={(event) => update('buildYear', digits(event.target.value))}
                    inputMode="numeric"
                    dir="ltr"
                  />
                </Field>
                {showUnits ? (
                  <Field label="تعداد واحد" htmlFor="unitsCount" hint={isApartment ? undefined : 'در صورت کاربرد'}>
                    <Input
                      id="unitsCount"
                      value={draft.unitsCount}
                      onChange={(event) => update('unitsCount', digits(event.target.value))}
                      inputMode="numeric"
                      dir="ltr"
                    />
                  </Field>
                ) : null}
                {showFloor ? (
                  <Field label="طبقه واحد" htmlFor="floor" hint="برای همکف مقدار ۰ را وارد کنید.">
                    <Input
                      id="floor"
                      value={draft.floor}
                      onChange={(event) => update('floor', digits(event.target.value))}
                      inputMode="numeric"
                      dir="ltr"
                    />
                  </Field>
                ) : null}
                {showRooms ? (
                  <Field label="تعداد اتاق" htmlFor="rooms">
                    <Input
                      id="rooms"
                      value={draft.roomsCount}
                      onChange={(event) => update('roomsCount', digits(event.target.value))}
                      inputMode="numeric"
                      dir="ltr"
                    />
                  </Field>
                ) : null}
              </>
            )}
          </div>

          <div className="mt-6 grid gap-5 border-t border-navy-900/8 pt-5 sm:grid-cols-2">
            {isLand ? (
              <>
                <Switch checked={draft.isOnLand} onChange={(value) => update('isOnLand', value)} label="بر زمین" />
                <Switch
                  checked={draft.isSubdivided}
                  onChange={(value) => update('isSubdivided', value)}
                  label="تفکیک"
                />
                <Switch
                  checked={draft.hasWaterWell}
                  onChange={(value) => update('hasWaterWell', value)}
                  label="چاه آب"
                />
                <Switch
                  checked={draft.hasElectricity}
                  onChange={(value) => update('hasElectricity', value)}
                  label="انشعابات برق"
                />
                <Switch checked={draft.hasWater} onChange={(value) => update('hasWater', value)} label="انشعابات آب" />
                <Switch checked={draft.hasGas} onChange={(value) => update('hasGas', value)} label="انشعابات گاز" />
              </>
            ) : (
              <>
                {showStorage ? (
                  <Switch checked={draft.hasStorage} onChange={(value) => update('hasStorage', value)} label="انباری" />
                ) : null}
                {showElevator ? (
                  <Switch
                    checked={draft.hasElevator}
                    onChange={(value) => update('hasElevator', value)}
                    label="آسانسور"
                  />
                ) : null}
                {showParking ? (
                  <Switch checked={draft.hasParking} onChange={(value) => update('hasParking', value)} label="پارکینگ" />
                ) : null}
              </>
            )}
          </div>
        </Panel>

        <Panel title="اطلاعات معامله" description={TRANSACTION_LABELS[effectiveTransaction]}>
          <div className="grid gap-4 sm:grid-cols-2">
            {isLand ? (
              <MoneyField
                id="pricePerMeter"
                label="ارزش هر متر (تومان)"
                value={draft.pricePerMeter}
                onChange={(value) => update('pricePerMeter', value)}
                hint="قیمت کل به‌صورت خودکار از متراژ × ارزش هر متر محاسبه می‌شود."
              />
            ) : effectiveTransaction === 'BUY' ? (
              <MoneyField
                id="salePrice"
                label="قیمت فروش (تومان)"
                value={draft.salePrice}
                onChange={(value) => update('salePrice', value)}
              />
            ) : (
              <>
                <MoneyField
                  id="deposit"
                  label="مبلغ پیش‌پرداخت / رهن (تومان)"
                  value={draft.deposit}
                  onChange={(value) => update('deposit', value)}
                  hint="در صورت بدون رهن بودن، خالی بگذارید."
                />
                <MoneyField
                  id="monthlyRent"
                  label="مبلغ اجاره ماهانه (تومان)"
                  value={draft.monthlyRent}
                  onChange={(value) => update('monthlyRent', value)}
                />
              </>
            )}
          </div>
        </Panel>

        {!isLand ? (
          <Panel title="ویژگی‌ها و امکانات">
            <div className="grid gap-4 sm:grid-cols-2">
              <TagInput
                label="ویژگی‌های اصلی"
                value={draft.features}
                onChange={(value) => update('features', value)}
                placeholder="مثلاً نورگیری جنوبی"
              />
              <TagInput
                label="امکانات رفاهی"
                value={draft.amenities}
                onChange={(value) => update('amenities', value)}
                placeholder="مثلاً استخر"
              />
            </div>
          </Panel>
        ) : null}

        <Panel title="توضیحات">
          <Textarea
            value={draft.description}
            onChange={(event) => update('description', event.target.value)}
            placeholder="توضیحات کامل ملک را وارد کنید."
            aria-label="توضیحات"
          />
        </Panel>

        <Panel title="تصاویر">
          <ImageManager images={draft.images} onChange={(images) => update('images', images)} />
        </Panel>

        <Panel title="اطلاعات مشاور املاک">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="نام مشاور" htmlFor="agentName">
              <Input
                id="agentName"
                value={draft.agentName}
                onChange={(event) => update('agentName', event.target.value)}
              />
            </Field>
            <Field label="سمت مشاور" htmlFor="agentTitle">
              <Input
                id="agentTitle"
                value={draft.agentTitle}
                onChange={(event) => update('agentTitle', event.target.value)}
                placeholder="مثلاً مشاور ارشد فروش"
              />
            </Field>
            <Field label="شماره تماس مشاور" htmlFor="agentPhone" hint="در صورت خالی بودن، دکمه تماس پیام درخواست ثبت می‌کند.">
              <Input
                id="agentPhone"
                value={draft.agentPhone}
                onChange={(event) => update('agentPhone', digits(event.target.value))}
                inputMode="tel"
                dir="ltr"
              />
            </Field>
            <SingleImageInput
              label="تصویر مشاور"
              value={draft.agentPhoto}
              onChange={(value) => update('agentPhoto', value)}
            />
          </div>
        </Panel>

        <Panel title="انتشار و نمایش">
          <div className="grid gap-5 sm:grid-cols-2">
            <Switch
              checked={draft.isPublished}
              onChange={(value) => update('isPublished', value)}
              label="انتشار آگهی"
              description="آگهی منتشرنشده در سایت نمایش داده نمی‌شود."
            />
            <Switch
              checked={draft.isFeatured}
              onChange={(value) => update('isFeatured', value)}
              label="پیشنهاد ویژه"
              description="نمایش در بخش «املاک منتخب» صفحه اصلی."
            />
          </div>
        </Panel>

        <div className="flex flex-wrap items-center justify-end gap-2 pb-4">
          <Link
            to={base}
            className="rounded-full border border-navy-900/15 px-5 py-2.5 text-[11.5px] text-navy-600 transition hover:border-navy-900"
          >
            انصراف
          </Link>
          <Button type="submit" disabled={saving}>
            {saving ? 'در حال ذخیره…' : isEdit ? 'ذخیره تغییرات' : 'ثبت آگهی'}
            {!saving ? <PlusIcon className="h-4 w-4" /> : null}
          </Button>
        </div>
      </form>
    </>
  );
}
