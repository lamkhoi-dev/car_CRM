# DriveFlux — Hệ thống quản lý cho thuê xe cao cấp

> **Live:** https://car-crm-beige.vercel.app  
> **Repo:** https://github.com/lamkhoi-dev/car_CRM.git (branch `main`)
 
---

## 1. Tổng quan

DriveFlux là hệ thống CRM cho thuê xe Full-stack, giao diện tiếng Việt, hỗ trợ dark/light mode, responsive trên mọi thiết bị. Hệ thống phục vụ khách hàng đặt xe trực tuyến và admin quản lý toàn bộ nghiệp vụ.

### Tính năng chính

| Nhóm | Chi tiết |
|---|---|
| **Đặt xe** | Wizard 3 bước: chọn dịch vụ → chi tiết chuyến → xác nhận & liên hệ |
| **Xe** | 18 xe cao cấp (sedan, SUV, van, luxury, electric). Mỗi xe có gói dịch vụ riêng với giá riêng |
| **Dịch vụ** | 8 loại: Gói 4h, Gói 8h, Theo ngày, Nhiều ngày, Đi tỉnh, Sân bay, Tự lái, Đám cưới |
| **Tuyến đường** | 26 tuyến HCM đi tỉnh, 3 mức giá (4 chỗ / 7 chỗ / 16 chỗ) |
| **Gói giá** | Bảng giá global (landing page) + gói giá riêng per-vehicle |
| **Blog** | 8 bài viết, hỗ trợ draft/publish, tags, SEO |
| **Đánh giá** | Testimonials khách hàng hiển thị trên trang chủ |
| **Admin** | Dashboard 7 tab: Tổng quan, Xe, Đơn đặt, Blog, Dịch vụ, Tuyến đường, Gói giá |
| **Tracking** | Theo dõi đơn đặt bằng deviceId (không cần đăng nhập) |
| **SEO** | Meta tags, Open Graph, sitemap-ready |
| **Theme** | Dark / Light / System, lưu localStorage |
| **Responsive** | Desktop + Tablet + Mobile, bottom nav trên mobile |

---

## 2. Kiến trúc hệ thống

```
┌──────────────────────────────────────────────────┐
│                   FRONTEND                       │
│  React 18 + TypeScript + Vite + Tailwind CSS     │
│  shadcn/ui + Framer Motion + TanStack Query      │
│  React Router v6 (SPA)                           │
└──────────────┬───────────────────────────────────┘
               │  REST API (fetch)
               ▼
┌──────────────────────────────────────────────────┐
│           VERCEL SERVERLESS FUNCTIONS            │
│        12 functions (Node.js 20, CommonJS)       │
│  Auth: Bearer token (admin secret)               │
└──────┬──────────────────────────┬────────────────┘
       │                          │
       ▼                          ▼
┌──────────────┐         ┌─────────────────┐
│ MongoDB Atlas│         │   Cloudinary     │
│  DB: driveflux│        │  Image/Video CDN │
│  7 collections│        │                  │
└──────────────┘         └─────────────────┘
```

### Kiến trúc gói dịch vụ (Per-Vehicle Packages)

Mỗi xe có mảng `packages[]` nhúng trực tiếp, chứa các gói dịch vụ mà xe đó hỗ trợ với giá riêng. Không phụ thuộc bảng giá global.

```typescript
// Ví dụ: Mercedes S-Class có gói riêng
{
  name: "Mercedes-Benz S-Class",
  packages: [
    { serviceTypeSlug: "hourly_4h", name: "Gói 4 tiếng", price: 3500000, durationHours: 4, maxKm: 100 },
    { serviceTypeSlug: "airport", name: "Đưa đón sân bay", price: 2000000 },
    { serviceTypeSlug: "wedding", name: "Xe cưới", price: 8000000 },
    ...
  ]
}
```

---

## 3. Tech Stack

### Frontend

| Công nghệ | Vai trò |
|---|---|
| **React 18** | UI framework |
| **TypeScript** | Type safety |
| **Vite** (SWC) | Build tool, dev server (port 8080) |
| **Tailwind CSS** | Utility-first CSS |
| **shadcn/ui** (Radix) | Component library (50+ components) |
| **Framer Motion** | Animation |
| **TanStack React Query** | Server state management, caching |
| **React Router v6** | Client-side routing |
| **React Hook Form + Zod** | Form validation |
| **Recharts** | Charts (admin dashboard) |
| **Embla Carousel** | Image carousels |
| **Lucide React** | Icons |
| **date-fns** | Date formatting |
| **next-themes** | Theme switching |
| **Sonner** | Toast notifications |

### Backend

| Công nghệ | Vai trò |
|---|---|
| **Vercel Serverless Functions** | API runtime (12 functions, Hobby plan) |
| **Node.js 20** | Runtime |
| **MongoDB 7.x driver** | Database client |
| **Cloudinary SDK** | Image upload & CDN |

---

## 4. Cấu trúc thư mục

```
CMR_car/
├── api/                          # Vercel Serverless Functions (CommonJS)
│   ├── _lib/                     # Shared utilities (không phải endpoint)
│   │   ├── cloudinary.ts         # Cloudinary upload helper
│   │   ├── helpers.ts            # Auth middleware, CORS helper
│   │   ├── mongodb.ts            # MongoDB connection singleton
│   │   └── types.ts              # Tất cả TypeScript interfaces (MongoDB docs)
│   ├── blog/
│   │   ├── index.ts              # GET (list) / POST (create)
│   │   └── [id].ts               # GET / PUT / DELETE blog post
│   ├── bookings/
│   │   ├── index.ts              # GET (list/filter) / POST (create)
│   │   └── [id].ts               # GET / PUT / DELETE booking
│   ├── vehicles/
│   │   ├── index.ts              # GET (list) / POST (create)
│   │   └── [id].ts               # GET / PUT / DELETE vehicle
│   ├── service-types/
│   │   └── index.ts              # GET / POST / PUT / DELETE service types
│   ├── routes/
│   │   └── index.ts              # GET / POST / PUT / DELETE routes
│   ├── pricing-packages/
│   │   └── index.ts              # GET / POST / PUT / DELETE packages
│   ├── testimonials/
│   │   └── index.ts              # GET testimonials
│   ├── upload.ts                 # POST: Cloudinary image upload
│   ├── seed.ts                   # POST: Seed database (18 xe, 26 tuyến, 8 blog...)
│   └── package.json              # { "type": "commonjs" }
│
├── src/                          # Frontend source (ESM)
│   ├── App.tsx                   # Routes, providers (Theme, Query, Tooltip)
│   ├── main.tsx                  # Entry point
│   ├── index.css                 # Tailwind directives + CSS variables
│   ├── lib/
│   │   ├── api.ts                # API client (tất cả interfaces + fetch functions)
│   │   └── utils.ts              # formatVND, formatDateTime, getDeviceId, cn()
│   ├── hooks/
│   │   ├── useVehicles.ts        # Vehicle CRUD hooks (React Query)
│   │   ├── useBookings.ts        # Booking hooks
│   │   ├── useBlog.ts            # Blog hooks
│   │   ├── useServices.ts        # ServiceTypes + Routes + PricingPackages (15 hooks)
│   │   └── use-mobile.tsx        # Responsive breakpoint hook
│   ├── pages/
│   │   ├── Index.tsx             # Landing page (~700 dòng) — hero, services, vehicles, video, pricing, routes, testimonials, blog, FAQ, contact
│   │   ├── Vehicles.tsx          # Danh sách xe + bộ lọc (dịch vụ, loại xe, số ghế, sắp xếp, tìm kiếm)
│   │   ├── VehicleDetail.tsx     # Chi tiết xe + bảng gói dịch vụ + gallery
│   │   ├── BookingPage.tsx       # Wizard đặt xe 3 bước (sử dụng vehicle.packages)
│   │   ├── Blog.tsx              # Danh sách bài viết
│   │   ├── BlogPost.tsx          # Chi tiết bài viết
│   │   ├── MyBookings.tsx        # Tra cứu đơn đặt (theo deviceId)
│   │   ├── Admin.tsx             # Admin dashboard (~1500 dòng) — 7 tab CRUD
│   │   └── NotFound.tsx          # Trang 404
│   ├── components/
│   │   ├── Navbar.tsx            # Header navigation + theme toggle
│   │   ├── BottomNav.tsx         # Mobile bottom navigation
│   │   ├── ContactWidget.tsx     # Floating contact buttons (phone, Zalo)
│   │   ├── ThemeProvider.tsx     # Dark/Light/System theme
│   │   ├── VehicleCard.tsx       # Card xe với carousel + "Từ [giá thấp nhất]"
│   │   ├── SkeletonCard.tsx      # Loading skeleton
│   │   └── ui/                   # 50+ shadcn/ui components
│   └── assets/                   # Static assets
│
├── public/
│   └── robots.txt
├── package.json                  # { "type": "module" }
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vitest.config.ts
├── eslint.config.js
├── postcss.config.js
├── components.json               # shadcn/ui config
└── index.html
```

---

## 5. Database Schema (MongoDB Atlas)

**Database:** `driveflux` — 7 collections:

### vehicles
| Field | Type | Mô tả |
|---|---|---|
| name | string | Tên xe |
| brand | string | Hãng xe |
| type | string | Loại: `car`, `suv`, `luxury`, `van`, `electric` |
| year | number | Năm sản xuất |
| color | string | Màu sắc |
| description | string | Mô tả chi tiết |
| pricePerDay | number | Giá thuê /ngày (VNĐ) |
| pricePerHour | number | Giá thuê /giờ |
| seatCategory | string | `4_cho`, `5_cho`, `7_cho`, `16_cho` |
| selfDrivePrice | number? | Giá tự lái /ngày |
| chauffeurIncluded | boolean? | Có tài xế mặc định |
| licensePlate | string? | Biển số (admin only) |
| images | string[] | URLs ảnh (Cloudinary) |
| features | string[] | Tính năng xe |
| seats | number | Số ghế |
| transmission | string | Hộp số |
| fuel | string | Nhiên liệu |
| rating | number | Đánh giá (1-5) |
| available | boolean | Còn trống |
| **packages** | **VehiclePackage[]** | **Gói dịch vụ riêng cho xe** |
| createdAt | string | Ngày tạo |

### vehicles.packages[] (Embedded)
| Field | Type | Mô tả |
|---|---|---|
| id | string | UUID |
| serviceTypeSlug | string | Slug dịch vụ (`hourly_4h`, `daily`, `trip`...) |
| name | string | Tên gói |
| price | number | Giá (VNĐ) |
| durationHours | number? | Số giờ tối đa |
| maxKm | number? | Số km tối đa |
| description | string? | Mô tả thêm |
| isActive | boolean | Đang hoạt động |

### bookings
| Field | Type | Mô tả |
|---|---|---|
| vehicleId | string | ID xe |
| vehicleName | string | Tên xe (denormalized) |
| customerName | string | Tên khách |
| customerPhone | string | SĐT |
| customerEmail | string? | Email |
| startDate / endDate | string | Ngày bắt đầu / kết thúc |
| status | string | `pending`, `confirmed`, `cancelled` |
| totalPrice | number | Tổng giá |
| deviceId | string | ID thiết bị (tracking) |
| serviceType | string | Slug dịch vụ |
| pickupLocation / dropoffLocation | string? | Điểm đón / điểm đến |
| tripType | string? | `one_way`, `round_trip` |
| routeId | string? | ID tuyến đường |
| packageId | string? | ID gói giá |
| passengers | number? | Số hành khách |
| note | string? | Ghi chú |

### serviceTypes
| Field | Type | Mô tả |
|---|---|---|
| name | string | Tên dịch vụ |
| slug | string | `hourly_4h`, `hourly_8h`, `daily`, `multi_day`, `trip`, `airport`, `self_drive`, `wedding` |
| description | string | Mô tả |
| icon | string | Tên Lucide icon |
| image | string? | URL ảnh banner |
| isActive | boolean | Đang hoạt động |
| order | number | Thứ tự hiển thị |

### routes
| Field | Type | Mô tả |
|---|---|---|
| from / to | string | Điểm đi / đến |
| province | string | Nhóm tỉnh |
| distance | number | Km (cả đi lẫn về) |
| duration | string | "trong ngày", "2 ngày 1 đêm" |
| price4Seat / price7Seat / price16Seat | number | Giá theo loại xe |
| notes | string? | Ghi chú |
| isActive | boolean | Đang hoạt động |

### pricingPackages
| Field | Type | Mô tả |
|---|---|---|
| name / slug | string | Tên + slug gói |
| serviceTypeSlug | string | Liên kết ServiceType |
| durationHours / maxKm | number | Giới hạn giờ / km |
| price4Seat / price7Seat / price16Seat | number | Giá theo loại xe |
| overagePerKm* / overagePerHour* | number | Phí vượt km / giờ |
| weekendSurcharge* | number | Phụ thu cuối tuần |
| includes / excludes | string[] | Bao gồm / không bao gồm |
| isActive | boolean | Đang hoạt động |
| order | number | Thứ tự hiển thị |

### blogPosts
| Field | Type | Mô tả |
|---|---|---|
| title / excerpt / content | string | Tiêu đề, tóm tắt, nội dung |
| image | string | Ảnh đại diện |
| author / date / readTime | string | Tác giả, ngày, thời gian đọc |
| category | string | Danh mục |
| tags | string[]? | Tags SEO |
| isPublished | boolean? | Xuất bản / nháp |

### testimonials
| Field | Type | Mô tả |
|---|---|---|
| name / role / content | string | Tên, vai trò, nội dung |
| rating | number | Đánh giá (1-5) |
| avatar | string | URL avatar |
| date | string? | Ngày đánh giá |

---

## 6. API Endpoints

**Base URL:** `/api`  
**Auth:** Header `Authorization: Bearer <ADMIN_SECRET>` (cho POST/PUT/DELETE)

| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/api/vehicles` | Danh sách xe (query: `?type=suv&available=true`) |
| POST | `/api/vehicles` | Tạo xe mới (kèm packages) |
| GET | `/api/vehicles/[id]` | Chi tiết xe |
| PUT | `/api/vehicles/[id]` | Cập nhật xe (kèm packages) |
| DELETE | `/api/vehicles/[id]` | Xóa xe |
| GET | `/api/bookings` | Danh sách đơn (query: `?deviceId=xxx`) |
| POST | `/api/bookings` | Tạo đơn đặt xe |
| GET | `/api/bookings/[id]` | Chi tiết đơn |
| PUT | `/api/bookings/[id]` | Cập nhật đơn (status) |
| DELETE | `/api/bookings/[id]` | Xóa đơn |
| GET | `/api/blog` | Danh sách bài viết |
| POST | `/api/blog` | Tạo bài viết |
| GET | `/api/blog/[id]` | Chi tiết bài |
| PUT | `/api/blog/[id]` | Cập nhật bài |
| DELETE | `/api/blog/[id]` | Xóa bài |
| GET | `/api/service-types` | Danh sách loại dịch vụ |
| POST | `/api/service-types` | Tạo dịch vụ |
| PUT | `/api/service-types` | Cập nhật dịch vụ |
| DELETE | `/api/service-types` | Xóa dịch vụ |
| GET | `/api/routes` | Danh sách tuyến đường |
| POST | `/api/routes` | Tạo tuyến |
| PUT | `/api/routes` | Cập nhật tuyến |
| DELETE | `/api/routes` | Xóa tuyến |
| GET | `/api/pricing-packages` | Danh sách gói giá |
| POST | `/api/pricing-packages` | Tạo gói |
| PUT | `/api/pricing-packages` | Cập nhật gói |
| DELETE | `/api/pricing-packages` | Xóa gói |
| GET | `/api/testimonials` | Danh sách đánh giá |
| POST | `/api/upload` | Upload ảnh lên Cloudinary |
| POST | `/api/seed` | Seed database (xóa & tạo lại toàn bộ data) |

**Tổng: 12 serverless functions** (giới hạn Vercel Hobby plan)

---

## 7. Frontend Routes

| Path | Component | Mô tả |
|---|---|---|
| `/` | Index | Landing page — hero, dịch vụ, xe nổi bật, video, bảng giá, tuyến đường, testimonial, blog, FAQ, liên hệ |
| `/vehicles` | Vehicles | Danh sách xe + bộ lọc (dịch vụ, loại xe, số ghế, sắp xếp, tìm kiếm). Hỗ trợ `?service=slug` |
| `/vehicles/:id` | VehicleDetail | Chi tiết xe + gallery + bảng gói dịch vụ + nút đặt xe |
| `/booking/:id` | BookingPage | Wizard 3 bước đặt xe (dùng vehicle.packages) |
| `/blog` | Blog | Danh sách bài viết |
| `/blog/:id` | BlogPost | Chi tiết bài viết |
| `/my-bookings` | MyBookings | Tra cứu đơn đặt (theo deviceId, không cần đăng nhập) |
| `/admin` | Admin | Dashboard quản trị (auth bằng admin secret) |
| `*` | NotFound | Trang 404 |

---

## 8. Dữ liệu mẫu (Seed Data)

Chạy `POST /api/seed` sẽ xóa & tạo lại:

| Collection | Số lượng | Chi tiết |
|---|---|---|
| vehicles | 18 | Mercedes S-Class, BMW 7 Series, Rolls-Royce Ghost, Bentley Continental GT, Audi A8 L, Porsche Panamera, Lexus LS 500, Mercedes E-Class, BMW 5 Series, Mercedes GLS 450, Toyota Alphard, Lexus LX 600, Ford Transit 16 chỗ, Mercedes Sprinter VIP 16 chỗ, Toyota Fortuner, Honda CR-V, VinFast VF9, BMW X7 |
| serviceTypes | 8 | hourly_4h, hourly_8h, daily, multi_day, trip, airport, self_drive, wedding |
| routes | 26 | HCM → Vũng Tàu, Đà Lạt, Phan Thiết, Nha Trang, Cần Thơ, Long An, Bình Dương... (3 mức giá) |
| pricingPackages | 5 | Bảng giá global cho landing page |
| bookings | 3 | Đơn đặt mẫu |
| blogPosts | 8 | Bài viết mẫu |
| testimonials | 3 | Đánh giá mẫu |

### Phân loại xe

| Loại | Số xe | Ví dụ |
|---|---|---|
| luxury | 7 | S-Class, BMW 7, Rolls-Royce, Bentley, Audi A8L, Panamera, Lexus LS |
| car (sedan) | 2 | Mercedes E-Class, BMW 5 Series |
| suv | 5 | GLS 450, LX 600, Fortuner, CR-V, BMW X7 |
| van | 3 | Alphard, Transit 16 chỗ, Sprinter VIP 16 chỗ |
| electric | 1 | VinFast VF9 |

### Xe hỗ trợ tự lái

Mercedes E-Class, BMW 5 Series, Toyota Fortuner, Honda CR-V, VinFast VF9

---

## 9. Cài đặt & Chạy local

### Yêu cầu

- Node.js ≥ 18 (khuyến nghị 20)
- npm hoặc yarn
- Vercel CLI (`npm i -g vercel`)

### Các bước

```bash
# 1. Clone repo
git clone https://github.com/lamkhoi-dev/car_CRM.git
cd car_CRM

# 2. Cài dependencies
npm install

# 3. Tạo file .env (hoặc set trên Vercel dashboard)
#    MONGODB_URI=mongodb+srv://...
#    CLOUDINARY_CLOUD_NAME=...
#    CLOUDINARY_API_KEY=...
#    CLOUDINARY_API_SECRET=...
#    ADMIN_SECRET=...

# 4. Chạy dev (frontend only)
npm run dev
# → http://localhost:8080

# 5. Chạy full-stack với Vercel CLI
vercel dev
# → http://localhost:3000 (frontend + serverless functions)

# 6. Seed database (sau khi backend chạy)
curl -X POST http://localhost:3000/api/seed \
  -H "Authorization: Bearer <ADMIN_SECRET>"
```

### Scripts

| Script | Mô tả |
|---|---|
| `npm run dev` | Chạy Vite dev server (port 8080) |
| `npm run build` | Build production |
| `npm run preview` | Preview production build |
| `npm run lint` | ESLint |
| `npm run test` | Vitest |
| `npm run test:watch` | Vitest watch mode |

---

## 10. Deploy (Vercel)

- **Platform:** Vercel (Hobby plan)
- **Auto-deploy:** Push to `main` → auto build & deploy
- **Runtime:** Node.js 20.x
- **Build command:** `vite build`
- **Output:** `dist/`
- **Serverless functions:** `api/` directory (auto-detected)
- **Function limit:** 12 functions (Hobby plan max)

### Environment Variables (Vercel Dashboard)

| Biến | Mô tả |
|---|---|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `ADMIN_SECRET` | Admin authentication secret |

---

## 11. Luồng nghiệp vụ chính

### Đặt xe (Customer Flow)

```
Trang chủ / Danh sách xe
    │
    ▼ Chọn xe
Chi tiết xe (xem gallery, specs, gói dịch vụ)
    │
    ▼ Nhấn "Đặt xe"
Bước 1: Chọn loại dịch vụ (chỉ hiện dịch vụ xe hỗ trợ)
    │
    ▼
Bước 2: Chi tiết (ngày, giờ, tuyến đường, điểm đón/trả)
    │
    ▼
Bước 3: Xác nhận + điền thông tin liên hệ
    │
    ▼
Tạo booking (status: pending) → Redirect /my-bookings
```

### Quản lý (Admin Flow)

```
/admin → Nhập admin secret → Dashboard
    │
    ├── Tab Xe: CRUD xe + quản lý gói dịch vụ (packages) per-vehicle
    ├── Tab Đơn đặt: Xem, xác nhận, hủy đơn
    ├── Tab Blog: CRUD bài viết (draft/publish)
    ├── Tab Dịch vụ: CRUD loại dịch vụ (8 loại)
    ├── Tab Tuyến đường: CRUD tuyến HCM đi tỉnh
    └── Tab Gói giá: CRUD bảng giá global
```

---

## 12. Ghi chú kỹ thuật

- **Frontend** dùng `"type": "module"` (ESM), **API functions** dùng `"type": "commonjs"` (yêu cầu của Vercel)
- **MongoDB connection** được cache (singleton pattern) để tối ưu cold start
- **CORS** được handle trong `helpers.ts` cho preflight requests
- **Image upload** qua Cloudinary SDK, trả về secure URL
- **Device tracking** bằng UUID lưu trong localStorage (`getDeviceId()`)
- **React Query** với `staleTime` và `refetchOnWindowFocus` để giảm API calls
- **Admin auth**: Bearer token đơn giản, không có user management
- **SEO**: Meta tags qua `document.title`, Open Graph tags trong `index.html`
- **Tailwind CSS variables**: Theme colors được define trong `index.css` cho dark/light mode

---

*Cập nhật lần cuối: Tháng 7/2025*
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
