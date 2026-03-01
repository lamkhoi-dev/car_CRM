import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format number as VNĐ currency: 1500000 → "1.500.000₫" */
export function formatVND(amount: number): string {
  return amount.toLocaleString('vi-VN') + '₫';
}

/** Lấy hoặc tạo Device ID duy nhất cho thiết bị này */
export function getDeviceId(): string {
  const KEY = 'driveflux_device_id';
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(KEY, id);
  }
  return id;
}

/** Format ISO date string → readable VN format: "28/02/2026 14:30" */
export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso; // fallback for old date-only strings
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
