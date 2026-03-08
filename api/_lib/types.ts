import { ObjectId } from 'mongodb';

// ─── Vehicle Package (embedded per-vehicle) ─────────────

export interface VehiclePackageDoc {
  id: string;                // UUID do frontend/admin tạo
  serviceTypeSlug: string;   // 'hourly_4h', 'daily', 'wedding', ...
  name: string;              // "Gói 4 tiếng", "Theo ngày", ...
  price: number;             // Giá riêng cho xe này
  durationHours?: number;
  maxKm?: number;
  description?: string;
  isActive: boolean;
}

// ─── Vehicle ─────────────────────────────────────────────

export interface VehicleDoc {
  _id?: ObjectId;
  name: string;
  brand: string;                   // Thương hiệu: Mercedes-Benz, BMW, ...
  type: 'car' | 'suv' | 'luxury' | 'van' | 'pickup' | 'mpv' | 'electric';
  year: number;                    // Năm sản xuất
  color: string;                   // Màu xe
  description: string;
  pricePerDay: number;
  pricePerHour: number;
  images: string[];
  features: string[];
  seats: number;
  seatCategory: '4_cho' | '5_cho' | '7_cho' | '9_cho' | '16_cho' | '29_cho' | '45_cho';
  transmission: string;
  fuel: string;
  rating: number;
  available: boolean;
  selfDrivePrice?: number;        // Giá tự lái /ngày (nếu có)
  chauffeurIncluded?: boolean;     // Có tài xế kèm theo mặc định?
  licensePlate?: string;           // Biển số xe (admin only)
  packages?: VehiclePackageDoc[];  // Gói dịch vụ riêng cho xe này
  createdAt?: string;
}

// ─── Booking ─────────────────────────────────────────────

export interface BookingDoc {
  _id?: ObjectId;
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
  // Các trường mới cho loại hình thuê xe
  serviceType: string;             // slug loại dịch vụ: 'hourly_4h', 'daily', 'trip', ...
  pickupLocation?: string;         // Điểm đón
  dropoffLocation?: string;        // Điểm đến
  tripType?: 'one_way' | 'round_trip';
  routeId?: string;                // ID tuyến đường (nếu thuê đi tỉnh)
  packageId?: string;              // ID gói giá (nếu thuê theo gói)
  passengers?: number;             // Số hành khách
  note?: string;
  updatedAt?: string;
}

// ─── Service Type (Loại dịch vụ — admin config) ──────────

export interface ServiceTypeDoc {
  _id?: ObjectId;
  name: string;           // "Thuê xe gói 4 tiếng", "Thuê xe đi tỉnh", ...
  slug: string;           // 'hourly_4h', 'hourly_8h', 'daily', 'multi_day', 'trip', 'self_drive', 'wedding', 'airport'
  description: string;
  icon: string;           // lucide icon name
  image?: string;         // URL hình ảnh banner cho dịch vụ
  isActive: boolean;
  order: number;          // thứ tự hiển thị
}

// ─── Route (Tuyến đường đi tỉnh — admin config) ─────────

export interface RouteDoc {
  _id?: ObjectId;
  from: string;           // "TP.HCM"
  to: string;             // "Vũng Tàu"
  province: string;       // Nhóm tỉnh: "Bà Rịa Vũng Tàu"
  distance: number;       // km (tính cả đi lẫn về)
  duration: string;       // "trong ngày", "2 ngày 1 đêm"
  price4Seat: number;     // Giá xe 4 chỗ
  price7Seat: number;     // Giá xe 7 chỗ
  price16Seat: number;    // Giá xe 16 chỗ
  notes?: string;         // Ghi chú đặc biệt
  isActive: boolean;
  createdAt?: string;
}

// ─── Pricing Package (Gói giá theo giờ/km — admin config) ──

export interface PricingPackageDoc {
  _id?: ObjectId;
  name: string;           // "Gói 4 tiếng", "Gói 8 tiếng", "Gói 200km"
  slug: string;           // 'pkg_4h', 'pkg_8h', 'pkg_200km'
  serviceTypeSlug: string; // liên kết với ServiceType slug
  durationHours: number;  // Số giờ tối đa
  maxKm: number;          // Số km tối đa
  // Giá gốc theo loại xe
  price4Seat: number;
  price7Seat: number;
  price16Seat: number;
  // Phí phát sinh vượt km
  overagePerKm4Seat: number;
  overagePerKm7Seat: number;
  overagePerKm16Seat: number;
  // Phí phát sinh vượt giờ
  overagePerHour4Seat: number;
  overagePerHour7Seat: number;
  overagePerHour16Seat: number;
  // Phụ thu cuối tuần
  weekendSurcharge4Seat: number;
  weekendSurcharge7Seat: number;
  weekendSurcharge16Seat: number;
  includes: string[];     // ["Xăng", "Tài xế", "Lương tài xế"]
  excludes: string[];     // ["VAT", "Phí cầu đường", "Bến bãi"]
  isActive: boolean;
  order: number;
  createdAt?: string;
}

// ─── Blog & Testimonials ─────────────────────────────────

export interface BlogPostDoc {
  _id?: ObjectId;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  tags?: string[];         // Tags cho SEO/filtering
  isPublished?: boolean;   // true = xuất bản, false = bản nháp
}

export interface TestimonialDoc {
  _id?: ObjectId;
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar: string;
  date?: string;           // Ngày đánh giá
}

/** Chuyển MongoDB document sang plain object với id string */
export function toJSON<T extends { _id?: ObjectId }>(doc: T): Omit<T, '_id'> & { id: string } {
  const { _id, ...rest } = doc;
  return { id: _id!.toString(), ...rest };
}
