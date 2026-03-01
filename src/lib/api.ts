// Frontend API client — gọi tới Vercel Serverless Functions

export interface Vehicle {
  id: string;
  name: string;
  type: 'car' | 'bike' | 'suv' | 'luxury';
  description: string;
  pricePerDay: number;
  pricePerHour: number;
  images: string[];
  features: string[];
  seats: number;
  transmission: string;
  fuel: string;
  rating: number;
  available: boolean;
}

export interface Booking {
  id: string;
  vehicleId: string;
  vehicleName: string;
  customerName: string;
  customerPhone: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  totalPrice: number;
  createdAt: string;
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
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar: string;
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
