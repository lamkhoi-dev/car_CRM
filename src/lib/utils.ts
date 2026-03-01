import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format number as VNĐ currency: 1500000 → "1.500.000₫" */
export function formatVND(amount: number): string {
  return amount.toLocaleString('vi-VN') + '₫';
}
