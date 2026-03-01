import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "./ThemeProvider";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  const cycle = () => {
    const order: Array<"light" | "dark" | "system"> = ["light", "dark", "system"];
    const idx = order.indexOf(theme);
    setTheme(order[(idx + 1) % order.length]);
  };

  const Icon = theme === "dark" ? Moon : theme === "light" ? Sun : Monitor;

  return (
    <button
      onClick={cycle}
      aria-label="Đổi giao diện"
      title={
        theme === "light" ? "Sáng" : theme === "dark" ? "Tối" : "Theo hệ thống"
      }
      className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
    >
      <Icon className="h-[18px] w-[18px]" />
    </button>
  );
};

export default ThemeToggle;
