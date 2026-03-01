import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, CalendarDays, Check, Loader2 } from "lucide-react";
import { useState, useMemo } from "react";
import { useVehicle } from "@/hooks/useVehicles";
import { useCreateBooking } from "@/hooks/useBookings";
import { toast } from "sonner";
import { formatVND, getDeviceId } from "@/lib/utils";

const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: vehicle, isLoading } = useVehicle(id);
  const createBooking = useCreateBooking();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    startDate: "",
    endDate: "",
  });
  const [submitted, setSubmitted] = useState(false);

  // Tính tổng giá dựa trên số ngày thuê
  const totalPrice = useMemo(() => {
    if (!vehicle || !form.startDate || !form.endDate) return 0;
    const start = new Date(form.startDate);
    const end = new Date(form.endDate);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) return 0;
    return diffDays * vehicle.pricePerDay;
  }, [vehicle, form.startDate, form.endDate]);

  const totalDays = useMemo(() => {
    if (!form.startDate || !form.endDate) return 0;
    const start = new Date(form.startDate);
    const end = new Date(form.endDate);
    const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  }, [form.startDate, form.endDate]);

  // Ngày nhỏ nhất cho input date (hôm nay)
  const today = new Date().toISOString().split('T')[0];

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.startDate || !form.endDate) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }
    if (form.startDate < today) {
      toast.error("Ngày bắt đầu không thể trong quá khứ");
      return;
    }
    if (form.endDate <= form.startDate) {
      toast.error("Ngày kết thúc phải sau ngày bắt đầu");
      return;
    }
    if (totalDays <= 0) {
      toast.error("Khoảng ngày không hợp lệ");
      return;
    }

    try {
      await createBooking.mutateAsync({
        vehicleId: vehicle.id,
        vehicleName: vehicle.name,
        customerName: form.name,
        customerPhone: form.phone,
        startDate: form.startDate,
        endDate: form.endDate,
        totalPrice,
        deviceId: getDeviceId(),
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
        <p className="mb-6 text-center text-sm font-semibold text-primary">
          {totalDays} ngày · {formatVND(totalPrice)}
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
            onClick={() => navigate(-1)}
            className="mb-4 mt-4 flex items-center gap-1 text-sm text-muted-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Quay lại
          </button>

          <h1 className="mb-1 font-display text-2xl font-bold">Đặt xe {vehicle.name}</h1>
          <p className="mb-6 text-sm text-muted-foreground">
            {formatVND(vehicle.pricePerDay)}/ngày · {formatVND(vehicle.pricePerHour)}/giờ
          </p>

          {/* Vehicle preview */}
          <div className="mb-6 overflow-hidden rounded-xl">
            <img
              src={vehicle.images[0]}
              alt={vehicle.name}
              className="h-40 w-full object-cover"
            />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Họ và tên</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Nhập họ và tên"
                className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">Số điện thoại</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="0912 345 678"
                className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Ngày bắt đầu</label>
                <div className="relative">
                  <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="date"
                    value={form.startDate}
                    min={today}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    className="w-full rounded-xl border border-border bg-card py-3 pl-10 pr-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Ngày kết thúc</label>
                <div className="relative">
                  <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="date"
                    value={form.endDate}
                    min={form.startDate || today}
                    onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                    className="w-full rounded-xl border border-border bg-card py-3 pl-10 pr-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            {/* Price Summary */}
            {totalDays > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="rounded-xl bg-secondary p-4"
              >
                <h3 className="mb-2 text-sm font-semibold">Chi tiết giá</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>{formatVND(vehicle.pricePerDay)} x {totalDays} ngày</span>
                    <span>{formatVND(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between border-t border-border pt-1 font-bold">
                    <span>Tổng cộng</span>
                    <span className="text-primary">{formatVND(totalPrice)}</span>
                  </div>
                </div>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={createBooking.isPending}
              className="w-full rounded-xl bg-primary py-4 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 disabled:opacity-50"
            >
              {createBooking.isPending ? 'Đang gửi...' : `Đặt xe${totalPrice > 0 ? ` · ${formatVND(totalPrice)}` : ''}`}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default BookingPage;
