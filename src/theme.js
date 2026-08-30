const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

function rgbToHsl(red, green, blue) {
  const r = red / 255;
  const g = green / 255;
  const b = blue / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const lightness = (max + min) / 2;
  const delta = max - min;
  if (!delta) return { h: 0, s: 0, l: lightness };
  const saturation = delta / (1 - Math.abs(2 * lightness - 1));
  let hue = 0;
  if (max === r) hue = 60 * (((g - b) / delta) % 6);
  else if (max === g) hue = 60 * ((b - r) / delta + 2);
  else hue = 60 * ((r - g) / delta + 4);
  return { h: (hue + 360) % 360, s: saturation, l: lightness };
}

const hsl = (h, s, l) => `hsl(${Math.round((h + 360) % 360)} ${Math.round(clamp(s, 0, 1) * 100)}% ${Math.round(clamp(l, 0, 1) * 100)}%)`;
const hsla = (h, s, l, a) => `hsla(${Math.round((h + 360) % 360)} ${Math.round(clamp(s, 0, 1) * 100)}% ${Math.round(clamp(l, 0, 1) * 100)}% / ${a})`;

export function defaultTheme() {
  return {
    primary: '#8ea7ff',
    secondary: '#a986ff',
    accent: '#dbff5d',
    background: '#080a10',
    surface: 'rgba(8, 10, 16, .58)',
    surfaceElevated: 'rgba(22, 25, 38, .78)',
    border: 'rgba(255,255,255,.22)',
    text: '#f6f4ef',
    mutedText: 'rgba(246,244,239,.68)',
    glow: 'rgba(142,167,255,.34)',
    gradientStart: 'rgba(10,13,24,.92)',
    gradientEnd: 'rgba(10,13,24,.2)',
  };
}

function themeFromHsl({ h, s, l }) {
  const chroma = clamp(Math.max(s, .42), .42, .78);
  const baseLight = clamp(l, .28, .62);
  const primary = hsl(h, chroma, clamp(baseLight + .04, .38, .68));
  const secondary = hsl(h + 42, clamp(chroma * .82, .32, .7), clamp(baseLight + .1, .42, .72));
  const accent = hsl(h + 164, clamp(chroma * .72, .34, .68), .72);
  const background = hsl(h - 14, clamp(chroma * .62, .25, .58), .055);
  const surface = hsla(h - 8, clamp(chroma * .6, .22, .56), .11, .7);
  const surfaceElevated = hsla(h + 20, clamp(chroma * .58, .22, .55), .18, .82);
  const border = hsla(h + 8, clamp(chroma * .56, .2, .5), .78, .28);
  const glow = hsla(h, clamp(chroma * .8, .3, .7), .62, .36);
  const gradientStart = hsla(h - 10, clamp(chroma * .65, .24, .58), .05, .96);
  const gradientEnd = hsla(h + 34, clamp(chroma * .56, .22, .52), .16, .18);
  return { primary, secondary, accent, background, surface, surfaceElevated, border, text: '#f7f5ef', mutedText: 'rgba(247,245,239,.68)', glow, gradientStart, gradientEnd };
}

export function deriveThemeFromImage(source) {
  if (!source || !/^((data:image\/)|(https:\/\/)|(\/))/.test(source)) return defaultTheme();
  return new Promise((resolve) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => {
      try {
        const size = 48;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const context = canvas.getContext('2d', { willReadFrequently: true });
        context.drawImage(image, 0, 0, size, size);
        const pixels = context.getImageData(0, 0, size, size).data;
        let totalWeight = 0;
        let hue = 0;
        let saturation = 0;
        let lightness = 0;
        let vibrantWeight = 0;
        for (let index = 0; index < pixels.length; index += 16) {
          const alpha = pixels[index + 3] / 255;
          if (alpha < .2) continue;
          const color = rgbToHsl(pixels[index], pixels[index + 1], pixels[index + 2]);
          const weight = alpha * (0.35 + color.s * 1.8) * (0.65 + Math.abs(color.l - .5));
          totalWeight += weight;
          hue += color.h * weight;
          saturation += color.s * weight;
          lightness += color.l * weight;
          if (color.s > .25 && color.l > .16 && color.l < .82) vibrantWeight += weight;
        }
        if (!totalWeight || !vibrantWeight) return resolve(defaultTheme());
        resolve(themeFromHsl({ h: hue / totalWeight, s: saturation / totalWeight, l: lightness / totalWeight }));
      } catch {
        resolve(defaultTheme());
      }
    };
    image.onerror = () => resolve(defaultTheme());
    image.src = source;
  });
}

export function applyTheme(element, theme = defaultTheme()) {
  if (!element) return;
  Object.entries(theme).forEach(([name, value]) => element.style.setProperty(`--theme-${name}`, value));
  element.dataset.themeReady = 'true';
}

export function themeSwatches(theme = defaultTheme()) {
  return [theme.primary, theme.secondary, theme.accent, theme.background].map((color) => `<span style="background:${color}" aria-hidden="true"></span>`).join('');
}
