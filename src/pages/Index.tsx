import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Shield,
  Clock,
  Star,
  ChevronRight,
  Phone,
  MapPin,
  CheckCircle2,
  ChevronDown,
  Car,
  Users,
  Calendar,
} from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import { useVehicles } from "@/hooks/useVehicles";
import { useTestimonials } from "@/hooks/useBlog";
import { useServiceTypes, usePricingPackages, useRoutes } from "@/hooks/useServices";
import VehicleCard from "@/components/VehicleCard";
import SkeletonCard from "@/components/SkeletonCard";
import { formatVND } from "@/lib/utils";
import { useState } from "react";

/* ── Cloudinary URLs ── */
const VIDEO_URL =
  "https://res.cloudinary.com/dpr6zwanv/video/upload/v1772344373/carCRM/vehicles/xe_A/xe_A__1_.mp4";
const GALLERY = [
  "https://res.cloudinary.com/dpr6zwanv/image/upload/v1772344344/carCRM/landing/landingpage__1_.jpg",
  "https://res.cloudinary.com/dpr6zwanv/image/upload/v1772344350/carCRM/landing/landingpage__2_.jpg",
  "https://res.cloudinary.com/dpr6zwanv/image/upload/v1772344352/carCRM/landing/landingpage__3_.jpg",
  "https://res.cloudinary.com/dpr6zwanv/image/upload/v1772344354/carCRM/landing/landingpage__4_.jpg",
  "https://res.cloudinary.com/dpr6zwanv/image/upload/v1772344357/carCRM/landing/landingpage__5_.jpg",
  "https://res.cloudinary.com/dpr6zwanv/image/upload/v1772344360/carCRM/landing/landingpage__6_.jpg",
  "https://res.cloudinary.com/dpr6zwanv/image/upload/v1772344362/carCRM/landing/landingpage__7_.jpg",
];

/* ── Pricing data ── */
const SERVICE_ICONS: Record<string, string> = {
  hourly_4h: '⏰', hourly_8h: '🕐', daily: '📅', multi_day: '🗓️',
  trip: '📍', airport: '✈️', self_drive: '🔑', wedding: '💒',
};

/* ── FAQ data ── */
const FAQ = [
  {
    q: "Cần giấy tờ gì để thuê xe?",
    a: "Bạn cần CMND/CCCD bản gốc còn hiệu lực và Bằng lái xe (B2 trở lên). Với xe tự lái, cần thêm hộ khẩu hoặc KT3.",
  },
  {
    q: "Có cần đặt cọc không?",
    a: "Đặt cọc 30-50% giá trị đơn thuê để giữ xe. Hoàn cọc 100% nếu hủy trước 48 giờ.",
  },
  {
    q: "Xe có tài xế hay tự lái?",
    a: "Cả hai! Chúng tôi cung cấp dịch vụ thuê xe có tài xế hoặc tự lái tùy nhu cầu. Tài xế chuyên nghiệp, đồng phục lịch sự.",
  },
  {
    q: "Giá có bao gồm xăng và bảo hiểm?",
    a: "Giá thuê đã bao gồm bảo hiểm xe. Xăng sẽ do khách hàng tự chi trả. Với dịch vụ có tài xế, giá đã bao gồm xăng trong phạm vi nội thành.",
  },
  {
    q: "Có phục vụ ngoại tỉnh không?",
    a: "Có! Chúng tôi phục vụ toàn quốc. Với lộ trình ngoại tỉnh, vui lòng liên hệ trước 24h để sắp xếp xe và tài xế phù hợp.",
  },
  {
    q: "Thuê dài ngày có được giảm giá không?",
    a: "Thuê từ 3 ngày giảm 10%, từ 7 ngày giảm 15%, từ 30 ngày giảm 25%. Liên hệ để nhận báo giá tốt nhất.",
  },
];

/* ── Process steps ── */
const STEPS = [
  { icon: Car, title: "Chọn xe", desc: "Duyệt đội xe sang và chọn chiếc phù hợp" },
  { icon: Calendar, title: "Đặt lịch", desc: "Chọn ngày thuê và điền thông tin" },
  { icon: CheckCircle2, title: "Xác nhận", desc: "Nhận xác nhận qua điện thoại" },
  { icon: MapPin, title: "Nhận xe", desc: "Nhận xe tại địa điểm hoặc giao tận nơi" },
];

/* ── FAQ Accordion Item ── */
const FaqItem = ({ q, a }: { q: string; a: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border/50">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-4 text-left"
      >
        <span className="pr-4 text-sm font-semibold text-foreground sm:text-base">{q}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        className="overflow-hidden"
      >
        <p className="pb-4 text-sm leading-relaxed text-muted-foreground">{a}</p>
      </motion.div>
    </div>
  );
};

const Index = () => {
  const { data: vehicles = [], isLoading: loadingVehicles } = useVehicles();
  const { data: testimonials = [] } = useTestimonials();
  const { data: serviceTypes = [] } = useServiceTypes();
  const { data: pricingPackages = [] } = usePricingPackages();
  const { data: routes = [] } = useRoutes();
  const [pricingTab, setPricingTab] = useState<'packages' | 'routes'>('packages');

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      {/* ────────── Hero ────────── */}
      <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden">
        <img
          src={heroBg}
          alt="Luxury vehicle"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/30 to-background/80" />
        <div className="absolute inset-0 bg-background/20" />

        <div className="container relative z-10 px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mx-auto max-w-3xl"
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-4 inline-block rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary backdrop-blur-sm"
            >
              Dịch vụ cho thuê xe sang
            </motion.span>

            <h1 className="mb-6 font-display text-4xl font-black leading-tight tracking-tight text-foreground sm:text-5xl md:text-7xl">
              Trải nghiệm{" "}
              <span className="gradient-text">Đẳng Cấp</span>
            </h1>

            <p className="mx-auto mb-8 max-w-xl text-base text-muted-foreground sm:text-lg">
              Cho thuê xe sang cho mọi dịp. Đặt xe nhanh chóng,
              dịch vụ chuyên nghiệp, trải nghiệm khó quên.
            </p>

            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                to="/vehicles"
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 sm:w-auto"
              >
                Thuê Ngay
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href="tel:0922225599"
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-secondary/50 px-8 py-4 text-sm font-semibold text-secondary-foreground backdrop-blur-sm transition-all hover:bg-secondary sm:w-auto"
              >
                <Phone className="h-4 w-4" />
                0922 225 599
              </a>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="h-10 w-6 rounded-full border-2 border-muted-foreground/30 p-1"
          >
            <div className="h-2 w-full rounded-full bg-primary" />
          </motion.div>
        </motion.div>
      </section>

      {/* ────────── Stats ────────── */}
      <section className="border-b border-border/50 bg-card/50">
        <div className="container grid grid-cols-2 gap-4 py-8 sm:grid-cols-4 sm:divide-x sm:divide-border/50 sm:gap-0">
          {[
            { value: "50+", label: "Xe sang" },
            { value: "2K+", label: "Khách hàng" },
            { value: "4.9", label: "Đánh giá" },
            { value: "24/7", label: "Hỗ trợ" },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="font-display text-2xl font-bold text-foreground sm:text-3xl">
                {stat.value}
              </div>
              <div className="text-xs text-muted-foreground sm:text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ────────── Video Showcase ────────── */}
      <section className="py-16">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8 text-center"
          >
            <h2 className="mb-2 font-display text-2xl font-bold sm:text-3xl">
              Xem Xe Thực Tế
            </h2>
            <p className="text-sm text-muted-foreground">
              Video thực tế đội xe sang của chúng tôi
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative mx-auto max-w-4xl overflow-hidden rounded-2xl card-shadow"
          >
            <video
              src={VIDEO_URL}
              autoPlay
              loop
              muted
              playsInline
              className="h-auto w-full object-cover"
              poster={GALLERY[0]}
            />
          </motion.div>
        </div>
      </section>

      {/* ────────── How It Works ────────── */}
      <section className="bg-card/30 py-16">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10 text-center"
          >
            <h2 className="mb-2 font-display text-2xl font-bold sm:text-3xl">
              Quy Trình Đặt Xe
            </h2>
            <p className="text-sm text-muted-foreground">
              Chỉ 4 bước đơn giản
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative rounded-xl bg-card p-5 text-center card-shadow"
              >
                <div className="absolute -top-3 left-1/2 flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {i + 1}
                </div>
                <div className="mb-3 mt-2 flex justify-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <step.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <h3 className="mb-1 text-sm font-bold text-foreground">{step.title}</h3>
                <p className="text-xs text-muted-foreground">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ────────── Features ────────── */}
      <section className="py-16">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10 text-center"
          >
            <h2 className="mb-2 font-display text-2xl font-bold sm:text-3xl">
              Tại Sao Chọn DriveFlux
            </h2>
            <p className="text-sm text-muted-foreground">
              Dịch vụ cao cấp ở mọi khâu
            </p>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Shield, title: "Bảo hiểm toàn diện", desc: "Bảo hiểm đầy đủ cho mọi chuyến đi, an tâm tuyệt đối." },
              { icon: Clock, title: "Hỗ trợ 24/7", desc: "Đội ngũ hỗ trợ luôn sẵn sàng mọi lúc bạn cần." },
              { icon: Star, title: "Đội xe cao cấp", desc: "Chỉ những chiếc xe hạng sang, bảo dưỡng hoàn hảo." },
              { icon: MapPin, title: "Giao xe tận nơi", desc: "Giao và nhận xe tại bất kỳ địa điểm nào trong TP.HCM." },
              { icon: Users, title: "Tài xế chuyên nghiệp", desc: "Đồng phục lịch sự, am hiểu đường phố, đúng giờ." },
              { icon: CheckCircle2, title: "Giá minh bạch", desc: "Không phát sinh, không phí ẩn. Cam kết giá tốt nhất." },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="rounded-xl bg-card p-6 card-shadow"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mb-1 font-display font-bold text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ────────── Featured Vehicles – 6 items ────────── */}
      <section className="bg-card/30 py-16">
        <div className="container">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold sm:text-3xl">
                Xe Nổi Bật
              </h2>
              <p className="text-sm text-muted-foreground">
                Được tuyển chọn cho trải nghiệm tuyệt vời
              </p>
            </div>
            <Link
              to="/vehicles"
              className="hidden items-center gap-1 text-sm font-medium text-primary sm:flex"
            >
              Xem tất cả <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {loadingVehicles
              ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
              : vehicles.slice(0, 6).map((vehicle, i) => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} index={i} />
                ))}
          </div>

          <Link
            to="/vehicles"
            className="mt-6 flex items-center justify-center gap-1 text-sm font-medium text-primary sm:hidden"
          >
            Xem tất cả xe <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ────────── Gallery ────────── */}
      <section className="py-16">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8 text-center"
          >
            <h2 className="mb-2 font-display text-2xl font-bold sm:text-3xl">
              Hình Ảnh Thực Tế
            </h2>
            <p className="text-sm text-muted-foreground">
              Cận cảnh đội xe sang của DriveFlux
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
            {GALLERY.map((src, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className={`overflow-hidden rounded-xl ${
                  i === 0 ? "col-span-2 row-span-2" : ""
                }`}
              >
                <img
                  src={src}
                  alt={`DriveFlux gallery ${i + 1}`}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  loading="lazy"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ────────── Pricing Table ────────── */}
      <section className="bg-card/30 py-16">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8 text-center"
          >
            <h2 className="mb-2 font-display text-2xl font-bold sm:text-3xl">
              Bảng Giá Tham Khảo
            </h2>
            <p className="mx-auto max-w-md text-sm text-muted-foreground">
              Giá thuê xe theo từng loại dịch vụ. Liên hệ hotline để nhận ưu đãi.
            </p>
          </motion.div>

          {/* Service types grid */}
          {serviceTypes.length > 0 && (
            <div className="mx-auto mb-8 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
              {serviceTypes.filter(s => s.isActive).map((st, i) => (
                <motion.div
                  key={st.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="flex flex-col items-center gap-1.5 rounded-xl bg-card p-4 card-shadow text-center"
                >
                  <span className="text-2xl">{SERVICE_ICONS[st.slug] || '🚘'}</span>
                  <span className="text-xs font-semibold">{st.name}</span>
                </motion.div>
              ))}
            </div>
          )}

          {/* Pricing tabs */}
          <div className="mx-auto max-w-3xl">
            <div className="mb-4 flex gap-1 rounded-xl bg-secondary p-1">
              <button onClick={() => setPricingTab('packages')}
                className={`flex-1 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${pricingTab === 'packages' ? 'bg-card text-foreground card-shadow' : 'text-muted-foreground'}`}>
                Gói Thuê Xe
              </button>
              <button onClick={() => setPricingTab('routes')}
                className={`flex-1 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${pricingTab === 'routes' ? 'bg-card text-foreground card-shadow' : 'text-muted-foreground'}`}>
                Thuê Xe Đi Tỉnh
              </button>
            </div>

            {pricingTab === 'packages' && pricingPackages.length > 0 && (
              <div className="overflow-hidden rounded-xl bg-card card-shadow">
                <div className="grid grid-cols-5 bg-primary/5 px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground sm:px-6">
                  <span className="col-span-2">Gói</span>
                  <span className="text-right">4 chỗ</span>
                  <span className="text-right">7 chỗ</span>
                  <span className="text-right">16 chỗ</span>
                </div>
                {pricingPackages.filter(p => p.isActive).map((pkg, i) => (
                  <motion.div
                    key={pkg.id}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="grid grid-cols-5 items-center border-t border-border/30 px-4 py-3 sm:px-6"
                  >
                    <div className="col-span-2">
                      <span className="text-sm font-medium">{pkg.name}</span>
                      <div className="text-[11px] text-muted-foreground">{pkg.durationHours}h / {pkg.maxKm}km</div>
                    </div>
                    <span className="text-right text-sm font-bold">{formatVND(pkg.price4Seat)}</span>
                    <span className="text-right text-sm font-bold">{formatVND(pkg.price7Seat)}</span>
                    <span className="text-right text-sm font-bold">{formatVND(pkg.price16Seat)}</span>
                  </motion.div>
                ))}
              </div>
            )}

            {pricingTab === 'routes' && routes.length > 0 && (
              <div className="overflow-hidden rounded-xl bg-card card-shadow">
                <div className="grid grid-cols-5 bg-primary/5 px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground sm:px-6">
                  <span className="col-span-2">Tuyến đường</span>
                  <span className="text-right">4 chỗ</span>
                  <span className="text-right">7 chỗ</span>
                  <span className="text-right">16 chỗ</span>
                </div>
                {routes.filter(r => r.isActive).map((r, i) => (
                  <motion.div
                    key={r.id}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.03 }}
                    className="grid grid-cols-5 items-center border-t border-border/30 px-4 py-3 sm:px-6"
                  >
                    <div className="col-span-2">
                      <span className="text-sm font-medium">{r.from} → {r.to}</span>
                      <div className="text-[11px] text-muted-foreground">{r.distance}km · {r.duration}</div>
                    </div>
                    <span className="text-right text-sm font-bold">{formatVND(r.price4Seat)}</span>
                    <span className="text-right text-sm font-bold">{formatVND(r.price7Seat)}</span>
                    <span className="text-right text-sm font-bold">{formatVND(r.price16Seat)}</span>
                  </motion.div>
                ))}
              </div>
            )}

            <p className="mt-3 text-center text-xs text-muted-foreground">
              * Giá trên chưa bao gồm phụ phí cầu đường, đậu bãi. Liên hệ hotline <strong>0922 225 599</strong> để nhận báo giá chính xác.
            </p>
          </div>
        </div>
      </section>

      {/* ────────── Testimonials ────────── */}
      <section className="py-16">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10 text-center"
          >
            <h2 className="mb-2 font-display text-2xl font-bold sm:text-3xl">
              Khách Hàng Nói Gì
            </h2>
            <p className="text-sm text-muted-foreground">
              Trải nghiệm thực từ khách hàng thực
            </p>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-3">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-xl bg-card p-6 card-shadow"
              >
                <div className="mb-4 flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-warning text-warning" />
                  ))}
                </div>
                <p className="mb-4 text-sm text-muted-foreground">"{t.content}"</p>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ────────── FAQ ────────── */}
      <section className="bg-card/30 py-16">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8 text-center"
          >
            <h2 className="mb-2 font-display text-2xl font-bold sm:text-3xl">
              Câu Hỏi Thường Gặp
            </h2>
            <p className="text-sm text-muted-foreground">
              Giải đáp thắc mắc phổ biến
            </p>
          </motion.div>

          <div className="mx-auto max-w-2xl rounded-xl bg-card p-4 card-shadow sm:p-6">
            {FAQ.map((item) => (
              <FaqItem key={item.q} q={item.q} a={item.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ────────── CTA ────────── */}
      <section className="py-16">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-2xl bg-card p-8 text-center card-shadow sm:p-12"
          >
            <div className="absolute inset-0 opacity-20" style={{ background: "var(--gradient-primary)" }} />
            <div className="relative z-10">
              <h2 className="mb-3 font-display text-2xl font-bold sm:text-4xl">
                Sẵn Sàng Lên Đường?
              </h2>
              <p className="mx-auto mb-6 max-w-md text-sm text-muted-foreground">
                Khám phá đội xe và đặt xe mơ ước chỉ trong vài phút.
              </p>
              <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <Link
                  to="/vehicles"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90"
                >
                  Khám Phá Ngay <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="tel:0922225599"
                  className="inline-flex items-center gap-2 rounded-xl border border-border px-8 py-4 text-sm font-semibold text-foreground transition-all hover:bg-secondary"
                >
                  <Phone className="h-4 w-4" /> Gọi ngay
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ────────── Footer ────────── */}
      <footer className="border-t border-border/50 py-10">
        <div className="container">
          <div className="grid gap-8 sm:grid-cols-3">
            <div>
              <h3 className="mb-3 font-display text-lg font-bold text-foreground">DriveFlux</h3>
              <p className="text-sm text-muted-foreground">
                Dịch vụ cho thuê xe sang hàng đầu Việt Nam. Uy tín, chuyên nghiệp, giá tốt nhất thị trường.
              </p>
            </div>
            <div>
              <h4 className="mb-3 text-sm font-semibold text-foreground">Liên hệ</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5" /> 0922 225 599
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5" /> TP. Hồ Chí Minh, Việt Nam
                </div>
              </div>
            </div>
            <div>
              <h4 className="mb-3 text-sm font-semibold text-foreground">Liên kết</h4>
              <div className="space-y-2 text-sm">
                <Link to="/vehicles" className="block text-muted-foreground hover:text-primary">Đội xe</Link>
                <Link to="/blog" className="block text-muted-foreground hover:text-primary">Blog</Link>
                <Link to="/my-bookings" className="block text-muted-foreground hover:text-primary">Đơn của tôi</Link>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-border/50 pt-6 text-center">
            <p className="text-xs text-muted-foreground">
              © 2026 DriveFlux. Mọi quyền được bảo lưu.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
