import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { api } from '../../lib/api';
import { LogoMark } from '../Brand';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const [state, setState] = useState<'loading' | 'authenticated' | 'anonymous'>('loading');

  useEffect(() => {
    let active = true;
    api
      .get<{ user: { email: string } }>('/auth/me')
      .then(() => {
        if (active) setState('authenticated');
      })
      .catch(() => {
        if (active) setState('anonymous');
      });
    return () => {
      active = false;
    };
  }, []);

  if (state === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-mist">
        <div className="flex flex-col items-center gap-4 text-navy-900">
          <span className="animate-pulse text-champagne-600">
            <LogoMark className="h-10 w-10" />
          </span>
          <p className="text-[11px] text-navy-400">بررسی دسترسی…</p>
        </div>
      </div>
    );
  }

  if (state === 'anonymous') return <Navigate to="/admin/login" replace />;

  return <>{children}</>;
}
