import ColorThief from "colorthief";

/**
 * Convert RGB to HSL
 */
function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = 0,
    s,
    l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  } else {
    s = 0;
  }

  return [h * 360, s, l];
}

/**
 * Convert HSL back to RGB
 */
function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  h /= 360;
  const hue2rgb = (p: number, q: number, t: number): number => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const r = hue2rgb(p, q, h + 1 / 3);
  const g = hue2rgb(p, q, h);
  const b = hue2rgb(p, q, h - 1 / 3);
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

/**
 * Create a brighter pastel-like color from RGB
 */
function pastelize(rgb: [number, number, number]): [number, number, number] {
  const [h, _s, _l] = rgbToHsl(...rgb);
  return hslToRgb(h, 0.45, 0.88); // more saturation, higher lightness
}

/**
 * Brighten RGB color
 */
function brighten(
  rgb: [number, number, number],
  amount = 0.5
): [number, number, number] {
  const [h, s, l] = rgbToHsl(...rgb);
  return hslToRgb(h, Math.min(1, s + 0.2), Math.min(1, l + amount)); // brighten + slight saturation boost
}

/**
 * Extract and return improved background and progress bar colors
 */
export async function getGradientColorsFromImage(imageUrl: string): Promise<{
  backgroundColor: string;
  progressColor: string;
}> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = imageUrl + "?" + Date.now(); // cache busting

    img.onload = () => {
      try {
        const colorThief = new ColorThief();
        const dominant = colorThief.getColor(img) as [number, number, number];
        const bgColor = pastelize(dominant);
        const progressColor = brighten(dominant, 0.7);

        resolve({
          backgroundColor: `rgb(${bgColor.join(",")})`,
          progressColor: `rgb(${progressColor.join(",")})`,
        });
      } catch (err) {
        reject("Failed to extract colors: " + err);
      }
    };

    img.onerror = (err) => {
      reject("Image failed to load: " + err);
    };
  });
}
