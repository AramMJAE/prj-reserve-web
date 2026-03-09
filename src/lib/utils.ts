import { format } from "date-fns";
import { ko } from "date-fns/locale";

export function formatPrice(price: number): string {
  return `₩${price.toLocaleString("ko-KR")}`;
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, "yyyy.MM.dd (EEE)", { locale: ko });
}

export function calculateNights(checkIn: Date, checkOut: Date): number {
  const diff = checkOut.getTime() - checkIn.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
