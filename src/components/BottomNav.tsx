import { Link, useLocation } from "react-router-dom";
import { Home, Car, BookOpen, User } from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/vehicles", icon: Car, label: "Vehicles" },
  { to: "/blog", icon: BookOpen, label: "Blog" },
  { to: "/admin", icon: User, label: "Admin" },
];

const BottomNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-strong border-t border-border/50 pb-safe md:hidden">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = item.to === "/" 
            ? location.pathname === "/" 
            : location.pathname.startsWith(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              className="relative flex flex-col items-center gap-0.5 px-3 py-1.5"
            >
              {isActive && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className="absolute -top-0.5 h-0.5 w-8 rounded-full bg-primary"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <item.icon
                className={`h-5 w-5 transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              />
              <span
                className={`text-[10px] font-medium transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
