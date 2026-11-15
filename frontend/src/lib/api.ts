import seedData from '../data/mock-data.json';

/**
 * Frontend-only demo API.
 * All records are loaded from mock-data.json and changes are persisted in localStorage.
 * No backend server, database, or network API is required.
 */
export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

type Options = { method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'; body?: unknown };
type DemoState = {
  properties: any[];
  settings: Record<string, any>;
  team: any[];
  services: any[];
  inquiries: any[];
  activity: any[];
};

const STORAGE_KEY = 'amlak-frontend-demo-v1';
const AUTH_KEY = 'amlak-frontend-demo-auth';
const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

function readState(): DemoState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved) as DemoState;
  } catch {
    // If browser storage is unavailable or invalid, fall back to the bundled fixtures.
  }
  return clone(seedData as DemoState);
}

let state = readState();
function persist() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* demo still works in memory */ }
}
function activity(kind: string, message: string, propertyId: string | null = null) {
  state.activity.unshift({ id: `activity-${Date.now()}`, kind, message, propertyId, createdAt: new Date().toISOString() });
  state.activity = state.activity.slice(0, 30);
}
function ok<T>(value: T): T { return clone(value); }
function makeId(prefix: string) { return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`; }
function overview() {
  const published = state.properties.filter((p) => p.isPublished);
  const totalViews = state.properties.reduce((sum, p) => sum + (Number(p.views) || 0), 0);
  const chart = (count: number, prefix: string) => Array.from({ length: count }, (_, i) => ({
    date: prefix === 'ماه' ? `2026-${String(i + 6).padStart(2, '0')}-01` : `2026-11-${String(prefix === 'روز' ? i + 9 : i + 1).padStart(2, '0')}`, value: Math.max(4, Math.round(totalViews / (count * 2) + Math.sin(i * 1.7) * 18 + i * 2)),
  }));
  const inquiries = state.inquiries.map((item) => ({
    ...item,
    propertyTitle: state.properties.find((p) => p.id === item.propertyId)?.title ?? null,
  }));
  return {
    stats: {
      daily: { value: 38, previous: 31, change: 23 },
      weekly: { value: 246, previous: 218, change: 13 },
      monthly: { value: 984, previous: 876, change: 12 },
    },
    charts: { daily: chart(7, 'روز'), weekly: chart(8, 'هفته'), monthly: chart(6, 'ماه') },
    mostViewed: ok([...state.properties].sort((a, b) => (b.views || 0) - (a.views || 0))[0] ?? null),
    counts: {
      properties: state.properties.length,
      published: published.length,
      featured: state.properties.filter((p) => p.isFeatured).length,
      newInquiries: state.inquiries.filter((i) => i.status === 'NEW').length,
      team: state.team.filter((m) => m.isVisible !== false).length,
    },
    activity: ok(state.activity), inquiries: ok(inquiries),
  };
}

async function request<T>(path: string, options: Options = {}): Promise<T> {
  const method = options.method ?? 'GET';
  const body = (options.body ?? {}) as Record<string, any>;
  const [pathname, query = ''] = path.split('?');
  const params = new URLSearchParams(query);

  if (method === 'GET' && pathname === '/site') {
    return ok({ settings: state.settings, services: state.services.filter((x) => x.isVisible !== false), team: state.team.filter((x) => x.isVisible !== false) }) as T;
  }
  if (method === 'GET' && pathname === '/properties/featured') {
    return ok({ items: state.properties.filter((p) => p.isPublished && p.isFeatured).slice(0, 6) }) as T;
  }
  if (method === 'GET' && pathname === '/properties') {
    let items = state.properties.filter((p) => p.isPublished);
    const transaction = params.get('transaction');
    const category = params.get('category');
    const q = (params.get('q') ?? '').trim().toLocaleLowerCase();
    if (transaction) items = items.filter((p) => p.transactionType === transaction);
    if (category) items = items.filter((p) => p.category === category);
    if (q) items = items.filter((p) => `${p.title} ${p.code} ${p.city ?? ''} ${p.neighborhood ?? ''} ${p.address ?? ''}`.toLocaleLowerCase().includes(q));
    const minArea = Number(params.get('minArea') || 0), maxArea = Number(params.get('maxArea') || 0);
    if (minArea) items = items.filter((p) => Number(p.area ?? p.landArea ?? 0) >= minArea);
    if (maxArea) items = items.filter((p) => Number(p.area ?? p.landArea ?? 0) <= maxArea);
    const priceOf = (p: any) => Number(p.salePrice ?? p.monthlyRent ?? p.deposit ?? p.pricePerMeter ?? 0);
    const minPrice = Number(params.get('minPrice') || 0), maxPrice = Number(params.get('maxPrice') || 0);
    if (minPrice) items = items.filter((p) => priceOf(p) >= minPrice);
    if (maxPrice) items = items.filter((p) => priceOf(p) <= maxPrice);
    const rooms = Number(params.get('rooms') || 0);
    if (rooms) items = items.filter((p) => Number(p.roomsCount || 0) >= rooms);
    switch (params.get('sort')) {
      case 'price_asc': items.sort((a, b) => priceOf(a) - priceOf(b)); break;
      case 'price_desc': items.sort((a, b) => priceOf(b) - priceOf(a)); break;
      case 'area_desc': items.sort((a, b) => Number(b.area ?? b.landArea ?? 0) - Number(a.area ?? a.landArea ?? 0)); break;
      default: items.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
    }
    const total = items.length;
    const page = Math.max(1, Number(params.get('page') || 1));
    const limit = Math.max(1, Number(params.get('limit') || 9));
    return ok({ items: items.slice((page - 1) * limit, page * limit), total, page, limit, pages: Math.max(1, Math.ceil(total / limit)) }) as T;
  }
  const publicProperty = pathname.match(/^\/properties\/([^/]+)$/);
  if (method === 'GET' && publicProperty) {
    const property = state.properties.find((p) => p.id === decodeURIComponent(publicProperty[1]) && p.isPublished);
    if (!property) throw new ApiError('ملک موردنظر پیدا نشد.', 404);
    const related = state.properties.filter((p) => p.id !== property.id && p.isPublished && (p.category === property.category || p.transactionType === property.transactionType)).slice(0, 3);
    return ok({ property, related }) as T;
  }
  const viewMatch = pathname.match(/^\/properties\/([^/]+)\/view$/);
  if (method === 'POST' && viewMatch) {
    const property = state.properties.find((p) => p.id === decodeURIComponent(viewMatch[1]));
    if (property) property.views = (Number(property.views) || 0) + 1;
    persist(); return ok({ success: true }) as T;
  }
  if (pathname === '/auth/me' && method === 'GET') {
    if (localStorage.getItem(AUTH_KEY) !== 'true') throw new ApiError('برای مشاهده این بخش وارد شوید.', 401);
    return ok({ user: { email: 'admin@amlak.local', role: 'ADMIN' } }) as T;
  }
  if (pathname === '/auth/login' && method === 'POST') {
    if (String(body.email).toLowerCase() !== 'admin@amlak.local' || body.password !== 'admin1234') {
      throw new ApiError('ایمیل یا رمز عبور صحیح نیست. از اطلاعات ورود نمونه استفاده کنید.', 401);
    }
    localStorage.setItem(AUTH_KEY, 'true');
    return ok({ user: { email: 'admin@amlak.local', role: 'ADMIN' } }) as T;
  }
  if (pathname === '/auth/logout' && method === 'POST') {
    localStorage.removeItem(AUTH_KEY);
    return undefined as T;
  }
  if (method === 'GET' && pathname === '/admin/overview') return ok(overview()) as T;
  if (method === 'GET' && pathname === '/admin/properties') {
    let items = [...state.properties];
    const transaction = params.get('transaction');
    const category = params.get('category');
    const status = params.get('status');
    const q = (params.get('q') ?? '').trim().toLocaleLowerCase();
    if (transaction) items = items.filter((p) => p.transactionType === transaction);
    if (category) items = items.filter((p) => p.category === category);
    if (status === 'published') items = items.filter((p) => p.isPublished);
    if (status === 'draft') items = items.filter((p) => !p.isPublished);
    if (q) items = items.filter((p) => `${p.title} ${p.code} ${p.neighborhood ?? ''} ${p.city ?? ''}`.toLocaleLowerCase().includes(q));
    const total = items.length;
    const page = Math.max(1, Number(params.get('page') || 1));
    const limit = Math.max(1, Number(params.get('limit') || 10));
    return ok({ items: items.slice((page - 1) * limit, page * limit), total, page, limit, pages: Math.max(1, Math.ceil(total / limit)) }) as T;
  }
  if (method === 'GET' && pathname === '/admin/team') return ok({ team: state.team }) as T;
  if (method === 'GET' && pathname === '/admin/services') return ok({ services: state.services }) as T;
  if (method === 'PUT' && pathname === '/admin/settings') {
    state.settings = { ...state.settings, ...body };
    activity('content_updated', 'تنظیمات و محتوای سایت به‌روزرسانی شد.');
    persist(); return ok({ settings: state.settings }) as T;
  }
  if (pathname === '/inquiries' && method === 'POST') {
    const item = { id: makeId('inquiry'), type: body.type ?? 'INFO', name: body.name ?? '', phone: body.phone ?? '', message: body.message ?? '', status: 'NEW', propertyId: body.propertyId ?? null, createdAt: new Date().toISOString() };
    state.inquiries.unshift(item); activity('inquiry', `درخواست جدید از ${item.name} ثبت شد.`, item.propertyId); persist();
    return ok({ inquiry: item, message: 'درخواست شما با موفقیت ثبت شد.' }) as T;
  }

  const propertyMatch = pathname.match(/^\/admin\/properties\/([^/]+)$/);
  if (propertyMatch) {
    const index = state.properties.findIndex((p) => p.id === decodeURIComponent(propertyMatch[1]));
    if (index < 0) throw new ApiError('آگهی موردنظر پیدا نشد.', 404);
    else if (method === 'GET') return ok({ property: state.properties[index] }) as T;
    else if (method === 'PUT') {
      state.properties[index] = { ...state.properties[index], ...body, updatedAt: new Date().toISOString() };
      activity('property_updated', `آگهی «${state.properties[index].title}» ویرایش شد.`, state.properties[index].id); persist(); return ok(state.properties[index]) as T;
    } else if (method === 'PATCH') {
      state.properties[index] = { ...state.properties[index], ...body, updatedAt: new Date().toISOString() };
      activity('property_status', `وضعیت آگهی «${state.properties[index].title}» تغییر کرد.`, state.properties[index].id); persist(); return ok(state.properties[index]) as T;
    } else if (method === 'DELETE') {
      const [removed] = state.properties.splice(index, 1); activity('property_deleted', `آگهی «${removed.title}» حذف شد.`, removed.id); persist(); return undefined as T;
    }
  }
  if (pathname === '/admin/properties' && method === 'POST') {
    const item = { ...body, id: makeId('property'), code: body.code || `DEMO-${Date.now()}`, isPublished: body.isPublished ?? true, isFeatured: body.isFeatured ?? false, views: 0, images: body.images ?? [], features: body.features ?? [], amenities: body.amenities ?? [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    state.properties.unshift(item); activity('property_created', `آگهی «${item.code}» ثبت شد.`, item.id); persist(); return ok(item) as T;
  }

  const collectionMatch = pathname.match(/^\/admin\/(team|services)(?:\/([^/]+))?$/);
  if (collectionMatch) {
    const key = collectionMatch[1] === 'team' ? 'team' : 'services';
    const collection = state[key];
    const id = collectionMatch[2] ? decodeURIComponent(collectionMatch[2]) : null;
    if (method === 'POST' && !id) {
      const item = { ...body, id: makeId(key.slice(0, -1)), sortOrder: collection.length + 1, isVisible: true };
      collection.push(item); persist(); return ok(item) as T;
    }
    const index = collection.findIndex((x) => x.id === id);
    if (index < 0) throw new ApiError('مورد موردنظر پیدا نشد.', 404);
    if (method === 'PUT') { collection[index] = { ...collection[index], ...body }; persist(); return ok(collection[index]) as T; }
    if (method === 'DELETE') { collection.splice(index, 1); persist(); return undefined as T; }
  }
  throw new ApiError(`مسیر نمونه تعریف نشده است: ${method} ${pathname}`, 404);
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) => request<T>(path, { method: 'POST', body }),
  put: <T>(path: string, body?: unknown) => request<T>(path, { method: 'PUT', body }),
  patch: <T>(path: string, body?: unknown) => request<T>(path, { method: 'PATCH', body }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
  async upload(_file: File): Promise<string> {
    // Image upload is simulated: use a bundled demo image instead of a server upload.
    return '/images/apartment-1.jpg';
  },
};

export function queryString(params: Record<string, string | number | undefined | null>) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === '') continue;
    search.set(key, String(value));
  }
  const result = search.toString();
  return result ? `?${result}` : '';
}
