import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb } from './_lib/mongodb';
import { setCors, isAdmin } from './_lib/helpers';

// Dữ liệu seed ban đầu — VNĐ, ảnh Cloudinary thật
const seedVehicles = [
  {
    name: 'Mercedes-Benz S-Class',
    type: 'luxury',
    description: 'Trải nghiệm đẳng cấp thượng lưu cùng Mercedes S-Class. Nội thất sang trọng, công nghệ tiên tiến và sự êm ái tuyệt đối trên mọi cung đường.',
    pricePerDay: 8000000,
    pricePerHour: 1200000,
    images: [
      'https://res.cloudinary.com/dpr6zwanv/image/upload/v1772344364/carCRM/vehicles/xe_A/xe_A__1_.jpg',
      'https://res.cloudinary.com/dpr6zwanv/image/upload/v1772344374/carCRM/vehicles/xe_A/xe_A__2_.jpg',
      'https://res.cloudinary.com/dpr6zwanv/image/upload/v1772344379/carCRM/vehicles/xe_A/xe_A__3_.jpg',
    ],
    features: ['Massage Seats', 'Burmester Sound', 'HUD', 'Air Suspension'],
    seats: 5,
    transmission: 'Automatic',
    fuel: 'Petrol',
    rating: 4.9,
    available: true,
  },
  {
    name: 'BMW 7 Series',
    type: 'luxury',
    description: 'BMW 7 Series kết hợp hoàn hảo giữa hiệu suất vận hành mạnh mẽ và không gian nội thất đẳng cấp. Lựa chọn lý tưởng cho những chuyến đi quan trọng.',
    pricePerDay: 7500000,
    pricePerHour: 1100000,
    images: [
      'https://res.cloudinary.com/dpr6zwanv/image/upload/v1772344380/carCRM/vehicles/xe_B/xe_B__1_.jpg',
      'https://res.cloudinary.com/dpr6zwanv/image/upload/v1772344382/carCRM/vehicles/xe_B/xe_B__2_.jpg',
      'https://res.cloudinary.com/dpr6zwanv/image/upload/v1772344383/carCRM/vehicles/xe_B/xe_B__3_.jpg',
      'https://res.cloudinary.com/dpr6zwanv/image/upload/v1772344384/carCRM/vehicles/xe_B/xe_B__4_.jpg',
    ],
    features: ['Sky Lounge Roof', 'Rear Entertainment', 'Gesture Control', 'Parking Assist'],
    seats: 5,
    transmission: 'Automatic',
    fuel: 'Petrol',
    rating: 4.8,
    available: true,
  },
  {
    name: 'Rolls-Royce Ghost',
    type: 'luxury',
    description: 'Biểu tượng của sự xa xỉ — Rolls-Royce Ghost mang đến trải nghiệm lái êm ái như trên mây. Hoàn hảo cho đám cưới, sự kiện và dịp đặc biệt.',
    pricePerDay: 25000000,
    pricePerHour: 4000000,
    images: [
      'https://res.cloudinary.com/dpr6zwanv/image/upload/v1772344385/carCRM/vehicles/xe_C/z7565410145617_6d64fe9be1a50b507016ea0d3b87c64f.jpg',
      'https://res.cloudinary.com/dpr6zwanv/image/upload/v1772344385/carCRM/vehicles/xe_C/z7565410145654_2231cf92ac380174cfe429185a0bb3e3.jpg',
      'https://res.cloudinary.com/dpr6zwanv/image/upload/v1772344386/carCRM/vehicles/xe_C/z7565410145678_7f753c1067c41c4c7b0fdf390070625d.jpg',
      'https://res.cloudinary.com/dpr6zwanv/image/upload/v1772344388/carCRM/vehicles/xe_C/z7565410145680_2e78b84bbd292bc4d0257a54762d20f0.jpg',
      'https://res.cloudinary.com/dpr6zwanv/image/upload/v1772344389/carCRM/vehicles/xe_C/z7565410145703_ae0b30e21a6aaf03ea2e7a292d52ab84.jpg',
      'https://res.cloudinary.com/dpr6zwanv/image/upload/v1772344390/carCRM/vehicles/xe_C/z7565410145704_ddb8931bf487cf81319704d4da5e6f98.jpg',
    ],
    features: ['Starlight Headliner', 'Champagne Cooler', 'Lamb Wool Floor Mats', 'Bespoke Audio'],
    seats: 5,
    transmission: 'Automatic',
    fuel: 'Petrol',
    rating: 5.0,
    available: true,
  },
  {
    name: 'Bentley Continental GT',
    type: 'luxury',
    description: 'Bentley Continental GT — sự kết hợp giữa hiệu suất siêu xe và sự sang trọng tối thượng. Nội thất handcrafted bằng da và gỗ quý.',
    pricePerDay: 20000000,
    pricePerHour: 3500000,
    images: [
      'https://res.cloudinary.com/dpr6zwanv/image/upload/v1772344406/carCRM/vehicles/xe_D/z7565410179977_7a0b5805eaca74f148ccd0432bfc9ed3.jpg',
      'https://res.cloudinary.com/dpr6zwanv/image/upload/v1772344407/carCRM/vehicles/xe_D/z7565410179978_9803385b05908b65e177695e272f651b.jpg',
      'https://res.cloudinary.com/dpr6zwanv/image/upload/v1772344409/carCRM/vehicles/xe_D/z7565410179981_c2e09a0ad173e5572197e49dd714edb4.jpg',
      'https://res.cloudinary.com/dpr6zwanv/image/upload/v1772344410/carCRM/vehicles/xe_D/z7565410179983_e9a5e38e661bd8731c92701d99732424.jpg',
      'https://res.cloudinary.com/dpr6zwanv/image/upload/v1772344410/carCRM/vehicles/xe_D/z7565410179985_2283818ebe886cf863ac44419e153548.jpg',
      'https://res.cloudinary.com/dpr6zwanv/image/upload/v1772344412/carCRM/vehicles/xe_D/z7565410179987_e371e35605e88be7d5a892a35d5b36db.jpg',
    ],
    features: ['W12 Engine', 'Naim Audio', 'Diamond Knurling', 'Rotating Display'],
    seats: 4,
    transmission: 'Automatic',
    fuel: 'Petrol',
    rating: 4.9,
    available: true,
  },
];

const seedBookings = [
  {
    vehicleId: 'seed-1',
    vehicleName: 'Mercedes-Benz S-Class',
    customerName: 'Nguyễn Văn An',
    customerPhone: '0901 234 567',
    startDate: '2026-03-05',
    endDate: '2026-03-07',
    status: 'confirmed',
    totalPrice: 16000000,
    createdAt: '2026-02-25',
  },
  {
    vehicleId: 'seed-3',
    vehicleName: 'Rolls-Royce Ghost',
    customerName: 'Trần Thị Bích',
    customerPhone: '0912 345 678',
    startDate: '2026-03-10',
    endDate: '2026-03-11',
    status: 'pending',
    totalPrice: 25000000,
    createdAt: '2026-02-26',
  },
  {
    vehicleId: 'seed-4',
    vehicleName: 'Bentley Continental GT',
    customerName: 'Lê Hoàng Minh',
    customerPhone: '0938 456 789',
    startDate: '2026-03-15',
    endDate: '2026-03-17',
    status: 'pending',
    totalPrice: 40000000,
    createdAt: '2026-02-28',
  },
];

const seedBlogPosts = [
  {
    title: 'Thuê xe cưới sang trọng — Trọn vẹn ngày trọng đại',
    excerpt: 'Tổng hợp kinh nghiệm thuê xe hoa đẳng cấp cho lễ cưới. Rolls-Royce, Bentley hay Mercedes — đâu là lựa chọn phù hợp?',
    content: `Ngày cưới là một trong những ngày quan trọng nhất cuộc đời. Chiếc xe hoa không chỉ là phương tiện di chuyển mà còn là biểu tượng cho phong cách và đẳng cấp của cặp đôi.\n\n**Rolls-Royce Ghost** — lựa chọn số 1 cho đám cưới thượng lưu. Thiết kế cổ điển, nội thất sang trọng với Starlight Headliner tạo nên không gian lung linh.\n\n**Bentley Continental GT** — phù hợp cho cặp đôi yêu thích sự năng động. Xe toát lên vẻ mạnh mẽ nhưng vẫn giữ được sự tinh tế.\n\n**Mercedes S-Class** — lựa chọn cân bằng giữa sang trọng và tiết kiệm. Với giá thuê hợp lý hơn, S-Class vẫn mang đến trải nghiệm xe hoa đẳng cấp.\n\nChúng tôi cung cấp dịch vụ trang trí hoa tươi, ruy-băng và tài xế chuyên nghiệp đi kèm.`,
    image: 'https://res.cloudinary.com/dpr6zwanv/image/upload/v1772344333/carCRM/blog/blog_dam_cuoi__1_.jpg',
    author: 'DriveFlux Team',
    date: '2026-02-20',
    readTime: '5 phút đọc',
    category: 'Xe Cưới',
  },
  {
    title: 'Top 4 xe sang cho thuê được yêu thích nhất 2026',
    excerpt: 'Khám phá những dòng xe sang được khách hàng ưa chuộng nhất tại DriveFlux trong năm 2026.',
    content: `Năm 2026 chứng kiến nhu cầu thuê xe sang tăng vọt tại Việt Nam. Dưới đây là 4 mẫu xe được đặt nhiều nhất:\n\n**1. Rolls-Royce Ghost** — Vua của dòng xe siêu sang, luôn cháy booking cho các sự kiện lớn. Giá thuê từ 25 triệu/ngày.\n\n**2. Bentley Continental GT** — Thiết kế thể thao kết hợp nội thất handcrafted. Lý tưởng cho các buổi chụp hình và sự kiện cao cấp.\n\n**3. Mercedes-Benz S-Class** — Đẳng cấp doanh nhân, phù hợp cho hội nghị, đón khách VIP. Giá thuê từ 8 triệu/ngày.\n\n**4. BMW 7 Series** — Cân bằng hoàn hảo giữa công nghệ và sang trọng. Được ưa chuộng cho các chuyến công tác.\n\nĐặt xe sớm để nhận ưu đãi tốt nhất!`,
    image: 'https://res.cloudinary.com/dpr6zwanv/image/upload/v1772344335/carCRM/blog/blog_dam_cuoi__2_.jpg',
    author: 'DriveFlux Team',
    date: '2026-02-15',
    readTime: '4 phút đọc',
    category: 'Xe Sang',
  },
  {
    title: 'Kinh nghiệm thuê xe tự lái — Những điều cần biết',
    excerpt: 'Hướng dẫn chi tiết từ A-Z cho người lần đầu thuê xe tự lái: giấy tờ, bảo hiểm, kiểm tra xe và các lưu ý quan trọng.',
    content: `Thuê xe tự lái ngày càng phổ biến tại Việt Nam. Dưới đây là những kinh nghiệm quan trọng:\n\n**Giấy tờ cần chuẩn bị:**\n- CMND/CCCD bản gốc\n- Bằng lái xe còn hiệu lực\n- Hộ khẩu hoặc KT3\n\n**Kiểm tra xe trước khi nhận:**\n- Chụp ảnh toàn bộ xe, đặc biệt các vết xước\n- Kiểm tra lốp, đèn, gạt mưa\n- Đọc kỹ hợp đồng thuê\n\n**Bảo hiểm:**\n- Luôn chọn gói bảo hiểm toàn diện\n- Hỏi rõ mức khấu trừ khi có sự cố\n\n**Mẹo tiết kiệm:**\n- Đặt xe sớm 3-5 ngày để có giá tốt\n- Thuê dài ngày được giảm giá\n- Kiểm tra chương trình khuyến mãi định kỳ\n\nTại DriveFlux, chúng tôi cam kết xe luôn mới, bảo dưỡng đầy đủ và hỗ trợ khách hàng 24/7.`,
    image: 'https://res.cloudinary.com/dpr6zwanv/image/upload/v1772344339/carCRM/blog/blog_dam_cuoi__3_.jpg',
    author: 'DriveFlux Team',
    date: '2026-02-10',
    readTime: '6 phút đọc',
    category: 'Kinh Nghiệm',
  },
  {
    title: 'Dịch vụ xe đưa đón sân bay — Sang trọng & Đúng giờ',
    excerpt: 'DriveFlux ra mắt dịch vụ đưa đón sân bay với đội xe sang và tài xế chuyên nghiệp, phục vụ 24/7.',
    content: `Chúng tôi hiểu rằng ấn tượng đầu tiên rất quan trọng. Dịch vụ đưa đón sân bay của DriveFlux đảm bảo:\n\n**Đội xe đẳng cấp:** Mercedes S-Class, BMW 7 Series luôn sẵn sàng phục vụ.\n\n**Tài xế chuyên nghiệp:** Đồng phục lịch sự, am hiểu đường phố, luôn đúng giờ.\n\n**Phục vụ 24/7:** Kể cả chuyến bay lúc nửa đêm, chúng tôi luôn có mặt.\n\n**Giá cả minh bạch:**\n- Sân bay Tân Sơn Nhất → Quận 1: từ 1.200.000₫\n- Sân bay Nội Bài → Hà Nội: từ 1.500.000₫\n\nĐặt trước 24h để đảm bảo xe sẵn sàng. Liên hệ hotline hoặc đặt trực tiếp trên website.`,
    image: 'https://res.cloudinary.com/dpr6zwanv/image/upload/v1772344342/carCRM/blog/blog_dam_cuoi__4_.jpg',
    author: 'DriveFlux Team',
    date: '2026-02-05',
    readTime: '3 phút đọc',
    category: 'Dịch Vụ',
  },
];

const seedTestimonials = [
  {
    name: 'Anh Minh T.',
    role: 'Doanh nhân',
    content: 'Dịch vụ xuất sắc! Mercedes S-Class sạch sẽ, mới tinh. Quy trình đặt xe nhanh gọn, tài xế chuyên nghiệp. Chắc chắn sẽ thuê lại!',
    rating: 5,
    avatar: 'MT',
  },
  {
    name: 'Chị Linh N.',
    role: 'Cô dâu',
    content: 'Thuê Rolls-Royce cho ngày cưới và không thể hài lòng hơn. Xe đẹp lung linh, nhân viên hỗ trợ trang trí hoa rất chỉn chu. Cảm ơn DriveFlux!',
    rating: 5,
    avatar: 'LN',
  },
  {
    name: 'Anh Khoa P.',
    role: 'Giám đốc Marketing',
    content: 'Đặt Bentley Continental GT cho event công ty, khách hàng VIP rất ấn tượng. Giá hợp lý cho chất lượng 5 sao. Highly recommended!',
    rating: 5,
    avatar: 'KP',
  },
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST to seed data.' });
  }

  if (!isAdmin(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const db = await getDb();

    // Clear existing data
    await Promise.all([
      db.collection('vehicles').deleteMany({}),
      db.collection('bookings').deleteMany({}),
      db.collection('blogPosts').deleteMany({}),
      db.collection('testimonials').deleteMany({}),
    ]);

    // Insert seed data
    const [vehiclesResult, bookingsResult, blogResult, testimonialsResult] = await Promise.all([
      db.collection('vehicles').insertMany(seedVehicles),
      db.collection('bookings').insertMany(seedBookings),
      db.collection('blogPosts').insertMany(seedBlogPosts),
      db.collection('testimonials').insertMany(seedTestimonials),
    ]);

    // Update booking vehicleIds to match actual inserted vehicle IDs
    const vehicleIds = Object.values(vehiclesResult.insertedIds);
    const bookingUpdates = [
      db.collection('bookings').updateOne(
        { vehicleName: 'Mercedes-Benz S-Class' },
        { $set: { vehicleId: vehicleIds[0].toString() } }
      ),
      db.collection('bookings').updateOne(
        { vehicleName: 'Rolls-Royce Ghost' },
        { $set: { vehicleId: vehicleIds[2].toString() } }
      ),
      db.collection('bookings').updateOne(
        { vehicleName: 'Bentley Continental GT' },
        { $set: { vehicleId: vehicleIds[3].toString() } }
      ),
    ];
    await Promise.all(bookingUpdates);

    return res.json({
      success: true,
      inserted: {
        vehicles: vehiclesResult.insertedCount,
        bookings: bookingsResult.insertedCount,
        blogPosts: blogResult.insertedCount,
        testimonials: testimonialsResult.insertedCount,
      },
    });
  } catch (error: any) {
    console.error('Seed error:', error);
    return res.status(500).json({ error: error.message || 'Seed failed' });
  }
}
