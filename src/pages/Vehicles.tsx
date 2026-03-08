import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { useVehicles } from "@/hooks/useVehicles";
import { useServiceTypes } from "@/hooks/useServices";
import VehicleCard from "@/components/VehicleCard";
import SkeletonCard from "@/components/SkeletonCard";

const typeFilters = ["all", "car", "suv", "luxury", "van", "electric"] as const;
const seatOptions = [4, 5, 7, 16] as const;
const sortOptions = [
  { value: "default", label: "Mặc định" },
  { value: "price_asc", label: "Giá tăng dần" },
  { value: "price_desc", label: "Giá giảm dần" },
  { value: "rating", label: "Đánh giá cao nhất" },
] as const;

const Vehicles = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const serviceSlug = searchParams.get("service") || "";

  const [search, setSearch] = useState("");
  const [activeType, setActiveType] = useState<string>("all");
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState("default");
  const [showFilters, setShowFilters] = useState(!!serviceSlug);

  const { data: vehicles = [], isLoading } = useVehicles();
  const { data: serviceTypes = [] } = useServiceTypes();

  const activeServiceType = serviceTypes.find((s) => s.slug === serviceSlug);

  const clearService = () => {
    searchParams.delete("service");
    setSearchParams(searchParams);
  };

  const toggleSeat = (s: number) => {
    setSelectedSeats((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  const filtered = useMemo(() => {
    let list = vehicles.filter((v) => {
      const matchesSearch = v.name.toLowerCase().includes(search.toLowerCase());
      const matchesType = activeType === "all" || v.type === activeType;
      const matchesSeats =
        selectedSeats.length === 0 || selectedSeats.includes(v.seats);
      const matchesService =
        !serviceSlug ||
        (v.packages && v.packages.some((p) => p.serviceTypeSlug === serviceSlug && p.isActive));
      return matchesSearch && matchesType && matchesSeats && matchesService;
    });

    if (sortBy === "price_asc") {
      list = [...list].sort((a, b) => {
        const aMin = a.packages?.length ? Math.min(...a.packages.filter(p => p.isActive).map(p => p.price)) : a.pricePerDay;
        const bMin = b.packages?.length ? Math.min(...b.packages.filter(p => p.isActive).map(p => p.price)) : b.pricePerDay;
        return aMin - bMin;
      });
    } else if (sortBy === "price_desc") {
      list = [...list].sort((a, b) => {
        const aMin = a.packages?.length ? Math.min(...a.packages.filter(p => p.isActive).map(p => p.price)) : a.pricePerDay;
        const bMin = b.packages?.length ? Math.min(...b.packages.filter(p => p.isActive).map(p => p.price)) : b.pricePerDay;
        return bMin - aMin;
      });
    } else if (sortBy === "rating") {
      list = [...list].sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [vehicles, search, activeType, selectedSeats, serviceSlug, sortBy]);

  return (
    <div className="min-h-screen pb-24 pt-20 md:pb-8">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="mb-1 font-display text-2xl font-bold sm:text-3xl">
            {activeServiceType ? activeServiceType.name : "Đội Xe Của Chúng Tôi"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {activeServiceType
              ? activeServiceType.description
              : "Chọn chiếc xe hoàn hảo cho bạn"}
          </p>
        </motion.div>

        {/* Active service badge */}
        {serviceSlug && activeServiceType && (
          <div className="mb-4 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
              {activeServiceType.name}
              <button onClick={clearService} className="ml-1 rounded-full hover:bg-primary/20 p-0.5">
                <X className="h-3 w-3" />
              </button>
            </span>
            <span className="text-xs text-muted-foreground">{filtered.length} xe phù hợp</span>
          </div>
        )}

        {/* Search & Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 space-y-3"
        >
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Tìm kiếm xe..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-border bg-card py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1.5 rounded-xl border px-4 py-3 text-xs font-medium transition-colors ${
                showFilters ? "border-primary bg-primary/5 text-primary" : "border-border bg-card text-muted-foreground"
              }`}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" /> Lọc
            </button>
          </div>

          {/* Type filter pills */}
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
                {type === "all" ? "Tất cả" : type === "electric" ? "Điện" : type.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Expanded filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="space-y-3 rounded-xl border border-border bg-card p-4"
            >
              {/* Seats */}
              <div>
                <label className="mb-2 block text-xs font-semibold text-muted-foreground">Số chỗ ngồi</label>
                <div className="flex flex-wrap gap-2">
                  {seatOptions.map((s) => (
                    <button
                      key={s}
                      onClick={() => toggleSeat(s)}
                      className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                        selectedSeats.includes(s)
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground"
                      }`}
                    >
                      {s} chỗ
                    </button>
                  ))}
                </div>
              </div>

              {/* Service type filter */}
              {!serviceSlug && (
                <div>
                  <label className="mb-2 block text-xs font-semibold text-muted-foreground">Loại dịch vụ</label>
                  <div className="flex flex-wrap gap-2">
                    {serviceTypes.filter(s => s.isActive).map((st) => (
                      <button
                        key={st.id}
                        onClick={() => {
                          searchParams.set("service", st.slug);
                          setSearchParams(searchParams);
                        }}
                        className="rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        {st.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Sort */}
              <div>
                <label className="mb-2 block text-xs font-semibold text-muted-foreground">Sắp xếp</label>
                <div className="relative inline-block">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none rounded-lg border border-border bg-card px-3 py-2 pr-8 text-xs focus:border-primary focus:outline-none"
                  >
                    {sortOptions.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Results */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : filtered.map((vehicle, i) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} index={i} />
              ))}
        </div>

        {!isLoading && filtered.length === 0 && (
          <div className="py-20 text-center">
            <SlidersHorizontal className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
            <p className="text-muted-foreground">Không tìm thấy xe nào</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Vehicles;
