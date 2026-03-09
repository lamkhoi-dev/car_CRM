// Frontend API client — gọi tới Vercel Serverless Functions

export interface VehiclePackage {
  id: string;
  serviceTypeSlug: string;
  name: string;
  price: number;
  durationHours?: number;
  maxKm?: number;
  description?: string;
  isActive: boolean;
}

export interface Vehicle {
  id: string;
  name: string;
  brand: string;
  type: 'car' | 'suv' | 'luxury' | 'van' | 'pickup' | 'mpv' | 'electric';
  year: number;
  color: string;
  description: string;
  pricePerDay: number;
  pricePerHour: number;
  images: string[];
  features: string[];
  seats: number;
  seatCategory: '4_cho' | '5_cho' | '7_cho' | '9_cho' | '18_cho' | '29_cho' | '45_cho';
  transmission: string;
  fuel: string;
  rating: number;
  available: boolean;
  selfDrivePrice?: number;
  chauffeurIncluded?: boolean;
  licensePlate?: string;
  packages?: VehiclePackage[];
  createdAt?: string;
}

export interface Booking {
  id: string;
  vehicleId: string;
  vehicleName: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  totalPrice: number;
  deviceId: string;
  createdAt: string;
  serviceType: string;
  pickupLocation?: string;
  dropoffLocation?: string;
  tripType?: 'one_way' | 'round_trip';
  routeId?: string;
  packageId?: string;
  passengers?: number;
  note?: string;
  updatedAt?: string;
}

export interface ServiceType {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  image?: string;
  isActive: boolean;
  order: number;
}

export interface Route {
  id: string;
  from: string;
  to: string;
  province: string;
  distance: number;
  duration: string;
  price4Seat: number;
  price7Seat: number;
  price18Seat: number;
  price29Seat: number;
  notes?: string;
  isActive: boolean;
  createdAt?: string;
}

export interface PricingPackage {
  id: string;
  name: string;
  slug: string;
  serviceTypeSlug: string;
  durationHours: number;
  maxKm: number;
  price4Seat: number;
  price7Seat: number;
  price18Seat: number;
  price29Seat: number;
  overagePerKm4Seat: number;
  overagePerKm7Seat: number;
  overagePerKm18Seat: number;
  overagePerKm29Seat: number;
  overagePerHour4Seat: number;
  overagePerHour7Seat: number;
  overagePerHour18Seat: number;
  overagePerHour29Seat: number;
  weekendSurcharge4Seat: number;
  weekendSurcharge7Seat: number;
  weekendSurcharge18Seat: number;
  weekendSurcharge29Seat: number;
  includes: string[];
  excludes: string[];
  isActive: boolean;
  order: number;
  createdAt?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  tags?: string[];
  isPublished?: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar: string;
  date?: string;
}

// ─── Helpers ────────────────────────────────────────────

const BASE = '/api';

function getAdminHeaders(): HeadersInit {
  const secret = localStorage.getItem('adminSecret') || '';
  return {
    'Content-Type': 'application/json',
    ...(secret ? { Authorization: `Bearer ${secret}` } : {}),
  };
}

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'Request failed');
  }
  return res.json();
}

async function adminFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${url}`, {
    ...options,
    headers: getAdminHeaders(),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'Request failed');
  }
  return res.json();
}

// ─── Vehicles ───────────────────────────────────────────

export const vehiclesApi = {
  getAll: () => fetchJson<Vehicle[]>('/vehicles'),
  getById: (id: string) => fetchJson<Vehicle>(`/vehicles/${id}`),
  create: (data: Omit<Vehicle, 'id'>) =>
    adminFetch<Vehicle>('/vehicles', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Vehicle>) =>
    adminFetch<Vehicle>(`/vehicles/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) =>
    adminFetch<{ success: boolean }>(`/vehicles/${id}`, { method: 'DELETE' }),
};

// ─── Bookings ───────────────────────────────────────────

export const bookingsApi = {
  getAll: () => fetchJson<Booking[]>('/bookings'),
  getByDevice: (deviceId: string) => fetchJson<Booking[]>(`/bookings?deviceId=${encodeURIComponent(deviceId)}`),
  create: (data: Omit<Booking, 'id' | 'status' | 'createdAt'>) =>
    fetchJson<Booking>('/bookings', { method: 'POST', body: JSON.stringify(data) }),
  updateStatus: (id: string, status: Booking['status']) =>
    adminFetch<Booking>(`/bookings/${id}`, { method: 'PUT', body: JSON.stringify({ status }) }),
  delete: (id: string) =>
    adminFetch<{ success: boolean }>(`/bookings/${id}`, { method: 'DELETE' }),
};

// ─── Blog ───────────────────────────────────────────────

export const blogApi = {
  getAll: () => fetchJson<BlogPost[]>('/blog'),
  getById: (id: string) => fetchJson<BlogPost>(`/blog/${id}`),
  create: (data: Omit<BlogPost, 'id' | 'date'>) =>
    adminFetch<BlogPost>('/blog', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<BlogPost>) =>
    adminFetch<BlogPost>(`/blog/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) =>
    adminFetch<{ success: boolean }>(`/blog/${id}`, { method: 'DELETE' }),
};

// ─── Testimonials ───────────────────────────────────────

export const testimonialsApi = {
  getAll: () => fetchJson<Testimonial[]>('/testimonials'),
};

// ─── Upload ─────────────────────────────────────────────

export const uploadApi = {
  /** folder mặc định: carCRM/general. Các folder: carCRM/vehicles, carCRM/blog, carCRM/general */
  upload: (base64Image: string, folder: string = 'carCRM/general') =>
    adminFetch<{ url: string; publicId: string }>('/upload', {
      method: 'POST',
      body: JSON.stringify({ image: base64Image, folder }),
    }),
};

// ─── Seed ───────────────────────────────────────────────

export const seedApi = {
  seed: () => adminFetch<{ success: boolean; inserted: Record<string, number> }>('/seed', { method: 'POST' }),
};

// ─── Service Types ──────────────────────────────────────

export const serviceTypesApi = {
  getAll: () => fetchJson<ServiceType[]>('/service-types'),
  getById: (id: string) => fetchJson<ServiceType>(`/service-types?id=${id}`),
  create: (data: Omit<ServiceType, 'id'>) =>
    adminFetch<ServiceType>('/service-types', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<ServiceType>) =>
    adminFetch<ServiceType>(`/service-types?id=${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) =>
    adminFetch<{ success: boolean }>(`/service-types?id=${id}`, { method: 'DELETE' }),
};

// ─── Routes ─────────────────────────────────────────────

export const routesApi = {
  getAll: (province?: string) => {
    const params = new URLSearchParams();
    if (province) params.set('province', province);
    params.set('active', 'true');
    return fetchJson<Route[]>(`/routes?${params}`);
  },
  getAllAdmin: () => fetchJson<Route[]>('/routes'),
  getById: (id: string) => fetchJson<Route>(`/routes?id=${id}`),
  create: (data: Omit<Route, 'id'>) =>
    adminFetch<Route>('/routes', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Route>) =>
    adminFetch<Route>(`/routes?id=${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) =>
    adminFetch<{ success: boolean }>(`/routes?id=${id}`, { method: 'DELETE' }),
};

// ─── Pricing Packages ───────────────────────────────────

export const pricingPackagesApi = {
  getAll: (serviceType?: string) => {
    const params = new URLSearchParams();
    if (serviceType) params.set('serviceType', serviceType);
    params.set('active', 'true');
    return fetchJson<PricingPackage[]>(`/pricing-packages?${params}`);
  },
  getAllAdmin: () => fetchJson<PricingPackage[]>('/pricing-packages'),
  getById: (id: string) => fetchJson<PricingPackage>(`/pricing-packages?id=${id}`),
  create: (data: Omit<PricingPackage, 'id'>) =>
    adminFetch<PricingPackage>('/pricing-packages', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<PricingPackage>) =>
    adminFetch<PricingPackage>(`/pricing-packages?id=${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) =>
    adminFetch<{ success: boolean }>(`/pricing-packages?id=${id}`, { method: 'DELETE' }),
};
