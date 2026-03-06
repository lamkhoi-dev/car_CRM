import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, CalendarDays, Check, Loader2, MapPin, Clock, Car, ChevronRight, ArrowRight } from "lucide-react";
import { useState, useMemo } from "react";
import { useVehicle } from "@/hooks/useVehicles";
import { useCreateBooking } from "@/hooks/useBookings";
import { useServiceTypes, useRoutes, usePricingPackages } from "@/hooks/useServices";
import { toast } from "sonner";
import { formatVND, getDeviceId } from "@/lib/utils";
import type { ServiceType, Route as RouteType, PricingPackage } from "@/lib/api";

type Step = 'service' | 'details' | 'confirm';

const seatLabels: Record<string, string> = {
  '4_cho': '4 chỗ',
  '5_cho': '5 chỗ',
  '7_cho': '7 chỗ',
  '9_cho': '9 chỗ',
  '16_cho': '16 chỗ',
  '29_cho': '29 chỗ',
  '45_cho': '45 chỗ',
};

const serviceIcons: Record<string, string> = {
  hourly_4h: '⏰',
  hourly_8h: '🕐',
  daily: '📅',
  multi_day: '🗓️',
  trip: '📍',
  airport: '✈️',
  self_drive: '🔑',
  wedding: '💒',
};

const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: vehicle, isLoading } = useVehicle(id);
  const createBooking = useCreateBooking();
  const { data: serviceTypes = [] } = useServiceTypes();

  const [step, setStep] = useState<Step>('service');
  const [selectedServiceSlug, setSelectedServiceSlug] = useState('');
  const [selectedRouteId, setSelectedRouteId] = useState('');
  const [selectedPackageId, setSelectedPackageId] = useState('');
  const [tripType, setTripType] = useState<'one_way' | 'round_trip'>('one_way');

  // Load routes and packages based on selected service
  const isTrip = selectedServiceSlug === 'trip' || selectedServiceSlug === 'airport';
  const isHourly = selectedServiceSlug?.startsWith('hourly_');
  const { data: routes = [] } = useRoutes(undefined);
  const { data: packages = [] } = usePricingPackages(selectedServiceSlug || undefined);

  const selectedService = serviceTypes.find(s => s.slug === selectedServiceSlug);
  const selectedRoute = routes.find(r => r.id === selectedRouteId);
  const selectedPackage = packages.find(p => p.id === selectedPackageId);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    startDate: "",
    endDate: "",
    pickupLocation: "",
    dropoffLocation: "",
    note: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  // Determine seat category price key
  const seatKey = useMemo(() => {
    if (!vehicle) return '4Seat';
    const cat = vehicle.seatCategory || '4_cho';
    if (cat.includes('16') || cat.includes('29') || cat.includes('45')) return '16Seat';
    if (cat.includes('7') || cat.includes('9')) return '7Seat';
    return '4Seat';
  }, [vehicle]);

  // Calculate total price based on service type
  const { totalPrice, priceBreakdown } = useMemo(() => {
    if (!vehicle) return { totalPrice: 0, priceBreakdown: '' };

    // Trip / Airport — route-based pricing
    if (isTrip && selectedRoute) {
      const routePrice = selectedRoute[`price${seatKey}` as keyof RouteType] as number || 0;
      const total = tripType === 'round_trip' ? routePrice * 2 : routePrice;
      const label = tripType === 'round_trip'
        ? `${formatVND(routePrice)} x 2 (khứ hồi)`
        : `${formatVND(routePrice)} (1 chiều)`;
      return { totalPrice: total, priceBreakdown: label };
    }

    // Hourly — package-based pricing
    if (isHourly && selectedPackage) {
      const pkgPrice = selectedPackage[`price${seatKey}` as keyof PricingPackage] as number || 0;
      return { totalPrice: pkgPrice, priceBreakdown: `${selectedPackage.name}: ${formatVND(pkgPrice)}` };
    }

    // Daily / Multi-day — pricePerDay
    if (form.startDate && form.endDate) {
      const start = new Date(form.startDate);
      const end = new Date(form.endDate);
      const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
      const total = days * vehicle.pricePerDay;
      return { totalPrice: total, priceBreakdown: `${formatVND(vehicle.pricePerDay)} x ${days} ngày` };
    }

    return { totalPrice: 0, priceBreakdown: '' };
  }, [vehicle, selectedServiceSlug, selectedRoute, selectedPackage, seatKey, tripType, form.startDate, form.endDate, isTrip, isHourly]);

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

  const handleSelectService = (slug: string) => {
    setSelectedServiceSlug(slug);
    setSelectedRouteId('');
    setSelectedPackageId('');
    setStep('details');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) {
      toast.error("Vui lòng điền họ tên và số điện thoại");
      return;
    }
    if (!selectedServiceSlug) {
      toast.error("Vui lòng chọn loại dịch vụ");
      return;
    }

    try {
      await createBooking.mutateAsync({
        vehicleId: vehicle.id,
        vehicleName: vehicle.name,
        customerName: form.name,
        customerPhone: form.phone,
        customerEmail: form.email || undefined,
        startDate: form.startDate || new Date().toISOString().split('T')[0],
        endDate: form.endDate || form.startDate || new Date().toISOString().split('T')[0],
        totalPrice,
        deviceId: getDeviceId(),
        serviceType: selectedServiceSlug,
        pickupLocation: form.pickupLocation || undefined,
        dropoffLocation: form.dropoffLocation || undefined,
        tripType: isTrip ? tripType : undefined,
        routeId: selectedRouteId || undefined,
        note: form.note || undefined,
      });
      setSubmitted(true);
      toast.success("Đã gửi yêu cầu đặt xe!");
    } catch (err: any) {
      toast.error(err.message || "Đặt xe thất bại. Vui lòng thử lại.");
    }
  };

  if (submitted) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4 pt-16">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/20"
        >
          <Check className="h-8 w-8 text-success" />
        </motion.div>
        <h2 className="mb-2 font-display text-xl font-bold">Đặt Xe Thành Công!</h2>
        <p className="mb-2 text-center text-sm text-muted-foreground">
          Yêu cầu đặt xe {vehicle.name} đã được ghi nhận.
        </p>
        {selectedService && (
          <p className="mb-1 text-center text-xs text-muted-foreground">
            Dịch vụ: {selectedService.name}
            {selectedRoute && ` · ${selectedRoute.from} → ${selectedRoute.to}`}
          </p>
        )}
        <p className="mb-6 text-center text-sm font-semibold text-primary">
          {formatVND(totalPrice)}
        </p>
        <div className="flex gap-3">
          <Link
            to="/my-bookings"
            className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
          >
            Xem đơn của tôi
          </Link>
          <button
            onClick={() => navigate("/vehicles")}
            className="rounded-xl bg-secondary px-6 py-3 text-sm font-semibold text-secondary-foreground"
          >
            Xem Thêm Xe
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 pt-16 md:pb-8">
      <div className="container max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button
            onClick={() => {
              if (step === 'details') { setStep('service'); return; }
              if (step === 'confirm') { setStep('details'); return; }
              navigate(-1);
            }}
            className="mb-4 mt-4 flex items-center gap-1 text-sm text-muted-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> {step === 'service' ? 'Quay lại' : 'Bước trước'}
          </button>

          {/* Vehicle preview */}
          <div className="mb-4 flex items-center gap-3 rounded-xl bg-card p-3 card-shadow">
            <img
              src={vehicle.images[0]}
              alt={vehicle.name}
              className="h-16 w-20 rounded-lg object-cover"
            />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold truncate">{vehicle.name}</div>
              <div className="text-xs text-muted-foreground">
                {seatLabels[vehicle.seatCategory] || vehicle.seats + ' chỗ'} · {formatVND(vehicle.pricePerDay)}/ngày
              </div>
            </div>
          </div>

          {/* Step indicators */}
          <div className="mb-6 flex items-center gap-2">
            {(['service', 'details', 'confirm'] as Step[]).map((s, i) => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                  step === s ? 'bg-primary text-primary-foreground' :
                  (['service', 'details', 'confirm'].indexOf(step) > i) ? 'bg-success text-white' :
                  'bg-secondary text-muted-foreground'
                }`}>
                  {(['service', 'details', 'confirm'].indexOf(step) > i) ? '✓' : i + 1}
                </div>
                {i < 2 && <div className="h-0.5 flex-1 bg-border rounded" />}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* Step 1: Select service type */}
            {step === 'service' && (
              <motion.div
                key="service"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <h2 className="mb-1 font-display text-lg font-bold">Chọn loại dịch vụ</h2>
                <p className="mb-4 text-xs text-muted-foreground">Chọn hình thức thuê xe phù hợp</p>
                <div className="space-y-2">
                  {serviceTypes.filter(s => s.isActive).map((st) => (
                    <button
                      key={st.id}
                      onClick={() => handleSelectService(st.slug)}
                      className={`flex w-full items-center gap-3 rounded-xl border-2 p-4 text-left transition-all hover:border-primary ${
                        selectedServiceSlug === st.slug ? 'border-primary bg-primary/5' : 'border-border bg-card'
                      }`}
                    >
                      <span className="text-2xl">{serviceIcons[st.slug] || '🚘'}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold">{st.name}</div>
                        <div className="text-xs text-muted-foreground truncate">{st.description}</div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 2: Details based on service type */}
            {step === 'details' && (
              <motion.div
                key="details"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <h2 className="mb-1 font-display text-lg font-bold">
                  {selectedService?.name || 'Chi tiết'}
                </h2>
                <p className="mb-4 text-xs text-muted-foreground">Điền thông tin chi tiết cho chuyến đi</p>

                <div className="space-y-4">
                  {/* Route selection for trip/airport */}
                  {isTrip && (
                    <div>
                      <label className="mb-2 block text-sm font-medium">Chọn tuyến đường</label>
                      <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                        {routes.filter(r => r.isActive).map((r) => {
                          const price = r[`price${seatKey}` as keyof RouteType] as number || 0;
                          return (
                            <button
                              key={r.id}
                              type="button"
                              onClick={() => setSelectedRouteId(r.id)}
                              className={`flex w-full items-center gap-2 rounded-lg border p-3 text-left transition-colors ${
                                selectedRouteId === r.id ? 'border-primary bg-primary/5' : 'border-border bg-card'
                              }`}
                            >
                              <MapPin className="h-4 w-4 text-primary shrink-0" />
                              <div className="flex-1 min-w-0">
                                <div className="text-xs font-semibold">{r.from} → {r.to}</div>
                                <div className="text-[11px] text-muted-foreground">{r.distance}km · {r.duration}</div>
                              </div>
                              <span className="text-xs font-bold text-primary shrink-0">{formatVND(price)}</span>
                            </button>
                          );
                        })}
                      </div>
                      {isTrip && (
                        <div className="mt-3 flex gap-2">
                          <button type="button" onClick={() => setTripType('one_way')}
                            className={`flex-1 rounded-lg border py-2.5 text-xs font-medium transition-colors ${
                              tripType === 'one_way' ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground'
                            }`}>
                            1 chiều
                          </button>
                          <button type="button" onClick={() => setTripType('round_trip')}
                            className={`flex-1 rounded-lg border py-2.5 text-xs font-medium transition-colors ${
                              tripType === 'round_trip' ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground'
                            }`}>
                            Khứ hồi
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Package selection for hourly */}
                  {isHourly && packages.length > 0 && (
                    <div>
                      <label className="mb-2 block text-sm font-medium">Chọn gói</label>
                      <div className="space-y-1.5">
                        {packages.filter(p => p.isActive).map((pkg) => {
                          const price = pkg[`price${seatKey}` as keyof PricingPackage] as number || 0;
                          return (
                            <button
                              key={pkg.id}
                              type="button"
                              onClick={() => setSelectedPackageId(pkg.id)}
                              className={`flex w-full items-center gap-2 rounded-lg border p-3 text-left transition-colors ${
                                selectedPackageId === pkg.id ? 'border-primary bg-primary/5' : 'border-border bg-card'
                              }`}
                            >
                              <Clock className="h-4 w-4 text-primary shrink-0" />
                              <div className="flex-1 min-w-0">
                                <div className="text-xs font-semibold">{pkg.name}</div>
                                <div className="text-[11px] text-muted-foreground">{pkg.durationHours}h · {pkg.maxKm}km</div>
                              </div>
                              <span className="text-xs font-bold text-primary shrink-0">{formatVND(price)}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Date range for daily / multi-day */}
                  {!isTrip && !isHourly && (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="mb-1.5 block text-sm font-medium">Ngày bắt đầu</label>
                        <div className="relative">
                          <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
                          <input type="date" value={form.startDate} min={today}
                            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                            className="w-full rounded-xl border border-border bg-card py-3 pl-10 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
                        </div>
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-medium">Ngày kết thúc</label>
                        <div className="relative">
                          <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
                          <input type="date" value={form.endDate} min={form.startDate || today}
                            onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                            className="w-full rounded-xl border border-border bg-card py-3 pl-10 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Start date for hourly/trip */}
                  {(isTrip || isHourly) && (
                    <div>
                      <label className="mb-1.5 block text-sm font-medium">Ngày giờ đi</label>
                      <input type="datetime-local" value={form.startDate}
                        onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                        className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
                    </div>
                  )}

                  {/* Pickup / Dropoff */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium">Điểm đón</label>
                      <input type="text" value={form.pickupLocation}
                        onChange={(e) => setForm({ ...form, pickupLocation: e.target.value })}
                        placeholder="Địa chỉ đón"
                        className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium">Điểm đến</label>
                      <input type="text" value={form.dropoffLocation}
                        onChange={(e) => setForm({ ...form, dropoffLocation: e.target.value })}
                        placeholder="Địa chỉ đến"
                        className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setStep('confirm')}
                    className="w-full rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground flex items-center justify-center gap-2"
                  >
                    Tiếp tục <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Confirm & Submit */}
            {step === 'confirm' && (
              <motion.div
                key="confirm"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <h2 className="mb-1 font-display text-lg font-bold">Xác nhận đặt xe</h2>
                <p className="mb-4 text-xs text-muted-foreground">Kiểm tra lại và điền thông tin liên hệ</p>

                {/* Summary card */}
                <div className="mb-4 rounded-xl bg-secondary p-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Dịch vụ</span>
                    <span className="font-medium">{selectedService?.name}</span>
                  </div>
                  {selectedRoute && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Tuyến</span>
                      <span className="font-medium">{selectedRoute.from} → {selectedRoute.to}</span>
                    </div>
                  )}
                  {isTrip && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Loại</span>
                      <span className="font-medium">{tripType === 'round_trip' ? 'Khứ hồi' : '1 chiều'}</span>
                    </div>
                  )}
                  {selectedPackage && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Gói</span>
                      <span className="font-medium">{selectedPackage.name}</span>
                    </div>
                  )}
                  {form.pickupLocation && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Đón tại</span>
                      <span className="font-medium truncate ml-4">{form.pickupLocation}</span>
                    </div>
                  )}
                  {priceBreakdown && (
                    <div className="flex items-center justify-between text-sm border-t border-border pt-2 mt-2">
                      <span className="text-muted-foreground">{priceBreakdown}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm border-t border-border pt-2 font-bold">
                    <span>Tổng cộng</span>
                    <span className="text-primary text-base">{formatVND(totalPrice)}</span>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">Họ và tên *</label>
                    <input type="text" value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Nhập họ và tên" required
                      className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium">Số điện thoại *</label>
                      <input type="tel" value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="0912 345 678" required
                        className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium">Email</label>
                      <input type="email" value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="email@mail.com"
                        className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">Yêu cầu khác</label>
                    <textarea value={form.note}
                      onChange={(e) => setForm({ ...form, note: e.target.value })}
                      placeholder="Ghi chú thêm cho chuyến đi..." rows={2}
                      className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
                  </div>
                  <button
                    type="submit"
                    disabled={createBooking.isPending}
                    className="w-full rounded-xl bg-primary py-4 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 disabled:opacity-50"
                  >
                    {createBooking.isPending ? 'Đang gửi...' : `Xác nhận đặt xe · ${formatVND(totalPrice)}`}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default BookingPage;
