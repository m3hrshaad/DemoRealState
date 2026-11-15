import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Brand } from './Brand';
import { useSite } from './SiteProvider';
import { ChevronDownIcon, CloseIcon, MenuIcon } from '../icons';
import { CATEGORY_LABELS, CATEGORY_SLUGS } from '../lib/format';
import type { Category, Transaction } from '../lib/types';

const buyCategories: Category[] = ['LAND', 'APARTMENT', 'VILLA', 'COMMERCIAL'];
const rentCategories: Category[] = ['APARTMENT', 'VILLA', 'COMMERCIAL'];

type DropdownProps = {
  label: string;
  transaction: Transaction;
  categories: Category[];
  active: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function NavDropdown({ label, transaction, categories, active, open, onOpenChange }: DropdownProps) {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const closeTimer = useRef<number | null>(null);

  const openSoon = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    onOpenChange(true);
  };
  const closeSoon = () => {
    closeTimer.current = window.setTimeout(() => onOpenChange(false), 160);
  };

  const focusFirstItem = () => {
    window.requestAnimationFrame(() => {
      menuRef.current?.querySelector<HTMLAnchorElement>('a')?.focus();
    });
  };

  const handleButtonKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      onOpenChange(true);
      focusFirstItem();
    }
    if (event.key === 'Escape') onOpenChange(false);
  };

  const handleMenuKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const items = Array.from(menuRef.current?.querySelectorAll<HTMLAnchorElement>('a') ?? []);
    const currentIndex = items.indexOf(document.activeElement as HTMLAnchorElement);
    if (event.key === 'Escape') {
      onOpenChange(false);
      buttonRef.current?.focus();
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      items[(currentIndex + 1) % items.length]?.focus();
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      items[(currentIndex - 1 + items.length) % items.length]?.focus();
    }
  };

  return (
    <div className="relative" onMouseEnter={openSoon} onMouseLeave={closeSoon}>
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => onOpenChange(!open)}
        onKeyDown={handleButtonKeyDown}
        className={`flex items-center gap-1.5 py-2 text-[13.5px] font-medium transition hover:text-champagne-500 ${
          active ? 'text-champagne-500' : ''
        }`}
      >
        {label}
        <ChevronDownIcon className={`h-3.5 w-3.5 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open ? (
        <div
          ref={menuRef}
          onKeyDown={handleMenuKeyDown}
          className="absolute right-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-xl border border-navy-900/8 bg-white p-2 text-navy-800 shadow-lift"
        >
          {categories.map((category) => (
            <Link
              key={category}
              to={`${transaction === 'BUY' ? '/buy' : '/rent'}/${CATEGORY_SLUGS[category]}`}
              onClick={() => onOpenChange(false)}
              className="flex items-center justify-between rounded-lg px-3 py-2.5 text-[13px] transition hover:bg-ivory focus-visible:bg-ivory"
            >
              <span>{CATEGORY_LABELS[category]}</span>
              <span className="text-[10px] text-champagne-600">↖</span>
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function MobileAccordion({ label, transaction, categories, onNavigate }: Omit<DropdownProps, 'active' | 'open' | 'onOpenChange'> & { onNavigate: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/10">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between py-4 text-[15px] font-medium text-white"
      >
        {label}
        <ChevronDownIcon className={`h-4 w-4 text-champagne-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <div className={`grid overflow-hidden transition-all duration-300 ${open ? 'grid-rows-[1fr] pb-3' : 'grid-rows-[0fr]'}`}>
        <div className="overflow-hidden">
          <div className="flex flex-col gap-1 pr-3">
            {categories.map((category) => (
              <Link
                key={category}
                to={`${transaction === 'BUY' ? '/buy' : '/rent'}/${CATEGORY_SLUGS[category]}`}
                onClick={onNavigate}
                className="rounded-lg px-3 py-2.5 text-[13px] text-white/70 transition hover:bg-white/5 hover:text-white"
              >
                {CATEGORY_LABELS[category]}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function PublicHeader() {
  const { settings } = useSite();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<Transaction | null>(null);
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const solid = !isHome || scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpenMenu(null);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!openMenu) return undefined;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpenMenu(null);
    };
    const onPointerDown = (event: MouseEvent) => {
      if (!(event.target as Element).closest('header')) setOpenMenu(null);
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('mousedown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('mousedown', onPointerDown);
    };
  }, [openMenu]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `relative py-2 text-[13.5px] font-medium transition hover:text-champagne-500 ${
      isActive ? 'text-champagne-500' : ''
    }`;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          solid
            ? 'border-b border-navy-900/8 bg-white/95 text-navy-800 shadow-[0_10px_30px_-30px_rgba(11,27,43,0.6)] backdrop-blur'
            : 'bg-gradient-to-b from-navy-950/60 to-transparent text-white'
        }`}
      >
        <div className="shell flex h-20 items-center justify-between gap-6 lg:h-24">
          <Link to="/" aria-label="صفحه اصلی" className="shrink-0">
            <Brand settings={settings} tone={solid ? 'dark' : 'light'} size="sm" />
          </Link>

          <nav aria-label="ناوبری اصلی" className="hidden items-center gap-7 lg:flex">
            <NavLink to="/about" className={navLinkClass}>
              درباره ما
            </NavLink>
            <NavLink to="/contact" className={navLinkClass}>
              تماس با ما
            </NavLink>
            <NavLink to="/team" className={navLinkClass}>
              تیم ما
            </NavLink>
            <NavDropdown
              label="خرید"
              transaction="BUY"
              categories={buyCategories}
              active={pathname.startsWith('/buy')}
              open={openMenu === 'BUY'}
              onOpenChange={(value) => setOpenMenu(value ? 'BUY' : null)}
            />
            <NavDropdown
              label="اجاره"
              transaction="RENT"
              categories={rentCategories}
              active={pathname.startsWith('/rent')}
              open={openMenu === 'RENT'}
              onOpenChange={(value) => setOpenMenu(value ? 'RENT' : null)}
            />
          </nav>

          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="باز کردن منو"
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            className={`rounded-full border p-2.5 transition lg:hidden ${
              solid ? 'border-navy-900/15 text-navy-800' : 'border-white/30 text-white'
            }`}
          >
            <MenuIcon className="h-5 w-5" />
          </button>
        </div>
      </header>

      <div
        id="mobile-navigation"
        className={`fixed inset-0 z-[70] lg:hidden ${mobileOpen ? 'visible' : 'invisible'}`}
        aria-hidden={!mobileOpen}
      >
        <div
          className={`absolute inset-0 bg-navy-950/70 transition-opacity duration-300 ${
            mobileOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setMobileOpen(false)}
        />
        <div
          className={`absolute inset-y-0 right-0 flex h-full w-[86%] max-w-sm flex-col bg-navy-900 px-6 pb-8 pt-5 shadow-lift transition-transform duration-300 ${
            mobileOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between">
            <Brand settings={settings} tone="light" size="sm" />
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="بستن منو"
              className="rounded-full border border-white/20 p-2 text-white"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>

          <nav aria-label="ناوبری موبایل" className="mt-8 flex-1 overflow-y-auto">
            <NavLink
              to="/about"
              onClick={() => setMobileOpen(false)}
              className="block border-b border-white/10 py-4 text-[15px] font-medium text-white"
            >
              درباره ما
            </NavLink>
            <NavLink
              to="/contact"
              onClick={() => setMobileOpen(false)}
              className="block border-b border-white/10 py-4 text-[15px] font-medium text-white"
            >
              تماس با ما
            </NavLink>
            <NavLink
              to="/team"
              onClick={() => setMobileOpen(false)}
              className="block border-b border-white/10 py-4 text-[15px] font-medium text-white"
            >
              تیم ما
            </NavLink>
            <MobileAccordion
              label="خرید"
              transaction="BUY"
              categories={buyCategories}
              onNavigate={() => setMobileOpen(false)}
            />
            <MobileAccordion
              label="اجاره"
              transaction="RENT"
              categories={rentCategories}
              onNavigate={() => setMobileOpen(false)}
            />
          </nav>

          <p className="mt-6 text-[11px] leading-6 text-white/40">{settings.brandDescriptor}</p>
        </div>
      </div>
    </>
  );
}
