import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { useSite } from '../SiteProvider';
import { Brand, LogoMark } from '../Brand';
import {
  CloseIcon,
  CompassIcon,
  DashboardIcon,
  ExternalIcon,
  HomeIcon,
  InfoIcon,
  KeyIcon,
  LogOutIcon,
  MenuIcon,
  PhoneIcon,
  SettingsIcon,
  UsersIcon,
} from '../../icons';

const NAV_ITEMS = [
  { to: '/admin', label: 'داشبورد', icon: DashboardIcon, end: true },
  { to: '/admin/about', label: 'مدیریت درباره ما', icon: InfoIcon },
  { to: '/admin/contact', label: 'مدیریت تماس با ما', icon: PhoneIcon },
  { to: '/admin/team', label: 'مدیریت تیم ما', icon: UsersIcon },
  { to: '/admin/buy', label: 'مدیریت خرید', icon: HomeIcon },
  { to: '/admin/rent', label: 'مدیریت اجاره', icon: KeyIcon },
  { to: '/admin/services', label: 'مدیریت خدمات', icon: CompassIcon },
  { to: '/admin/settings', label: 'تنظیمات سایت', icon: SettingsIcon },
];

const TITLES: Record<string, string> = {
  '/admin': 'داشبورد',
  '/admin/about': 'مدیریت درباره ما',
  '/admin/contact': 'مدیریت تماس با ما',
  '/admin/team': 'مدیریت تیم ما',
  '/admin/buy': 'مدیریت خرید',
  '/admin/rent': 'مدیریت اجاره',
  '/admin/services': 'مدیریت خدمات',
  '/admin/settings': 'تنظیمات سایت',
};

export function AdminLayout() {
  const { settings } = useSite();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    api
      .get<{ user: { email: string } }>('/auth/me')
      .then((data) => setEmail(data.user.email))
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const pageTitle =
    TITLES[location.pathname] ??
    (location.pathname.startsWith('/admin/buy')
      ? 'مدیریت خرید'
      : location.pathname.startsWith('/admin/rent')
        ? 'مدیریت اجاره'
        : 'پنل مدیریت');

  const today = new Intl.DateTimeFormat('fa-IR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date());

  const logout = async () => {
    setLoggingOut(true);
    try {
      await api.post('/auth/logout');
    } finally {
      setLoggingOut(false);
      navigate('/admin/login', { replace: true });
    }
  };

  const sidebar = (
    <div className="flex h-full flex-col bg-white">
      <div className="flex h-[76px] items-center justify-between border-b border-navy-900/8 px-5">
        <Link to="/admin" aria-label="داشبورد">
          <Brand settings={settings} tone="dark" size="sm" />
        </Link>
        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          aria-label="بستن منو"
          className="rounded-full p-2 text-navy-500 lg:hidden"
        >
          <CloseIcon className="h-5 w-5" />
        </button>
      </div>

      <nav aria-label="منوی مدیریت" className="flex-1 overflow-y-auto px-3 py-5">
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[12.5px] transition ${
                      isActive
                        ? 'bg-navy-900 font-medium text-white'
                        : 'text-navy-600 hover:bg-ivory hover:text-navy-900'
                    }`
                  }
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-navy-900/8 p-3">
        <button
          type="button"
          onClick={() => void logout()}
          disabled={loggingOut}
          className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-[12.5px] text-red-600 transition hover:bg-red-50 disabled:opacity-50"
        >
          <LogOutIcon className="h-4 w-4" />
          {loggingOut ? 'در حال خروج…' : 'خروج از حساب'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F4F6F8]" dir="rtl">
      <aside className="fixed inset-y-0 right-0 z-40 hidden w-[264px] border-l border-navy-900/8 lg:block">
        {sidebar}
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-navy-950/60" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 right-0 w-[280px] max-w-[86%] shadow-lift">{sidebar}</div>
        </div>
      ) : null}

      <div className="lg:mr-[264px]">
        <header className="sticky top-0 z-30 border-b border-navy-900/8 bg-white/95 backdrop-blur">
          <div className="flex h-[76px] items-center justify-between gap-3 px-4 sm:px-6">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                aria-label="باز کردن منو"
                className="rounded-lg border border-navy-900/10 p-2 text-navy-700 lg:hidden"
              >
                <MenuIcon className="h-5 w-5" />
              </button>
              <div>
                <p className="text-[14px] font-bold text-navy-900">{pageTitle}</p>
                <p className="mt-0.5 hidden text-[10.5px] text-navy-400 sm:block">{today}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/"
                className="hidden items-center gap-1.5 rounded-full border border-navy-900/12 px-3.5 py-2 text-[11px] text-navy-600 transition hover:border-champagne-500 hover:text-champagne-700 sm:inline-flex"
              >
                مشاهده سایت
                <ExternalIcon className="h-3.5 w-3.5" />
              </Link>
              <div className="flex items-center gap-2 rounded-full bg-ivory px-3 py-1.5">
                <span className="text-champagne-700">
                  <LogoMark className="h-6 w-6" />
                </span>
                <span className="hidden text-[10.5px] text-navy-600 sm:block" dir="ltr">
                  {email}
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1240px] px-4 py-6 sm:px-6 sm:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
