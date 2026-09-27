/**
 * Tenant Branding & Theming Engine
 * Enforces accessibility rules so custom school colors never break readability (Section 71).
 */

export interface TenantThemeTokens {
  primary: string;
  primaryForeground: string;
  accent: string;
  borderSubtle: string;
}

/**
 * Calculates perceived relative luminance per WCAG 2.1 specs
 */
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const val = c / 255;
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Converts Hex to RGB
 */
function hexToRgb(hex: string): [number, number, number] | null {
  const cleaned = hex.replace("#", "");
  if (cleaned.length !== 6) return null;
  const num = parseInt(cleaned, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

/**
 * Derives an accessible tenant theme from a school brand primary color
 */
export function generateTenantTheme(brandColorHex: string): TenantThemeTokens {
  const rgb = hexToRgb(brandColorHex);
  if (!rgb) {
    // Default institutional navy fallback
    return {
      primary: "hsl(221, 83%, 53%)",
      primaryForeground: "#ffffff",
      accent: "hsl(214, 95%, 93%)",
      borderSubtle: "hsl(214, 32%, 91%)",
    };
  }

  const lum = getLuminance(rgb[0], rgb[1], rgb[2]);
  // If luminance is high (bright color), use dark foreground; otherwise white text for contrast
  const primaryForeground = lum > 0.4 ? "#0f172a" : "#ffffff";

  return {
    primary: brandColorHex,
    primaryForeground,
    accent: `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.12)`,
    borderSubtle: `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.25)`,
  };
}

/**
 * Applies tenant theme tokens to document root
 */
export function applyTenantTheme(theme: TenantThemeTokens): void {
  if (typeof document === "undefined") return;

  const root = document.documentElement;
  root.style.setProperty("--primary", theme.primary);
  root.style.setProperty("--primary-foreground", theme.primaryForeground);
  root.style.setProperty("--color-primary", theme.primary);
  root.style.setProperty("--color-primary-foreground", theme.primaryForeground);
}
