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
  Mail,
  MessageCircle,
  Fuel,
  BadgeCheck,
  Globe,
  HeartHandshake,
  Sparkles,
  Navigation,
  Timer,
  CalendarDays,
  CalendarRange,
  Plane,
  KeyRound,
  Heart,
  type LucideIcon,
} from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import { useVehicles } from "@/hooks/useVehicles";
import { useTestimonials, useBlogPosts } from "@/hooks/useBlog";
import { useServiceTypes, usePricingPackages, useRoutes } from "@/hooks/useServices";
import VehicleCard from "@/components/VehicleCard";
import SkeletonCard from "@/components/SkeletonCard";
import { formatVND } from "@/lib/utils";
import { useState, useMemo } from "react";

/* ── Cloudinary URLs ── */
const VIDEO_URL =
  "https://res.cloudinary.com/dpr6zwanv/video/upload/v1773070670/carCRM/landing/banner.mp4";
const GALLERY = [
  "https://res.cloudinary.com/dpr6zwanv/image/upload/v1773231543/carCRM/landing/seat291.jpg",
  "https://res.cloudinary.com/dpr6zwanv/image/upload/v1772344350/carCRM/landing/landingpage__2_.jpg",
  "https://res.cloudinary.com/dpr6zwanv/image/upload/v1773236164/carCRM/landing/seat292.jpg",
  "https://res.cloudinary.com/dpr6zwanv/image/upload/v1772344354/carCRM/landing/landingpage__4_.jpg",
  "https://res.cloudinary.com/dpr6zwanv/image/upload/v1772344357/carCRM/landing/landingpage__5_.jpg",
  "https://res.cloudinary.com/dpr6zwanv/image/upload/v1772344360/carCRM/landing/landingpage__6_.jpg",
  "https://res.cloudinary.com/dpr6zwanv/image/upload/v1772344362/carCRM/landing/landingpage__7_.jpg",
];

/* ── Service icons (Lucide) ── */
const SERVICE_ICONS: Record<string, LucideIcon> = {
  hourly_4h: Timer, hourly_8h: Clock, daily: CalendarDays, multi_day: CalendarRange,
  trip: MapPin, airport: Plane, self_drive: KeyRound, wedding: Heart,
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
  {
    q: "Phương thức thanh toán nào được hỗ trợ?",
    a: "Chúng tôi chấp nhận tiền mặt, chuyển khoản ngân hàng, ví điện tử (MoMo, ZaloPay) và thẻ tín dụng (Visa/Mastercard).",
  },
  {
    q: "Có dịch vụ giao xe tận nơi không?",
    a: "Có! Giao xe tận nơi miễn phí trong nội thành TP.HCM. Ngoại thành phụ thu từ 100.000₫ tùy khoảng cách.",
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
  const { data: blogPosts = [] } = useBlogPosts();
  const { data: serviceTypes = [] } = useServiceTypes();
  const { data: pricingPackages = [] } = usePricingPackages();
  const { data: routes = [] } = useRoutes();
  const [pricingTab, setPricingTab] = useState<'packages' | 'routes'>('packages');
  const [routeProvince, setRouteProvince] = useState<string>('all');

  // Group routes by province for filter
  const provinces = useMemo(() => {
    const set = new Set(routes.filter(r => r.isActive).map(r => r.province));
    return Array.from(set).sort();
  }, [routes]);

  const filteredRoutes = useMemo(() => {
    const active = routes.filter(r => r.isActive);
    if (routeProvince === 'all') return active;
    return active.filter(r => r.province === routeProvince);
  }, [routes, routeProvince]);

  // Popular routes (top 6 by price — most popular destinations)
  const popularRoutes = useMemo(() => {
    return routes
      .filter(r => r.isActive && r.province !== 'TP.HCM')
      .sort((a, b) => a.price4Seat - b.price4Seat)
      .slice(0, 6);
  }, [routes]);

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
              Dịch vụ cho thuê xe sang #1 TP.HCM
            </motion.span>

            <h1 className="mb-6 font-display text-4xl font-black leading-tight tracking-tight text-foreground sm:text-5xl md:text-7xl">
              Trải nghiệm{" "}
              <span className="gradient-text">Đẳng Cấp</span>
              <br className="hidden sm:block" />
              <span className="text-3xl sm:text-4xl md:text-5xl"> Trên Mọi Hành Trình</span>
            </h1>

            <p className="mx-auto mb-8 max-w-xl text-base text-muted-foreground sm:text-lg">
              Cho thuê xe sang cho mọi dịp — du lịch, sự kiện, đám cưới, công tác.
              Đặt xe nhanh chóng, tài xế chuyên nghiệp, giá minh bạch.
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

            {/* Quick info badges */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              {[
                { icon: Shield, text: "Bảo hiểm toàn diện" },
                { icon: Fuel, text: "Xăng + Tài xế kèm" },
                { icon: Navigation, text: "Giao xe tận nơi" },
              ].map((badge) => (
                <span key={badge.text} className="flex items-center gap-1.5 rounded-full bg-background/60 px-3 py-1.5 text-xs font-medium text-foreground backdrop-blur-sm">
                  <badge.icon className="h-3.5 w-3.5 text-primary" />
                  {badge.text}
                </span>
              ))}
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

      {/* ────────── Service Types (Full descriptions) ────────── */}
      {serviceTypes.length > 0 && (
        <section className="py-16">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-10 text-center"
            >
              <h2 className="mb-2 font-display text-2xl font-bold sm:text-3xl">
                Dịch Vụ Cho Thuê Xe
              </h2>
              <p className="mx-auto max-w-lg text-sm text-muted-foreground">
                Đa dạng hình thức thuê xe phù hợp với mọi nhu cầu — từ di chuyển nội thành đến du lịch dài ngày
              </p>
            </motion.div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {serviceTypes.filter(s => s.isActive).map((st, i) => {
                const Icon = SERVICE_ICONS[st.slug] || Car;
                return (
                <motion.div
                  key={st.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="group rounded-xl bg-card p-5 card-shadow transition-all hover:shadow-lg"
                >
                  <div className="mb-3 flex items-center gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </span>
                    <h3 className="text-sm font-bold text-foreground leading-tight">{st.name}</h3>
                  </div>
                  <p className="mb-3 text-xs leading-relaxed text-muted-foreground line-clamp-3">
                    {st.description}
                  </p>
                  <Link
                    to={`/vehicles?service=${st.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-primary transition-colors hover:underline"
                  >
                    Xem giá <ChevronRight className="h-3 w-3" />
                  </Link>
                </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ────────── Video Showcase ────────── */}
      <section className="bg-card/30 py-16">
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
      <section className="py-16">
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
      <section className="bg-card/30 py-16">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10 text-center"
          >
            <h2 className="mb-2 font-display text-2xl font-bold sm:text-3xl">
              Tại Sao Chọn Thành Thịnh
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
      <section className="py-16">
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

      {/* ────────── Popular Routes ────────── */}
      {popularRoutes.length > 0 && (
        <section className="bg-card/30 py-16">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-8 text-center"
            >
              <h2 className="mb-2 font-display text-2xl font-bold sm:text-3xl">
                Tuyến Đường Phổ Biến
              </h2>
              <p className="mx-auto max-w-md text-sm text-muted-foreground">
                Các tuyến đường thuê xe đi tỉnh được đặt nhiều nhất từ TP.HCM
              </p>
            </motion.div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {popularRoutes.map((route, i) => (
                <motion.div
                  key={route.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-xl bg-card p-5 card-shadow"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                        <Navigation className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-foreground">{route.to}</h3>
                        <p className="text-[11px] text-muted-foreground">{route.distance}km · {route.duration}</p>
                      </div>
                    </div>
                    <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary">
                      {route.province}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 rounded-lg bg-secondary/50 p-3">
                    <div className="text-center">
                      <div className="text-[10px] text-muted-foreground">4 chỗ</div>
                      <div className="text-xs font-bold text-foreground">{formatVND(route.price4Seat)}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-[10px] text-muted-foreground">7 chỗ</div>
                      <div className="text-xs font-bold text-foreground">{formatVND(route.price7Seat)}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-[10px] text-muted-foreground">18 chỗ</div>
                      <div className="text-xs font-bold text-foreground">{formatVND(route.price18Seat)}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-[10px] text-muted-foreground">29 chỗ</div>
                      <div className="text-xs font-bold text-foreground">{formatVND(route.price29Seat)}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setPricingTab('routes');
                  document.getElementById('pricing-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                Xem đầy đủ bảng giá <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>
      )}

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
              Cận cảnh đội xe sang của Thành Thịnh
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
                  alt={`Thành Thịnh gallery ${i + 1}`}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  loading="lazy"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ────────── Pricing Table ────────── */}
      <section id="pricing-section" className="bg-card/30 py-16">
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

          <div className="mx-auto max-w-4xl">
            {/* Pricing tabs */}
            <div className="mb-4 flex gap-1 rounded-xl bg-secondary p-1">
              <button onClick={() => setPricingTab('packages')}
                className={`flex-1 rounded-lg px-3 py-2.5 text-xs font-medium transition-colors sm:text-sm ${pricingTab === 'packages' ? 'bg-card text-foreground card-shadow' : 'text-muted-foreground'}`}>
                📋 Gói Thuê Xe
              </button>
              <button onClick={() => setPricingTab('routes')}
                className={`flex-1 rounded-lg px-3 py-2.5 text-xs font-medium transition-colors sm:text-sm ${pricingTab === 'routes' ? 'bg-card text-foreground card-shadow' : 'text-muted-foreground'}`}>
                🗺️ Thuê Xe Đi Tỉnh
              </button>
            </div>

            {/* Packages table */}
            {pricingTab === 'packages' && pricingPackages.length > 0 && (
              <div className="overflow-hidden rounded-xl bg-card card-shadow">
                {/* Desktop table header */}
                <div className="hidden grid-cols-6 bg-primary/5 px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground sm:grid">
                  <span className="col-span-2">Gói</span>
                  <span className="text-right">4 chỗ</span>
                  <span className="text-right">7 chỗ</span>
                  <span className="text-right">18 chỗ</span>
                  <span className="text-right">29 chỗ</span>
                </div>
                {pricingPackages.filter(p => p.isActive).map((pkg, i) => (
                  <motion.div
                    key={pkg.id}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="border-t border-border/30"
                  >
                    {/* Desktop row */}
                    <div className="hidden grid-cols-6 items-center px-6 py-3 sm:grid">
                      <div className="col-span-2">
                        <span className="text-sm font-medium">{pkg.name}</span>
                        <div className="text-[11px] text-muted-foreground">{pkg.durationHours}h / {pkg.maxKm}km</div>
                      </div>
                      <span className="text-right text-sm font-bold">{formatVND(pkg.price4Seat)}</span>
                      <span className="text-right text-sm font-bold">{formatVND(pkg.price7Seat)}</span>
                      <span className="text-right text-sm font-bold">{formatVND(pkg.price18Seat)}</span>
                      <span className="text-right text-sm font-bold">{formatVND(pkg.price29Seat)}</span>
                    </div>
                    {/* Mobile card */}
                    <div className="p-4 sm:hidden">
                      <div className="mb-2 font-medium text-sm">{pkg.name}</div>
                      <div className="mb-2 text-[11px] text-muted-foreground">{pkg.durationHours}h / {pkg.maxKm}km</div>
                      <div className="grid grid-cols-4 gap-2 rounded-lg bg-secondary/50 p-2.5">
                        <div className="text-center">
                          <div className="text-[10px] text-muted-foreground">4 chỗ</div>
                          <div className="text-xs font-bold">{formatVND(pkg.price4Seat)}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-[10px] text-muted-foreground">7 chỗ</div>
                          <div className="text-xs font-bold">{formatVND(pkg.price7Seat)}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-[10px] text-muted-foreground">18 chỗ</div>
                          <div className="text-xs font-bold">{formatVND(pkg.price18Seat)}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-[10px] text-muted-foreground">29 chỗ</div>
                          <div className="text-xs font-bold">{formatVND(pkg.price29Seat)}</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Package includes/excludes */}
                {pricingPackages.filter(p => p.isActive).length > 0 && (
                  <div className="border-t border-border/30 p-4 sm:p-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Bao gồm</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {pricingPackages[0].includes.map(item => (
                            <span key={item} className="flex items-center gap-1 rounded-full bg-success/10 px-2.5 py-1 text-[11px] font-medium text-success">
                              <CheckCircle2 className="h-3 w-3" /> {item}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Chưa bao gồm</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {pricingPackages[0].excludes.map(item => (
                            <span key={item} className="rounded-full bg-destructive/10 px-2.5 py-1 text-[11px] font-medium text-destructive">
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Routes table */}
            {pricingTab === 'routes' && routes.length > 0 && (
              <div>
                {/* Province filter */}
                <div className="mb-4 flex flex-wrap gap-1.5">
                  <button
                    onClick={() => setRouteProvince('all')}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${routeProvince === 'all' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'}`}
                  >
                    Tất cả
                  </button>
                  {provinces.map(p => (
                    <button
                      key={p}
                      onClick={() => setRouteProvince(p)}
                      className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${routeProvince === p ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>

                <div className="overflow-hidden rounded-xl bg-card card-shadow">
                  {/* Desktop header */}
                  <div className="hidden grid-cols-6 bg-primary/5 px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground sm:grid">
                    <span className="col-span-2">Tuyến đường</span>
                    <span className="text-right">4 chỗ</span>
                    <span className="text-right">7 chỗ</span>
                    <span className="text-right">18 chỗ</span>
                    <span className="text-right">29 chỗ</span>
                  </div>
                  {filteredRoutes.map((r, i) => (
                    <motion.div
                      key={r.id}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.03 }}
                      className="border-t border-border/30"
                    >
                      {/* Desktop row */}
                      <div className="hidden grid-cols-6 items-center px-6 py-3 sm:grid">
                        <div className="col-span-2">
                          <span className="text-sm font-medium">{r.from} → {r.to}</span>
                          <div className="text-[11px] text-muted-foreground">{r.distance}km · {r.duration}</div>
                        </div>
                        <span className="text-right text-sm font-bold">{formatVND(r.price4Seat)}</span>
                        <span className="text-right text-sm font-bold">{formatVND(r.price7Seat)}</span>
                        <span className="text-right text-sm font-bold">{formatVND(r.price18Seat)}</span>
                        <span className="text-right text-sm font-bold">{formatVND(r.price29Seat)}</span>
                      </div>
                      {/* Mobile card */}
                      <div className="p-4 sm:hidden">
                        <div className="mb-1 text-sm font-medium">{r.from} → {r.to}</div>
                        <div className="mb-2 text-[11px] text-muted-foreground">{r.distance}km · {r.duration}</div>
                        <div className="grid grid-cols-4 gap-2 rounded-lg bg-secondary/50 p-2.5">
                          <div className="text-center">
                            <div className="text-[10px] text-muted-foreground">4 chỗ</div>
                            <div className="text-xs font-bold">{formatVND(r.price4Seat)}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-[10px] text-muted-foreground">7 chỗ</div>
                            <div className="text-xs font-bold">{formatVND(r.price7Seat)}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-[10px] text-muted-foreground">18 chỗ</div>
                            <div className="text-xs font-bold">{formatVND(r.price18Seat)}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-[10px] text-muted-foreground">29 chỗ</div>
                            <div className="text-xs font-bold">{formatVND(r.price29Seat)}</div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            <p className="mt-3 text-center text-xs text-muted-foreground">
              * Giá trên chưa bao gồm phụ phí cầu đường, đậu bãi. Liên hệ hotline <strong>0922 225 599</strong> để nhận báo giá chính xác.
            </p>
          </div>
        </div>
      </section>

      {/* ────────── About Us ────────── */}
      <section className="py-16">
        <div className="container">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="mb-2 inline-block text-xs font-semibold uppercase tracking-wider text-primary">Về chúng tôi</span>
              <h2 className="mb-4 font-display text-2xl font-bold sm:text-3xl">
                Thành Thịnh — Đối Tác Tin Cậy Cho Mọi Hành Trình
              </h2>
              <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                Với đội xe sang hơn 50 chiếc từ Mercedes, BMW, Rolls-Royce đến Bentley, Porsche — Thành Thịnh tự hào là đơn vị cho thuê xe sang hàng đầu tại TP.HCM.
                Chúng tôi phục vụ mọi nhu cầu: du lịch, đám cưới, sự kiện doanh nghiệp, đưa đón sân bay và công tác dài ngày.
              </p>
              <div className="mb-6 grid grid-cols-2 gap-3">
                {[
                  { icon: BadgeCheck, text: "Uy tín từ 2018" },
                  { icon: Sparkles, text: "Xe đời mới, bảo dưỡng định kỳ" },
                  { icon: HeartHandshake, text: "Hơn 2,000 khách tin dùng" },
                  { icon: Globe, text: "Phục vụ toàn quốc" },
                ].map(item => (
                  <div key={item.text} className="flex items-start gap-2">
                    <item.icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span className="text-xs font-medium text-foreground">{item.text}</span>
                  </div>
                ))}
              </div>
              <Link
                to="/vehicles"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
              >
                Xem đội xe <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-2"
            >
              {GALLERY.slice(1, 5).map((src, i) => (
                <div key={i} className={`overflow-hidden rounded-xl ${i === 0 ? 'row-span-2' : ''}`}>
                  <img src={src} alt={`About ${i}`} className="h-full w-full object-cover" loading="lazy" />
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ────────── Testimonials ────────── */}
      <section className="bg-card/30 py-16">
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

      {/* ────────── Blog Preview ────────── */}
      {blogPosts.length > 0 && (
        <section className="py-16">
          <div className="container">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="font-display text-2xl font-bold sm:text-3xl">
                  Tin Tức & Kinh Nghiệm
                </h2>
                <p className="text-sm text-muted-foreground">
                  Chia sẻ kinh nghiệm thuê xe và tin tức mới nhất
                </p>
              </div>
              <Link
                to="/blog"
                className="hidden items-center gap-1 text-sm font-medium text-primary sm:flex"
              >
                Xem tất cả <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {blogPosts.slice(0, 3).map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link to={`/blog/${post.id}`} className="group block overflow-hidden rounded-xl bg-card card-shadow">
                    <div className="aspect-[16/9] overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-4">
                      <div className="mb-2 flex items-center gap-2">
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                          {post.category}
                        </span>
                        <span className="text-[10px] text-muted-foreground">{post.readTime}</span>
                      </div>
                      <h3 className="mb-1.5 text-sm font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2">{post.excerpt}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            <Link
              to="/blog"
              className="mt-6 flex items-center justify-center gap-1 text-sm font-medium text-primary sm:hidden"
            >
              Xem tất cả bài viết <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      )}

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

      {/* ────────── Contact / CTA ────────── */}
      <section className="py-16">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-2xl bg-card p-8 card-shadow sm:p-12"
          >
            <div className="absolute inset-0 opacity-20" style={{ background: "var(--gradient-primary)" }} />
            <div className="relative z-10">
              <h2 className="mb-3 font-display text-2xl font-bold text-center sm:text-4xl">
                Sẵn Sàng Lên Đường?
              </h2>
              <p className="mx-auto mb-8 max-w-md text-center text-sm text-muted-foreground">
                Liên hệ ngay để được tư vấn và nhận báo giá tốt nhất.
              </p>

              {/* Contact methods grid */}
              <div className="mx-auto mb-8 grid max-w-2xl gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { icon: Phone, label: "Hotline", value: "0922 225 599", href: "tel:0922225599" },
                  { icon: MessageCircle, label: "Zalo", value: "0922 225 599", href: "https://zalo.me/0922225599" },
                  { icon: Mail, label: "Email", value: "tuduocthanh.gc@gmail.com", href: "mailto:tuduocthanh.gc@gmail.com" },
                  { icon: MapPin, label: "Văn phòng", value: "67/16/3 Nguyễn Văn Yến, P.Tân Thới Hoà, Q.Tân Phú", href: "https://maps.app.goo.gl/5QEJbUC8w8DjHfvC7" },
                ].map((contact) => (
                  <a
                    key={contact.label}
                    href={contact.href}
                    className="flex items-center gap-3 rounded-xl bg-secondary/50 p-3 transition-colors hover:bg-secondary"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <contact.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{contact.label}</div>
                      <div className="truncate text-xs font-semibold text-foreground">{contact.value}</div>
                    </div>
                  </a>
                ))}
              </div>

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

      {/* ────────── Google Maps ────────── */}
      <section className="py-12 bg-card/30">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-6 text-center"
          >
            <h2 className="mb-2 font-display text-2xl font-bold sm:text-3xl">Vị Trí Văn Phòng</h2>
            <p className="text-sm text-muted-foreground">67/16/3 Nguyễn Văn Yến, P.Tân Thới Hoà, Q.Tân Phú, TP.HCM</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mx-auto max-w-4xl overflow-hidden rounded-2xl card-shadow"
          >
            <iframe
              title="Thành Thịnh - Google Maps"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d979.6!2d106.6325!3d10.7950!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317527dc252891f1%3A0x6c816e684fd3fd63!2sDu%20l%E1%BB%8Bch%20Thanhthinh!5e0!3m2!1svi!2svn!4v1773070000000"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full"
            />
          </motion.div>
        </div>
      </section>

      {/* ────────── Footer ────────── */}
      <footer className="border-t border-border/50 py-10">
        <div className="container">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <h3 className="mb-3 font-display text-lg font-bold text-foreground">Thành Thịnh</h3>
              <p className="mb-3 text-sm text-muted-foreground">
                Dịch vụ cho thuê xe sang hàng đầu Việt Nam. Uy tín, chuyên nghiệp, giá tốt nhất thị trường.
              </p>
              <div className="flex gap-2">
                <a href="https://www.facebook.com/tour.thanhthinh.9" target="_blank" rel="noopener noreferrer" className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-sm hover:bg-primary/10 transition-colors">📘</a>
                <a href="mailto:tuduocthanh.gc@gmail.com" className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-sm hover:bg-primary/10 transition-colors">✉️</a>
                <a href="tel:0922225599" className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-sm hover:bg-primary/10 transition-colors">📞</a>
              </div>
            </div>
            <div>
              <h4 className="mb-3 text-sm font-semibold text-foreground">Dịch vụ</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>Thuê xe có tài xế</div>
                <div>Thuê xe tự lái</div>
                <div>Thuê xe đi tỉnh</div>
                <div>Đưa đón sân bay</div>
                <div>Xe hoa đám cưới</div>
                <div>Thuê xe dài hạn</div>
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
            <div>
              <h4 className="mb-3 text-sm font-semibold text-foreground">Liên hệ</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 shrink-0" /> 0922 225 599
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 shrink-0" /> tuduocthanh.gc@gmail.com
                </div>
                <a href="https://maps.app.goo.gl/5QEJbUC8w8DjHfvC7" target="_blank" rel="noopener noreferrer" className="flex items-start gap-2 hover:text-primary transition-colors">
                  <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" /> 67/16/3 Nguyễn Văn Yến, P.Tân Thới Hoà, Q.Tân Phú, TP.HCM
                </a>
                <div className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 shrink-0" /> 8:00 — 20:00 (Hàng ngày)
                </div>
              </div>
            </div>
          </div>

          {/* Payment methods */}
          <div className="mt-8 border-t border-border/50 pt-6">
            <div className="mb-4 flex flex-wrap items-center justify-center gap-3">
              <span className="text-xs text-muted-foreground">Phương thức thanh toán:</span>
              {['💵 Tiền mặt', '🏦 Chuyển khoản', '📱 MoMo', '📱 ZaloPay', '💳 Visa/MC'].map(method => (
                <span key={method} className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                  {method}
                </span>
              ))}
            </div>
            <p className="text-center text-xs text-muted-foreground">
              © 2026 Thành Thịnh. Mọi quyền được bảo lưu.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
