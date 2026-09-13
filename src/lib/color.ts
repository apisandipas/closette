export const colorFamilies = [
  "black",
  "white",
  "grey",
  "brown",
  "beige",
  "red",
  "orange",
  "yellow",
  "green",
  "blue",
  "purple",
  "pink",
] as const;

export type ColorFamily = (typeof colorFamilies)[number];

function hexToHsl(hex: string): [h: number, s: number, l: number] {
  const n = parseInt(hex.slice(1), 16);
  const r = ((n >> 16) & 255) / 255;
  const g = ((n >> 8) & 255) / 255;
  const b = (n & 255) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  if (d === 0) return [0, 0, l];
  const s = d / (1 - Math.abs(2 * l - 1));
  let h =
    max === r
      ? ((g - b) / d) % 6
      : max === g
        ? (b - r) / d + 2
        : (r - g) / d + 4;
  h = (h * 60 + 360) % 360;
  return [h, s, l];
}

// Neutrals first (they have no useful hue), then hue bins. Brown is carved out
// of the warm bins by lightness and saturation; beige by lightness and chroma
// (HSL saturation is unreliable near white, so use the raw channel spread).
export function hexToFamily(hex: string): ColorFamily | null {
  if (!/^#[0-9a-fA-F]{6}$/.test(hex)) return null;
  const [h, s, l] = hexToHsl(hex);
  const chroma = s * (1 - Math.abs(2 * l - 1));

  if (l < 0.12) return "black";
  if (l > 0.92 && s < 0.2) return "white";
  if (s < 0.12) return "grey";

  const warm = h < 60 || h >= 340;
  if (warm && l < 0.4 && s < 0.7) return "brown";
  if (h >= 20 && h < 70 && l > 0.7 && chroma < 0.3) return "beige";

  if (h < 15 || h >= 340) return "red";
  if (h < 45) return "orange";
  if (h < 70) return "yellow";
  if (h < 170) return "green";
  if (h < 260) return "blue";
  if (h < 300) return "purple";
  return "pink";
}
