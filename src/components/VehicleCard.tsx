import { Link } from "react-router-dom";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import type { Vehicle } from "@/lib/api";
import { formatVND } from "@/lib/utils";

interface VehicleCardProps {
  vehicle: Vehicle;
  index?: number;
}

const VehicleCard = ({ vehicle, index = 0 }: VehicleCardProps) => {
  const [imgIdx, setImgIdx] = useState(0);
  const images = vehicle.images;
  const hasMultiple = images.length > 1;

  const prev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setImgIdx((i) => (i - 1 + images.length) % images.length);
  };
  const next = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setImgIdx((i) => (i + 1) % images.length);
  };

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
            src={images[imgIdx]}
            alt={vehicle.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/20 to-transparent" />

          {/* Prev / Next arrows — only on hover, only if multiple */}
          {hasMultiple && (
            <>
              <button
                onClick={prev}
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/70 p-1 text-foreground opacity-0 shadow backdrop-blur-sm transition-opacity group-hover:opacity-100"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={next}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/70 p-1 text-foreground opacity-0 shadow backdrop-blur-sm transition-opacity group-hover:opacity-100"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </>
          )}

          {/* Dots */}
          {hasMultiple && (
            <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
              {images.map((_, i) => (
                <span
                  key={i}
                  className={`block h-1.5 rounded-full transition-all ${
                    i === imgIdx ? "w-4 bg-primary" : "w-1.5 bg-white/70"
                  }`}
                />
              ))}
            </div>
          )}

          <div className="absolute top-3 left-3">
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
