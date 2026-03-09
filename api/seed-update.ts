import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb } from './_lib/mongodb';
import { setCors, isAdmin } from './_lib/helpers';

/**
 * POST /api/seed-update
 * Cập nhật DB hiện tại KHÔNG xóa data cũ:
 * 1. Routes: thêm field price29Seat cho tất cả routes
 * 2. PricingPackages: thêm fields 29-seat cho tất cả packages
 * 3. Vehicles: đổi tên Ford Transit / Sprinter (16→18 chỗ), thêm 2 xe 29 chỗ mới
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  if (!isAdmin(req)) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const db = await getDb();
    const results: string[] = [];

    // ─── 1. Update Routes: add price29Seat ────────────────
    const routePrice29Map: Record<string, number> = {
      'City Tour 4 tiếng/50km': 1800000,
      'City Tour 8 tiếng/100km': 2000000,
      'Tự do 10 tiếng/150km': 2500000,
      'TP Vũng Tàu (trong ngày)': 3000000,
      'Vũng Tàu (1 chiều)': 2500000,
      'Vũng Tàu 2 ngày 1 đêm': 4500000,
      'Long Hải - Dinh Cô': 3000000,
      'Hồ Tràm (trong ngày)': 3300000,
      'Biên Hòa (8 tiếng)': 2100000,
      'Long Khánh': 2800000,
      'Thủ Dầu Một (8 tiếng)': 2100000,
      'Mỹ Tho': 2500000,
      'Tân An (Long An)': 2200000,
      'Núi Bà Đen': 2800000,
      'Phan Thiết (trong ngày)': 4000000,
      'Mũi Né 2 ngày 1 đêm': 6000000,
      'Đà Lạt (trong ngày)': 6000000,
      'Đà Lạt 2 ngày 1 đêm': 8000000,
      'Đà Lạt 3 ngày 2 đêm': 9800000,
      'Bảo Lộc': 4200000,
      'Nha Trang (1 chiều)': 7200000,
      'Nha Trang 2 ngày 1 đêm': 9000000,
      'Cần Thơ (trong ngày)': 3600000,
      'Cần Thơ 2 ngày 1 đêm': 5200000,
      'Châu Đốc (trong ngày)': 5500000,
      'TP Bến Tre': 2800000,
    };

    for (const [to, price29] of Object.entries(routePrice29Map)) {
      await db.collection('routes').updateOne(
        { to },
        { $set: { price29Seat: price29 } }
      );
    }
    // Also rename price16Seat → price18Seat if old field exists
    await db.collection('routes').updateMany(
      { price16Seat: { $exists: true } },
      [{ $set: { price18Seat: '$price16Seat' } }, { $unset: 'price16Seat' }] as any
    );
    results.push(`Routes: updated price29Seat for ${Object.keys(routePrice29Map).length} routes`);

    // ─── 2. Update PricingPackages: add 29-seat fields ───
    const pkgUpdates: Record<string, Record<string, number>> = {
      'pkg_4h': { price29Seat: 1800000, overagePerKm29Seat: 12000, overagePerHour29Seat: 120000, weekendSurcharge29Seat: 400000 },
      'pkg_8h': { price29Seat: 2200000, overagePerKm29Seat: 12000, overagePerHour29Seat: 120000, weekendSurcharge29Seat: 400000 },
      'pkg_200km': { price29Seat: 3200000, overagePerKm29Seat: 10000, overagePerHour29Seat: 120000, weekendSurcharge29Seat: 400000 },
      'pkg_300km': { price29Seat: 4200000, overagePerKm29Seat: 10000, overagePerHour29Seat: 120000, weekendSurcharge29Seat: 400000 },
      'pkg_400km': { price29Seat: 5500000, overagePerKm29Seat: 10000, overagePerHour29Seat: 120000, weekendSurcharge29Seat: 400000 },
    };

    for (const [slug, fields] of Object.entries(pkgUpdates)) {
      await db.collection('pricingPackages').updateOne(
        { slug },
        { $set: fields }
      );
    }
    // Rename old 16Seat fields → 18Seat
    await db.collection('pricingPackages').updateMany(
      { price16Seat: { $exists: true } },
      [
        { $set: {
          price18Seat: '$price16Seat',
          overagePerKm18Seat: '$overagePerKm16Seat',
          overagePerHour18Seat: '$overagePerHour16Seat',
          weekendSurcharge18Seat: '$weekendSurcharge16Seat',
        }},
        { $unset: ['price16Seat', 'overagePerKm16Seat', 'overagePerHour16Seat', 'weekendSurcharge16Seat'] },
      ] as any
    );
    results.push(`PricingPackages: updated 29-seat fields for ${Object.keys(pkgUpdates).length} packages`);

    // ─── 3. Update existing 16-seat vehicles → 18 seat ──
    const transitUpdate = await db.collection('vehicles').updateOne(
      { name: { $regex: /Ford Transit/i } },
      { $set: {
        name: 'Ford Transit Luxury 18 chỗ',
        description: 'Ford Transit Luxury 18 chỗ — lý tưởng cho du lịch nhóm, team building, đưa đón sự kiện.',
        seatCategory: '18_cho',
        seats: 18,
      }}
    );
    const sprinterUpdate = await db.collection('vehicles').updateOne(
      { name: { $regex: /Sprinter/i } },
      { $set: {
        name: 'Mercedes Sprinter VIP',
        description: 'Mercedes Sprinter VIP — xe sang 18 chỗ dành cho đoàn khách VIP, nội thất da cao cấp, mini bar.',
        seatCategory: '18_cho',
        seats: 18,
      }}
    );
    results.push(`Vehicles: Transit updated=${transitUpdate.modifiedCount}, Sprinter updated=${sprinterUpdate.modifiedCount}`);

    // ─── 4. Insert 2 new 29-seat vehicles ───────────────
    const existing29 = await db.collection('vehicles').countDocuments({ seatCategory: '29_cho' });
    if (existing29 === 0) {
      const new29Vehicles = [
        {
          name: 'Hyundai County 29 chỗ',
          brand: 'Hyundai',
          type: 'van',
          year: 2024,
          color: 'Trắng Ngà',
          description: 'Hyundai County 29 chỗ — xe khách cỡ trung phổ biến nhất Việt Nam. Phù hợp cho du lịch đoàn, team building, sự kiện.',
          pricePerDay: 4000000,
          pricePerHour: 600000,
          seatCategory: '29_cho',
          selfDrivePrice: 0,
          chauffeurIncluded: true,
          licensePlate: '51B-290.29',
          images: [
            'https://res.cloudinary.com/dpr6zwanv/image/upload/v1772344379/carCRM/vehicles/xe_A/xe_A__3_.jpg',
            'https://res.cloudinary.com/dpr6zwanv/image/upload/v1772344364/carCRM/vehicles/xe_A/xe_A__1_.jpg',
          ],
          features: ['29 Seats', 'AC', 'USB Ports', 'Luggage Compartment', 'Reclining Seats'],
          seats: 29,
          transmission: 'Manual',
          fuel: 'Diesel',
          rating: 4.5,
          available: true,
          createdAt: '2026-01-25T00:00:00Z',
          packages: [
            { id: 'pkg-s19-1', serviceTypeSlug: 'hourly_4h', name: 'Gói 4 tiếng', price: 1800000, durationHours: 4, maxKm: 50, isActive: true },
            { id: 'pkg-s19-2', serviceTypeSlug: 'hourly_8h', name: 'Gói 8 tiếng', price: 2200000, durationHours: 8, maxKm: 100, isActive: true },
            { id: 'pkg-s19-3', serviceTypeSlug: 'daily', name: 'Theo ngày', price: 4000000, durationHours: 12, maxKm: 200, isActive: true },
            { id: 'pkg-s19-4', serviceTypeSlug: 'multi_day', name: 'Nhiều ngày', price: 3500000, durationHours: 24, maxKm: 300, description: 'Giá/ngày, thuê từ 2 ngày', isActive: true },
            { id: 'pkg-s19-5', serviceTypeSlug: 'trip', name: 'Thuê đi tỉnh', price: 4000000, description: 'Giá tùy tuyến, liên hệ báo giá', isActive: true },
          ],
        },
        {
          name: 'Thaco Town TB82S 29 chỗ',
          brand: 'Thaco',
          type: 'van',
          year: 2024,
          color: 'Xanh Dương',
          description: 'Thaco Town TB82S — xe khách 29 chỗ cao cấp, ghế ngồi êm ái, hệ thống giải trí hiện đại. Lý tưởng cho tour du lịch dài ngày.',
          pricePerDay: 4500000,
          pricePerHour: 700000,
          seatCategory: '29_cho',
          selfDrivePrice: 0,
          chauffeurIncluded: true,
          licensePlate: '51B-290.88',
          images: [
            'https://res.cloudinary.com/dpr6zwanv/image/upload/v1772344380/carCRM/vehicles/xe_B/xe_B__1_.jpg',
            'https://res.cloudinary.com/dpr6zwanv/image/upload/v1772344383/carCRM/vehicles/xe_B/xe_B__3_.jpg',
          ],
          features: ['29 Seats', 'Premium AC', 'LCD Entertainment', 'Large Luggage', 'Curtains'],
          seats: 29,
          transmission: 'Manual',
          fuel: 'Diesel',
          rating: 4.6,
          available: true,
          createdAt: '2026-01-25T00:00:00Z',
          packages: [
            { id: 'pkg-s20-1', serviceTypeSlug: 'hourly_4h', name: 'Gói 4 tiếng', price: 2000000, durationHours: 4, maxKm: 50, isActive: true },
            { id: 'pkg-s20-2', serviceTypeSlug: 'hourly_8h', name: 'Gói 8 tiếng', price: 2500000, durationHours: 8, maxKm: 100, isActive: true },
            { id: 'pkg-s20-3', serviceTypeSlug: 'daily', name: 'Theo ngày', price: 4500000, durationHours: 12, maxKm: 200, isActive: true },
            { id: 'pkg-s20-4', serviceTypeSlug: 'multi_day', name: 'Nhiều ngày', price: 4000000, durationHours: 24, maxKm: 300, description: 'Giá/ngày, thuê từ 2 ngày', isActive: true },
            { id: 'pkg-s20-5', serviceTypeSlug: 'airport', name: 'Đưa đón sân bay', price: 2200000, durationHours: 3, maxKm: 40, isActive: true },
            { id: 'pkg-s20-6', serviceTypeSlug: 'trip', name: 'Thuê đi tỉnh', price: 4500000, description: 'Giá tùy tuyến, liên hệ báo giá', isActive: true },
          ],
        },
      ];

      const insertResult = await db.collection('vehicles').insertMany(new29Vehicles);
      results.push(`Vehicles: inserted ${insertResult.insertedCount} new 29-seat vehicles`);
    } else {
      results.push(`Vehicles: 29-seat vehicles already exist (${existing29} found), skipped insert`);
    }

    return res.status(200).json({
      success: true,
      message: 'Database updated (no reset)',
      details: results,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
