import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Clock, Star, ChevronRight } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import { useVehicles } from "@/hooks/useVehicles";
import { useTestimonials } from "@/hooks/useBlog";
import VehicleCard from "@/components/VehicleCard";
import SkeletonCard from "@/components/SkeletonCard";

const Index = () => {
  const { data: vehicles = [], isLoading: loadingVehicles } = useVehicles();
  const { data: testimonials = [], isLoading: loadingTestimonials } = useTestimonials();

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      {/* Hero */}
      <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden">
        <img
          src={heroBg}
          alt="Luxury vehicle"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
        <div className="absolute inset-0 bg-background/50" />

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
              Premium Vehicle Rental
            </motion.span>

            <h1 className="mb-6 font-display text-4xl font-black leading-tight tracking-tight text-foreground sm:text-5xl md:text-7xl">
              Drive the{" "}
              <span className="gradient-text">Extraordinary</span>
            </h1>

            <p className="mx-auto mb-8 max-w-xl text-base text-muted-foreground sm:text-lg">
              Unlock premium vehicles for any occasion. Seamless booking, 
              exceptional service, unforgettable experiences.
            </p>

            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                to="/vehicles"
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 sm:w-auto"
              >
                Rent Now
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/vehicles"
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-secondary/50 px-8 py-4 text-sm font-semibold text-secondary-foreground backdrop-blur-sm transition-all hover:bg-secondary sm:w-auto"
              >
                Browse Fleet
              </Link>
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

      {/* Stats */}
      <section className="border-b border-border/50 bg-card/50">
        <div className="container grid grid-cols-3 divide-x divide-border/50 py-8">
          {[
            { value: "500+", label: "Vehicles" },
            { value: "10K+", label: "Happy Clients" },
            { value: "4.9", label: "Avg Rating" },
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

      {/* Features */}
      <section className="py-16">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10 text-center"
          >
            <h2 className="mb-2 font-display text-2xl font-bold sm:text-3xl">
              Why Choose Us
            </h2>
            <p className="text-sm text-muted-foreground">
              Premium service at every touchpoint
            </p>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { icon: Shield, title: "Fully Insured", desc: "Complete coverage on every rental for your peace of mind." },
              { icon: Clock, title: "24/7 Support", desc: "Round-the-clock assistance whenever you need it." },
              { icon: Star, title: "Premium Fleet", desc: "Only the finest vehicles, maintained to perfection." },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
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

      {/* Featured Vehicles */}
      <section className="py-16 bg-card/30">
        <div className="container">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold sm:text-3xl">
                Featured Vehicles
              </h2>
              <p className="text-sm text-muted-foreground">
                Hand-picked for an exceptional experience
              </p>
            </div>
            <Link
              to="/vehicles"
              className="hidden items-center gap-1 text-sm font-medium text-primary sm:flex"
            >
              View All <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {loadingVehicles
              ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
              : vehicles.slice(0, 3).map((vehicle, i) => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} index={i} />
                ))}
          </div>

          <Link
            to="/vehicles"
            className="mt-6 flex items-center justify-center gap-1 text-sm font-medium text-primary sm:hidden"
          >
            View All Vehicles <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10 text-center"
          >
            <h2 className="mb-2 font-display text-2xl font-bold sm:text-3xl">
              What Our Clients Say
            </h2>
            <p className="text-sm text-muted-foreground">
              Real experiences from real drivers
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

      {/* CTA */}
      <section className="py-16">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-2xl bg-card p-8 text-center card-shadow sm:p-12"
          >
            <div className="absolute inset-0 opacity-20" style={{ background: "var(--gradient-primary)" }} />
            <div className="relative z-10">
              <h2 className="mb-3 font-display text-2xl font-bold sm:text-4xl">
                Ready to Hit the Road?
              </h2>
              <p className="mx-auto mb-6 max-w-md text-sm text-muted-foreground">
                Browse our fleet and book your dream vehicle in minutes.
              </p>
              <Link
                to="/vehicles"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90"
              >
                Explore Vehicles <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="container text-center">
          <p className="text-xs text-muted-foreground">
            © 2026 DriveFlux. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
