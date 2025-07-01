import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency = "PEN"): string {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    minimumFractionDigits: 2,
  }).format(amount)
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("es-PE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date))
}

export function formatRating(rating: number): string {
  return rating.toFixed(1)
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function formatPhoneNumber(phone: string): string {
  // Formato peruano: +51 999 123 456
  if (phone.startsWith("+51")) {
    return phone
  }
  if (phone.startsWith("51")) {
    return `+${phone}`
  }
  if (phone.startsWith("9")) {
    return `+51 ${phone}`
  }
  return `+51 ${phone}`
}
