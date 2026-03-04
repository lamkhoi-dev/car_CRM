import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Mail, MessageCircle, X } from "lucide-react";

const CONTACTS = [
  {
    id: "phone",
    icon: Phone,
    label: "Gọi ngay",
    href: "tel:0922225599",
    color: "bg-green-500",
    ring: "ring-green-500/30",
  },
  {
    id: "zalo",
    icon: MessageCircle,
    label: "Zalo",
    href: "https://zalo.me/0922225599",
    color: "bg-blue-500",
    ring: "ring-blue-500/30",
  },
  {
    id: "email",
    icon: Mail,
    label: "Email",
    href: "mailto:",
    color: "bg-red-500",
    ring: "ring-red-500/30",
  },
];

const ContactWidget = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-24 right-4 z-50 flex flex-col items-end gap-3 md:bottom-6">
      {/* Expanded bubbles */}
      <AnimatePresence>
        {open &&
          CONTACTS.map((c, i) => (
            <motion.a
              key={c.id}
              href={c.href}
              target={c.id === "zalo" ? "_blank" : undefined}
              rel={c.id === "zalo" ? "noopener noreferrer" : undefined}
              initial={{ opacity: 0, y: 20, scale: 0.5 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.5 }}
              transition={{ delay: i * 0.07, type: "spring", stiffness: 400, damping: 20 }}
              className={`flex items-center gap-2 rounded-full ${c.color} px-4 py-2.5 text-sm font-medium text-white shadow-lg ring-4 ${c.ring} transition-transform hover:scale-105`}
            >
              <c.icon className="h-4 w-4" />
              <span className="whitespace-nowrap">{c.label}</span>
            </motion.a>
          ))}
      </AnimatePresence>

      {/* Toggle button */}
      <motion.button
        onClick={() => setOpen(!open)}
        whileTap={{ scale: 0.9 }}
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl transition-colors hover:opacity-90"
      >
        {/* Ping animation */}
        {!open && (
          <span className="absolute inset-0 animate-ping rounded-full bg-primary/40" />
        )}
        <motion.div
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {open ? <X className="h-6 w-6" /> : <Phone className="h-6 w-6" />}
        </motion.div>
      </motion.button>
    </div>
  );
};

export default ContactWidget;
