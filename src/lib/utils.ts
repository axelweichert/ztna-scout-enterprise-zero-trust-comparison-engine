import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { TFunction } from "i18next"
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
/**
 * Format a timestamp into a localized string using native Intl.
 */
export function formatDate(timestamp: number | Date, locale: string = "de-DE"): string {
  const date = typeof timestamp === "number" ? new Date(timestamp) : timestamp;
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "long",
  }).format(date);
}
/**
 * Retrieves the localized rank label (e.g., 1st Place, 1. Platz).
 * Fallback for ranks beyond 3.
 */
export function getRankLabel(rank: number, t: TFunction): string {
  const key = `results.matrix.rank_${rank}`;
  const translated = t(key);
  // If the key wasn't found or returns the raw key, fallback to a simple number
  if (translated === key || rank > 3) {
    return `#${rank}`;
  }
  return translated;
}