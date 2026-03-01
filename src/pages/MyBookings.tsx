import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  CalendarDays, Clock, CheckCircle, XCircle, AlertCircle, Loader2, Car,
} from "lucide-react";
import { useMyBookings } from "@/hooks/useBookings";
import { formatVND, formatDateTime } from "@/lib/utils";

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  pending: { label: "Chờ duyệt", color: "bg-warning/10 text-warning", icon: AlertCircle },
  confirmed: { label: "Đã xác nhận", color: "bg-success/10 text-success", icon: CheckCircle },
  cancelled: { label: "Đã huỷ", color: "bg-destructive/10 text-destructive", icon: XCircle },
};

const MyBookings = () => {
  const { data: bookings = [], isLoading } = useMyBookings();

  return (
    <div className="min-h-screen pb-24 pt-20 md:pb-8">
      <div className="container max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="mb-1 font-display text-2xl font-bold">Đơn của tôi</h1>
          <p className="mb-6 text-sm text-muted-foreground">
            Lịch sử đặt xe trên thiết bị này
          </p>

          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : bookings.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-center">
              <Car className="mb-3 h-10 w-10 text-muted-foreground/40" />
              <p className="mb-1 text-sm font-medium text-muted-foreground">
                Chưa có đơn đặt xe nào
              </p>
              <p className="mb-4 text-xs text-muted-foreground">
                Đặt xe đầu tiên của bạn ngay hôm nay!
              </p>
              <Link
                to="/vehicles"
                className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
              >
                Xem đội xe
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.map((b, i) => {
                const cfg = statusConfig[b.status] || statusConfig.pending;
                const StatusIcon = cfg.icon;
                return (
                  <motion.div
                    key={b.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="rounded-xl bg-card p-4 card-shadow"
                  >
                    {/* Header */}
                    <div className="mb-2 flex items-center justify-between">
                      <Link
                        to={`/vehicles/${b.vehicleId}`}
                        className="text-sm font-semibold text-foreground hover:text-primary transition-colors"
                      >
                        {b.vehicleName}
                      </Link>
                      <span className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${cfg.color}`}>
                        <StatusIcon className="h-3 w-3" />
                        {cfg.label}
                      </span>
                    </div>

                    {/* Dates */}
                    <div className="mb-2 flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {b.startDate} → {b.endDate}
                      </span>
                    </div>

                    {/* Price + Created */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold">{formatVND(b.totalPrice)}</span>
                      <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {formatDateTime(b.createdAt)}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default MyBookings;
