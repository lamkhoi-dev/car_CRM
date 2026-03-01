import { useState } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal } from "lucide-react";
import { useVehicles } from "@/hooks/useVehicles";
import VehicleCard from "@/components/VehicleCard";
import SkeletonCard from "@/components/SkeletonCard";

const typeFilters = ["all", "car", "suv", "luxury", "bike"] as const;

const Vehicles = () => {
  const [search, setSearch] = useState("");
  const [activeType, setActiveType] = useState<string>("all");
  const { data: vehicles = [], isLoading } = useVehicles();

  const filtered = vehicles.filter((v) => {
    const matchesSearch = v.name.toLowerCase().includes(search.toLowerCase());
    const matchesType = activeType === "all" || v.type === activeType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen pb-24 pt-20 md:pb-8">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="mb-1 font-display text-2xl font-bold sm:text-3xl">
            Our Fleet
          </h1>
          <p className="text-sm text-muted-foreground">
            Choose your perfect ride
          </p>
        </motion.div>

        {/* Search & Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 space-y-3"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search vehicles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-border bg-card py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto hide-scrollbar">
            {typeFilters.map((type) => (
              <button
                key={type}
                onClick={() => setActiveType(type)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-medium transition-colors ${
                  activeType === type
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Results */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : filtered.map((vehicle, i) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} index={i} />
              ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-20 text-center">
            <SlidersHorizontal className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
            <p className="text-muted-foreground">No vehicles found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Vehicles;
