import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Star, Users, Fuel, Settings, ChevronRight, Loader2, Tag } from "lucide-react";
import { useState, useMemo } from "react";
import { useVehicle } from "@/hooks/useVehicles";
import { useServiceTypes } from "@/hooks/useServices";
import { formatVND } from "@/lib/utils";

const SERVICE_ICONS: Record<string, string> = {
  hourly_4h: '⏰', hourly_8h: '🕐', daily: '📅', multi_day: '🗓️',
  trip: '📍', airport: '✈️', self_drive: '🔑', wedding: '💒',
};

const VehicleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: vehicle, isLoading } = useVehicle(id);
  const { data: serviceTypes = [] } = useServiceTypes();
  const [activeImage, setActiveImage] = useState(0);

  const activePackages = useMemo(() => {
    if (!vehicle?.packages) return [];
    return vehicle.packages.filter((p) => p.isActive);
  }, [vehicle]);

  const minPrice = useMemo(() => {
    if (!activePackages.length) return vehicle?.pricePerDay || 0;
    return Math.min(...activePackages.map((p) => p.price));
  }, [activePackages, vehicle]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-16">
        <p className="text-muted-foreground">Không tìm thấy xe</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 pt-16 md:pb-8">
      {/* Image Gallery */}
      <div className="relative">
        <motion.img
          key={activeImage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          src={vehicle.images[activeImage]}
          alt={vehicle.name}
          className="h-64 w-full object-cover sm:h-96"
        />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background/80 to-transparent" />

        <button
          onClick={() => navigate(-1)}
          className="absolute left-4 top-4 rounded-full bg-background/60 p-2 backdrop-blur-sm"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        {vehicle.images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
            {vehicle.images.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`h-2 rounded-full transition-all ${
                  i === activeImage ? "w-6 bg-primary" : "w-2 bg-foreground/40"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="container -mt-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl bg-card p-5 card-shadow"
        >
          <div className="mb-1 flex items-center gap-2">
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
              {vehicle.type.toUpperCase()}
            </span>
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-warning text-warning" />
              <span className="text-xs text-muted-foreground">{vehicle.rating}</span>
            </div>
          </div>

          <h1 className="mb-2 font-display text-2xl font-bold">{vehicle.name}</h1>
          <p className="mb-4 text-sm text-muted-foreground">{vehicle.description}</p>

          {/* Specs */}
          <div className="mb-4 grid grid-cols-3 gap-3">
            {[
              { icon: Users, label: "Chỗ ngồi", value: vehicle.seats },
              { icon: Settings, label: "Hộp số", value: vehicle.transmission },
              { icon: Fuel, label: "Nhiên liệu", value: vehicle.fuel },
            ].map((spec) => (
              <div key={spec.label} className="rounded-lg bg-secondary p-3 text-center">
                <spec.icon className="mx-auto mb-1 h-4 w-4 text-muted-foreground" />
                <div className="text-xs text-muted-foreground">{spec.label}</div>
                <div className="text-sm font-semibold">{spec.value}</div>
              </div>
            ))}
          </div>

          {/* Features */}
          <div className="mb-4">
            <h3 className="mb-2 text-sm font-semibold">Tính năng</h3>
            <div className="flex flex-wrap gap-2">
              {vehicle.features.map((f) => (
                <span key={f} className="rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground">
                  {f}
                </span>
              ))}
            </div>
          </div>

          {/* ── Per-vehicle packages ── */}
          {activePackages.length > 0 && (
            <div className="mb-4">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                <Tag className="h-4 w-4 text-primary" /> Bảng Giá Dịch Vụ
              </h3>
              <div className="space-y-2">
                {activePackages.map((pkg) => {
                  const st = serviceTypes.find((s) => s.slug === pkg.serviceTypeSlug);
                  return (
                    <div
                      key={pkg.id}
                      className="flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:border-primary/30"
                    >
                      <span className="text-lg">{SERVICE_ICONS[pkg.serviceTypeSlug] || '🚘'}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold">{pkg.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {st?.name || pkg.serviceTypeSlug}
                          {pkg.durationHours ? ` · ${pkg.durationHours}h` : ''}
                          {pkg.maxKm ? ` · ${pkg.maxKm}km` : ''}
                        </div>
                        {pkg.description && (
                          <div className="text-[11px] text-muted-foreground mt-0.5">{pkg.description}</div>
                        )}
                      </div>
                      <span className="text-sm font-bold text-primary whitespace-nowrap">
                        {formatVND(pkg.price)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Pricing + Book Now */}
          <div className="rounded-lg bg-secondary p-4">
            <div className="mb-3 flex items-baseline justify-between">
              <div>
                <div className="text-xs text-muted-foreground">Giá từ</div>
                <span className="font-display text-2xl font-bold">{formatVND(minPrice)}</span>
              </div>
              {activePackages.length > 0 && (
                <div className="text-right text-xs text-muted-foreground">
                  {activePackages.length} gói dịch vụ
                </div>
              )}
            </div>
            <Link
              to={`/booking/${vehicle.id}`}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90"
            >
              Đặt Xe Ngay <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default VehicleDetail;
