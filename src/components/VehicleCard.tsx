import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { motion } from "framer-motion";
import type { Vehicle } from "@/lib/api";
import { formatVND } from "@/lib/utils";

interface VehicleCardProps {
  vehicle: Vehicle;
  index?: number;
}

const VehicleCard = ({ vehicle, index = 0 }: VehicleCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link
        to={`/vehicles/${vehicle.id}`}
        className="group block overflow-hidden rounded-xl bg-card card-shadow transition-all duration-300 hover:card-shadow-hover"
      >
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src={vehicle.images[0]}
            alt={vehicle.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
          <div className="absolute bottom-3 left-3">
            <span className="rounded-full bg-primary/90 px-3 py-1 text-xs font-semibold text-primary-foreground backdrop-blur-sm">
              {vehicle.type.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="p-4">
          <div className="mb-1 flex items-center justify-between">
            <h3 className="font-display text-lg font-bold text-foreground">
              {vehicle.name}
            </h3>
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-warning text-warning" />
              <span className="text-xs font-medium text-muted-foreground">
                {vehicle.rating}
              </span>
            </div>
          </div>

          <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
            {vehicle.description}
          </p>

          <div className="flex items-center justify-between border-t border-border/50 pt-3">
            <div>
              <span className="text-xl font-bold text-foreground">
                {formatVND(vehicle.pricePerDay)}
              </span>
              <span className="text-sm text-muted-foreground">/ngày</span>
            </div>
            <span className="rounded-lg bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              Xem chi tiết
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default VehicleCard;
