import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Star, Users, Fuel, Settings, ChevronRight, Loader2 } from "lucide-react";
import { useState } from "react";
import { useVehicle } from "@/hooks/useVehicles";

const VehicleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: vehicle, isLoading } = useVehicle(id);
  const [activeImage, setActiveImage] = useState(0);

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
        <p className="text-muted-foreground">Vehicle not found</p>
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
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30" />

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
              { icon: Users, label: "Seats", value: vehicle.seats },
              { icon: Settings, label: "Trans.", value: vehicle.transmission },
              { icon: Fuel, label: "Fuel", value: vehicle.fuel },
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
            <h3 className="mb-2 text-sm font-semibold">Features</h3>
            <div className="flex flex-wrap gap-2">
              {vehicle.features.map((f) => (
                <span key={f} className="rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground">
                  {f}
                </span>
              ))}
            </div>
          </div>

          {/* Pricing */}
          <div className="flex items-center justify-between rounded-lg bg-secondary p-4">
            <div>
              <div className="text-sm text-muted-foreground">From</div>
              <div className="flex items-baseline gap-1">
                <span className="font-display text-2xl font-bold">${vehicle.pricePerDay}</span>
                <span className="text-sm text-muted-foreground">/day</span>
              </div>
              <div className="text-xs text-muted-foreground">
                or ${vehicle.pricePerHour}/hour
              </div>
            </div>
            <Link
              to={`/booking/${vehicle.id}`}
              className="flex items-center gap-1 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90"
            >
              Book Now <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default VehicleDetail;
