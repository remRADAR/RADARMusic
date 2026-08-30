import type { CSSProperties } from "react";

export type PortalTheme = {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  surfaceElevated: string;
  border: string;
  text: string;
  mutedText: string;
  glow: string;
  gradientStart: string;
  gradientEnd: string;
};

export const DEFAULT_THEME: PortalTheme = {
  primary: "#7f9cff",
  secondary: "#b08cff",
  accent: "#d7ff65",
  background: "#080a12",
  surface: "rgba(12, 15, 26, .66)",
  surfaceElevated: "rgba(25, 29, 46, .84)",
  border: "rgba(255,255,255,.2)",
  text: "#f7f5ef",
  mutedText: "rgba(247,245,239,.7)",
  glow: "rgba(127,156,255,.35)",
  gradientStart: "rgba(8,10,18,.96)",
  gradientEnd: "rgba(38,44,84,.22)",
};

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  if (!d) return { h: 0, s: 0, l };
  const s = d / (1 - Math.abs(2 * l - 1));
  let h = 0;
  if (max === r) h = 60 * (((g - b) / d) % 6);
  else if (max === g) h = 60 * ((b - r) / d + 2);
  else h = 60 * ((r - g) / d + 4);
  return { h: (h + 360) % 360, s, l };
}

const color = (h: number, s: number, l: number) =>
  `hsl(${Math.round((h + 360) % 360)} ${Math.round(Math.max(0, Math.min(1, s)) * 100)}% ${Math.round(Math.max(0, Math.min(1, l)) * 100)}%)`;
const alphaColor = (h: number, s: number, l: number, a: number) =>
  `hsla(${Math.round((h + 360) % 360)} ${Math.round(Math.max(0, Math.min(1, s)) * 100)}% ${Math.round(Math.max(0, Math.min(1, l)) * 100)}% / ${a})`;

export function themeFromHsl(input: { h: number; s: number; l: number }): PortalTheme {
  const saturation = Math.max(0.42, Math.min(0.78, input.s));
  const lightness = Math.max(0.3, Math.min(0.62, input.l));
  const h = input.h;
  return {
    primary: color(h, saturation, Math.min(0.68, lightness + 0.08)),
    secondary: color(h + 42, saturation * 0.82, Math.min(0.72, lightness + 0.14)),
    accent: color(h + 164, Math.max(0.34, saturation * 0.72), 0.72),
    background: color(h - 14, saturation * 0.62, 0.055),
    surface: alphaColor(h - 8, saturation * 0.6, 0.11, 0.72),
    surfaceElevated: alphaColor(h + 20, saturation * 0.58, 0.18, 0.84),
    border: alphaColor(h + 8, saturation * 0.56, 0.78, 0.28),
    text: "#f7f5ef",
    mutedText: "rgba(247,245,239,.7)",
    glow: alphaColor(h, saturation * 0.8, 0.62, 0.36),
    gradientStart: alphaColor(h - 10, saturation * 0.65, 0.05, 0.96),
    gradientEnd: alphaColor(h + 34, saturation * 0.56, 0.16, 0.2),
  };
}

export function deriveTheme(imageUrl: string): Promise<PortalTheme> {
  if (!imageUrl || typeof window === "undefined") return Promise.resolve(DEFAULT_THEME);
  return new Promise((resolve) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = 48;
        canvas.height = 48;
        const context = canvas.getContext("2d", { willReadFrequently: true });
        if (!context) return resolve(DEFAULT_THEME);
        context.drawImage(image, 0, 0, 48, 48);
        const pixels = context.getImageData(0, 0, 48, 48).data;
        let total = 0;
        let h = 0;
        let s = 0;
        let l = 0;
        for (let i = 0; i < pixels.length; i += 16) {
          const alpha = pixels[i + 3] / 255;
          if (alpha < 0.2) continue;
          const sample = rgbToHsl(pixels[i], pixels[i + 1], pixels[i + 2]);
          const weight = alpha * (0.35 + sample.s * 1.8);
          total += weight;
          h += sample.h * weight;
          s += sample.s * weight;
          l += sample.l * weight;
        }
        resolve(total ? themeFromHsl({ h: h / total, s: s / total, l: l / total }) : DEFAULT_THEME);
      } catch {
        resolve(DEFAULT_THEME);
      }
    };
    image.onerror = () => resolve(DEFAULT_THEME);
    image.src = imageUrl;
  });
}

export function themeStyle(theme: PortalTheme): CSSProperties {
  return {
    ...Object.fromEntries(Object.entries(theme).map(([key, value]) => [`--theme-${key}`, value])),
    "--primary": theme.primary,
    "--primary-foreground": theme.text,
    "--deep": theme.background,
    "--deep-foreground": theme.text,
    "--deep-muted": theme.mutedText,
    "--background": theme.background,
    "--foreground": theme.text,
    "--card": theme.surface,
    "--card-foreground": theme.text,
    "--muted-foreground": theme.mutedText,
    "--border": theme.border,
    "--input": theme.border,
    "--ring": theme.primary,
    "--glass": theme.surface,
    "--glass-border": theme.border,
  } as CSSProperties;
}
