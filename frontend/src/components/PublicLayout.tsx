import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { api } from '../lib/api';
import { getVisitorId } from '../lib/visitor';
import { PublicHeader } from './PublicHeader';
import { PublicFooter } from './PublicFooter';

function usePageView(pathname: string) {
  const tracked = useRef(new Set<string>());

  useEffect(() => {
    if (pathname.startsWith('/property/')) return; // property views are counted by the detail endpoint
    if (tracked.current.has(pathname)) return;
    tracked.current.add(pathname);
    void api
      .post('/track', { path: pathname, visitorId: getVisitorId() })
      .catch(() => undefined);
  }, [pathname]);
}

export function PublicLayout() {
  const { pathname } = useLocation();
  usePageView(pathname);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <a href="#main-content" className="skip-link">
        پرش به محتوای اصلی
      </a>
      <PublicHeader />
      <main id="main-content" className="flex-1">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
}
