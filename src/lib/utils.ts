import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { TFunction } from "i18next"
/**
 * Standard Tailwind class merger.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
/**
 * Format a timestamp into a localized string using native Intl.
 */
export function formatDate(timestamp: number | Date, locale: string = "de-DE"): string {
  const date = typeof timestamp === "number" ? new Date(timestamp) : timestamp;
  const safeLocale = locale.startsWith('en') ? 'en-GB' : (locale.startsWith('fr') ? 'fr-FR' : 'de-DE');
  return new Intl.DateTimeFormat(safeLocale, {
    dateStyle: "long",
  }).format(date);
}
/**
 * Robust currency formatter for ZTNA Scout.
 * Ensures consistent EUR formatting across all user locales.
 */
export function formatCurrency(amount: number | undefined | null, locale: string = "de-DE"): string {
  const safeAmount = amount ?? 0;
  const safeLocale = (locale && locale.startsWith('en')) ? 'en-GB' : 
                     (locale && locale.startsWith('fr')) ? 'fr-FR' : 'de-DE';
  return new Intl.NumberFormat(safeLocale, {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0
  }).format(safeAmount);
}
/**
 * Retrieves the localized rank label (e.g., 1st Place, 1. Platz).
 * Fallback for ranks beyond 3 or missing translation keys.
 */
export function getRankLabel(rank: number, t: TFunction): string {
  const key = `results.matrix.rank_${rank}`;
  const translated = t(key);
  // If the key wasn't found or returns the raw key, or rank is high, fallback to localized rank #
  if (translated === key || rank > 3) {
    return `#${rank}`;
  }
  return translated;
}