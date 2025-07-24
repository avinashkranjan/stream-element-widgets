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
 * Generate a gradient from dark to light variants of a color
 */
function createGradient(rgb: [number, number, number]): string {
  const [h, s, l] = rgbToHsl(...rgb);

  // If dominant color is dark (lightness < 0.5), make gradient lighter
  if (l < 0.5) {
    const dark = hslToRgb(h, s, Math.max(0.3, l * 0.8)); // Not too dark
    const light = hslToRgb(h, s * 0.6, Math.min(0.95, l * 2.2)); // Very light
    return `linear-gradient(135deg, rgb(${dark.join(",")}), rgb(${light.join(
      ","
    )}))`;
  }
  // If dominant color is light, make gradient darker
  else {
    const dark = hslToRgb(h, s, Math.max(0.15, l * 0.4)); // Quite dark
    const light = hslToRgb(h, s * 0.8, Math.min(0.85, l * 1.3)); // Slightly lighter than dominant
    return `linear-gradient(135deg, rgb(${dark.join(",")}), rgb(${light.join(
      ","
    )}))`;
  }
}

function getProgressColor(
  dominantRgb: [number, number, number],
  palette: Array<[number, number, number]>
): [number, number, number] {
  const [h, s, l] = rgbToHsl(...dominantRgb);

  // If dominant is dark, progress should be light and vibrant
  if (l < 0.5) {
    // Find the lightest color in palette
    let lightest = palette[0];
    let maxLightness = 0;

    for (const color of palette) {
      const [_, _s, colorL] = rgbToHsl(...color);
      if (colorL > maxLightness) {
        maxLightness = colorL;
        lightest = color;
      }
    }

    // Boost saturation if needed
    const [lightH, lightS, lightL] = rgbToHsl(...lightest);
    return hslToRgb(
      lightH,
      Math.min(1, lightS * 1.3),
      Math.min(0.95, lightL * 1.1)
    );
  }
  // If dominant is light, progress should be dark and rich
  else {
    // Find the darkest color in palette
    let darkest = palette[0];
    let minLightness = 1;

    for (const color of palette) {
      const [_, _s, colorL] = rgbToHsl(...color);
      if (colorL < minLightness) {
        minLightness = colorL;
        darkest = color;
      }
    }

    // Boost saturation if needed
    const [darkH, darkS, darkL] = rgbToHsl(...darkest);
    return hslToRgb(
      darkH,
      Math.min(1, darkS * 1.5),
      Math.max(0.15, darkL * 0.8)
    );
  }
}

/**
 * Get domain color - lightest shade if dominant is dark, darkest if dominant is light
 */
function getDomainColor(
  dominantRgb: [number, number, number],
  palette: Array<[number, number, number]>
): [number, number, number] {
  const [h, s, l] = rgbToHsl(...dominantRgb);

  if (l < 0.5) {
    // Find lightest color in palette
    return palette.reduce((lightest, color) => {
      const [colorH, colorS, colorL] = rgbToHsl(...color);
      const [lightestH, lightestS, lightestL] = rgbToHsl(...lightest);
      return colorL > lightestL ? color : lightest;
    });
  } else {
    // Find darkest color in palette
    return palette.reduce((darkest, color) => {
      const [colorH, colorS, colorL] = rgbToHsl(...color);
      const [darkestH, darkestS, darkestL] = rgbToHsl(...darkest);
      return colorL < darkestL ? color : darkest;
    });
  }
}

/**
 * Get complementary color
 */
function getComplementary(
  rgb: [number, number, number]
): [number, number, number] {
  const [h, s, l] = rgbToHsl(...rgb);
  const complementaryHue = (h + 180) % 360;
  return hslToRgb(complementaryHue, s, l);
}

export async function getGradientColorsFromImage(imageUrl: string): Promise<{
  backgroundColor: string;
  progressColor: string;
  domainColor: string;
}> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = imageUrl + "?" + Date.now();

    img.onload = () => {
      try {
        const colorThief = new ColorThief();
        const palette = colorThief.getPalette(img, 8) as Array<
          [number, number, number]
        >;
        const dominantColor = palette[0];

        const backgroundColor = createGradient(dominantColor);
        const domainColor = getDomainColor(dominantColor, palette);
        const progressColor = createGradient(domainColor);

        resolve({
          backgroundColor,
          progressColor,
          domainColor: `rgb(${domainColor.join(",")})`,
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
