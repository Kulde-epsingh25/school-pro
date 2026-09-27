/**
 * Standard enterprise formatters for School Pro
 * Prevents locale ambiguity (e.g. 03/04/26 vs 04/03/26) and standardizes numeric/currency display
 */

/**
 * Formats a date into unambiguous institutional standard (e.g., "24 Sep 2026")
 */
export function formatDate(dateInput: string | number | Date | null | undefined): string {
  if (!dateInput) return "—";
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

/**
 * Formats date and time (e.g., "24 Sep 2026, 10:15 AM")
 */
export function formatDateTime(dateInput: string | number | Date | null | undefined): string {
  if (!dateInput) return "—";
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

/**
 * Formats relative time (e.g., "5 mins ago", "Yesterday", "In 2 days")
 */
export function formatRelativeTime(dateInput: string | number | Date | null | undefined): string {
  if (!dateInput) return "—";
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "—";

  const diffMs = Date.now() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay === 1) return "Yesterday";
  if (diffDay < 7) return `${diffDay}d ago`;

  return formatDate(date);
}

/**
 * Formats currency with currency code symbol and thousand separators
 */
export function formatCurrency(
  amount: number | null | undefined,
  currency: string = "USD",
  locale: string = "en-US"
): string {
  if (amount === null || amount === undefined || isNaN(amount)) return "—";

  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
}

/**
 * Formats percentage metrics with consistent decimal places (e.g. "84.5%")
 */
export function formatPercentage(value: number | null | undefined, decimals: number = 1): string {
  if (value === null || value === undefined || isNaN(value)) return "—";
  return `${value.toFixed(decimals)}%`;
}

/**
 * Masks sensitive identifiers (e.g., phone numbers, bank accounts, Aadhaar/SSN)
 * Example: maskSensitive("9811122334", 4) => "••••••2334"
 */
export function maskSensitive(value: string | null | undefined, visibleTailChars: number = 4): string {
  if (!value) return "—";
  const str = String(value).trim();
  if (str.length <= visibleTailChars) return str;
  const maskedCount = Math.max(0, str.length - visibleTailChars);
  return "•".repeat(Math.min(maskedCount, 6)) + str.slice(-visibleTailChars);
}
