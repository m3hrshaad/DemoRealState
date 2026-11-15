import type { ReactNode } from 'react';

type IconProps = { className?: string };

function Svg({ children, className }: IconProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className ?? 'h-5 w-5'}
    >
      {children}
    </svg>
  );
}

export const ArrowLeftIcon = ({ className }: IconProps) => (
  <Svg className={className}><path d="M19 12H5" /><path d="m11 18-6-6 6-6" /></Svg>
);
export const ArrowRightIcon = ({ className }: IconProps) => (
  <Svg className={className}><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></Svg>
);
export const ChevronDownIcon = ({ className }: IconProps) => (
  <Svg className={className}><path d="m6 9 6 6 6-6" /></Svg>
);
export const ChevronLeftIcon = ({ className }: IconProps) => (
  <Svg className={className}><path d="m15 18-6-6 6-6" /></Svg>
);
export const ChevronRightIcon = ({ className }: IconProps) => (
  <Svg className={className}><path d="m9 18 6-6-6-6" /></Svg>
);
export const MenuIcon = ({ className }: IconProps) => (
  <Svg className={className}><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" /></Svg>
);
export const CloseIcon = ({ className }: IconProps) => (
  <Svg className={className}><path d="M18 6 6 18" /><path d="m6 6 12 12" /></Svg>
);
export const CheckIcon = ({ className }: IconProps) => (
  <Svg className={className}><path d="m5 12 4.5 4.5L19 7" /></Svg>
);
export const StarIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className ?? 'h-4 w-4'}>
    <path d="M12 2.6l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5-5.8-3-5.8 3 1.1-6.5L2.6 9.4l6.5-.9z" />
  </svg>
);
export const MapPinIcon = ({ className }: IconProps) => (
  <Svg className={className}><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.6" /></Svg>
);
export const RulerIcon = ({ className }: IconProps) => (
  <Svg className={className}><path d="M3 14.5 9.5 8l6.5 6.5L9.5 21 3 14.5Z" /><path d="m7 10.5 1.6 1.6" /><path d="m9.5 8 1.6 1.6" /><path d="m12 5.5 1.6 1.6" /><path d="m14.5 3 1.6 1.6" /><path d="m16 12.5 5 5-2.5 2.5-5-5" /></Svg>
);
export const BedIcon = ({ className }: IconProps) => (
  <Svg className={className}><path d="M3 18v-7h18v7" /><path d="M3 18v2" /><path d="M21 18v2" /><path d="M3 11V7h8v4" /><circle cx="7" cy="9" r="1.4" /></Svg>
);
export const BuildingIcon = ({ className }: IconProps) => (
  <Svg className={className}><path d="M4 21V5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v16" /><path d="M15 9h3a2 2 0 0 1 2 2v10" /><path d="M8 7h3" /><path d="M8 11h3" /><path d="M8 15h3" /><path d="M2 21h20" /></Svg>
);
export const CalendarIcon = ({ className }: IconProps) => (
  <Svg className={className}><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M8 3v4" /><path d="M16 3v4" /><path d="M3 11h18" /></Svg>
);
export const PhoneIcon = ({ className }: IconProps) => (
  <Svg className={className}><path d="M6.5 3h3l1.5 4-2 1.5a12 12 0 0 0 6.5 6.5L17 13l4 1.5v3a2.5 2.5 0 0 1-2.7 2.5A17 17 0 0 1 4 5.7 2.5 2.5 0 0 1 6.5 3Z" /></Svg>
);
export const MailIcon = ({ className }: IconProps) => (
  <Svg className={className}><rect x="2.5" y="5" width="19" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></Svg>
);
export const InstagramIcon = ({ className }: IconProps) => (
  <Svg className={className}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" /></Svg>
);
export const WhatsAppIcon = ({ className }: IconProps) => (
  <Svg className={className}><path d="M20 11.5A8 8 0 0 1 8.4 19L4 20l1.2-4.2A8 8 0 1 1 20 11.5Z" /><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5" /><path d="M9 9.5h1.5l.8 2-1.1.9" /></Svg>
);
export const TelegramIcon = ({ className }: IconProps) => (
  <Svg className={className}><path d="M21 4 3 11l5.5 2L11 20l3-4 5 2 2-14Z" /><path d="m8.5 13 8-6" /></Svg>
);
export const LinkedInIcon = ({ className }: IconProps) => (
  <Svg className={className}><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M7.5 10v7" /><path d="M7.5 7.2v.1" /><path d="M11.5 17v-4a2.5 2.5 0 0 1 5 0v4" /></Svg>
);
export const SearchIcon = ({ className }: IconProps) => (
  <Svg className={className}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></Svg>
);
export const SlidersIcon = ({ className }: IconProps) => (
  <Svg className={className}><path d="M4 7h10" /><path d="M18 7h2" /><circle cx="16" cy="7" r="2" /><path d="M4 17h4" /><path d="M12 17h8" /><circle cx="10" cy="17" r="2" /></Svg>
);
export const TrashIcon = ({ className }: IconProps) => (
  <Svg className={className}><path d="M4 7h16" /><path d="M9 7V5h6v2" /><path d="M6 7l1 13h10l1-13" /><path d="M10 11v6" /><path d="M14 11v6" /></Svg>
);
export const PencilIcon = ({ className }: IconProps) => (
  <Svg className={className}><path d="M4 20h4L20 8l-4-4L4 16v4Z" /><path d="m14 6 4 4" /></Svg>
);
export const PlusIcon = ({ className }: IconProps) => (
  <Svg className={className}><path d="M12 5v14" /><path d="M5 12h14" /></Svg>
);
export const EyeIcon = ({ className }: IconProps) => (
  <Svg className={className}><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" /><circle cx="12" cy="12" r="3" /></Svg>
);
export const EyeOffIcon = ({ className }: IconProps) => (
  <Svg className={className}><path d="M4 4l16 16" /><path d="M9.5 5.9A10.8 10.8 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a17 17 0 0 1-2.4 3.3" /><path d="M6.3 7.8A17 17 0 0 0 2.5 12S6 18.5 12 18.5a10.8 10.8 0 0 0 3.3-.5" /><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" /></Svg>
);
export const LogOutIcon = ({ className }: IconProps) => (
  <Svg className={className}><path d="M9 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h3" /><path d="M15 8l4 4-4 4" /><path d="M19 12H9" /></Svg>
);
export const DashboardIcon = ({ className }: IconProps) => (
  <Svg className={className}><rect x="3" y="3" width="7" height="9" rx="1.5" /><rect x="14" y="3" width="7" height="5" rx="1.5" /><rect x="14" y="12" width="7" height="9" rx="1.5" /><rect x="3" y="16" width="7" height="5" rx="1.5" /></Svg>
);
export const HomeIcon = ({ className }: IconProps) => (
  <Svg className={className}><path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1v-9.5Z" /></Svg>
);
export const StoreIcon = ({ className }: IconProps) => (
  <Svg className={className}><path d="M4 9h16v11H4z" /><path d="M3 9l1.5-5h15L21 9" /><path d="M9 20v-5h6v5" /></Svg>
);
export const LandIcon = ({ className }: IconProps) => (
  <Svg className={className}><path d="M3 18h18" /><path d="m4 18 4-8 4 4 3-5 5 9" /><circle cx="17" cy="5" r="1.6" /></Svg>
);
export const KeyIcon = ({ className }: IconProps) => (
  <Svg className={className}><circle cx="8" cy="8" r="4" /><path d="m11 11 8 8" /><path d="m16 16 2-2" /><path d="m19 19 1.5-1.5" /></Svg>
);
export const UploadIcon = ({ className }: IconProps) => (
  <Svg className={className}><path d="M12 16V4" /><path d="m7 9 5-5 5 5" /><path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" /></Svg>
);
export const ExternalIcon = ({ className }: IconProps) => (
  <Svg className={className}><path d="M14 4h6v6" /><path d="M20 4 10 14" /><path d="M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5" /></Svg>
);
export const UsersIcon = ({ className }: IconProps) => (
  <Svg className={className}><circle cx="9" cy="8" r="3.2" /><path d="M3 20v-1.5A4.5 4.5 0 0 1 7.5 14h3A4.5 4.5 0 0 1 15 18.5V20" /><path d="M16 5.2a3 3 0 0 1 0 5.6" /><path d="M18 20v-1.5a4.5 4.5 0 0 0-2-3.7" /></Svg>
);
export const SettingsIcon = ({ className }: IconProps) => (
  <Svg className={className}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5v.3a2 2 0 1 1-4 0v-.2a1.7 1.7 0 0 0-1.1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.3a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.3a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.3a1.7 1.7 0 0 0-1.5 1Z" /></Svg>
);
export const InfoIcon = ({ className }: IconProps) => (
  <Svg className={className}><circle cx="12" cy="12" r="9" /><path d="M12 11v5" /><path d="M12 8v.1" /></Svg>
);
export const ChartIcon = ({ className }: IconProps) => (
  <Svg className={className}><path d="M4 20V4" /><path d="M4 20h16" /><path d="M8 16v-5" /><path d="M13 16V7" /><path d="M18 16v-8" /></Svg>
);
export const TrendingIcon = ({ className }: IconProps) => (
  <Svg className={className}><path d="m4 16 5-5 4 4 7-7" /><path d="M15 8h5v5" /></Svg>
);
export const CompassIcon = ({ className }: IconProps) => (
  <Svg className={className}><circle cx="12" cy="12" r="9" /><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" /></Svg>
);
export const ShieldIcon = ({ className }: IconProps) => (
  <Svg className={className}><path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3Z" /><path d="m9 12 2 2 4-4" /></Svg>
);
export const ImageIcon = ({ className }: IconProps) => (
  <Svg className={className}><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="8.5" cy="9.5" r="1.5" /><path d="m4 17 5-5 4 4 3-3 4 4" /></Svg>
);
export const ExpandIcon = ({ className }: IconProps) => (
  <Svg className={className}><path d="M9 3H3v6" /><path d="M15 21h6v-6" /><path d="M3 3l6 6" /><path d="m21 21-6-6" /></Svg>
);
