export type Category = 'LAND' | 'APARTMENT' | 'VILLA' | 'COMMERCIAL';
export type Transaction = 'BUY' | 'RENT';

export type Property = {
  id: string;
  code: string;
  transactionType: Transaction;
  category: Category;
  title: string;
  city: string | null;
  neighborhood: string | null;
  address: string | null;
  area: number | null;
  landArea: number | null;
  buildYear: number | null;
  unitsCount: number | null;
  floor: number | null;
  roomsCount: number | null;
  hasStorage: boolean;
  hasElevator: boolean;
  hasParking: boolean;
  features: string[];
  amenities: string[];
  pricePerMeter: string | null;
  isOnLand: boolean | null;
  isSubdivided: boolean | null;
  hasWaterWell: boolean | null;
  hasElectricity: boolean | null;
  hasWater: boolean | null;
  hasGas: boolean | null;
  salePrice: string | null;
  deposit: string | null;
  monthlyRent: string | null;
  description: string | null;
  images: string[];
  agentName: string | null;
  agentTitle: string | null;
  agentPhone: string | null;
  agentPhoto: string | null;
  isFeatured: boolean;
  isPublished: boolean;
  views: number;
  createdAt: string;
  updatedAt: string;
};

export type WhyItem = { title: string; description: string };

export type Settings = {
  brandName: string;
  brandDescriptor: string;
  logoUrl: string;
  description: string;
  heroImage: string;
  phone: string;
  mobile: string;
  email: string;
  address: string;
  workingHours: string;
  instagram: string;
  telegram: string;
  whatsapp: string;
  linkedin: string;
  aboutTitle: string;
  aboutDescription: string;
  aboutImageMain: string;
  aboutImageSecondary: string;
  aboutHighlights: string[];
  contactTitle: string;
  contactText: string;
  whyTitle: string;
  whyDescription: string;
  whyItems: WhyItem[];
  ctaTitle: string;
  ctaText: string;
  ctaButton: string;
  footerNote: string;
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  photo: string;
  phone: string;
  email: string;
  instagram: string;
  bio: string;
  sortOrder?: number;
  isVisible?: boolean;
};

export type Service = {
  id: string;
  title: string;
  description: string;
  image: string;
  sortOrder?: number;
  isVisible?: boolean;
};

export type SiteContent = {
  settings: Settings | null;
  services: Service[];
  team: TeamMember[];
};

export type PropertyList = {
  items: Property[];
  total: number;
  page: number;
  limit: number;
  pages: number;
};

export type Activity = {
  id: string;
  kind: string;
  message: string;
  propertyId: string | null;
  createdAt: string;
};

export type Inquiry = {
  id: string;
  type: 'CALL' | 'VISIT' | 'INFO';
  name: string;
  phone: string;
  message: string;
  status: string;
  propertyId: string | null;
  propertyTitle: string | null;
  createdAt: string;
};

export type ChartPoint = { date: string; value: number };

export type Overview = {
  stats: {
    daily: { value: number; previous: number; change: number | null };
    weekly: { value: number; previous: number; change: number | null };
    monthly: { value: number; previous: number; change: number | null };
  };
  charts: { daily: ChartPoint[]; weekly: ChartPoint[]; monthly: ChartPoint[] };
  mostViewed: Property | null;
  counts: {
    properties: number;
    published: number;
    featured: number;
    newInquiries: number;
    team: number;
  };
  activity: Activity[];
  inquiries: Inquiry[];
};
