import type { ReactNode } from 'react';
import { SearchIcon } from '../../icons';

type EmptyStateProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
};

export function EmptyState({ title, description, action, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-navy-900/15 bg-ivory/60 px-6 py-14 text-center">
      <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-champagne-500/40 text-champagne-600">
        {icon ?? <SearchIcon className="h-6 w-6" />}
      </span>
      <p className="text-base font-semibold text-navy-900">{title}</p>
      {description ? <p className="mt-2 max-w-md text-[13px] leading-7 text-navy-500">{description}</p> : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
