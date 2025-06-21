const trackElem = document.getElementById("track");
const artistElem = document.getElementById("artist");
const progressBar = document.getElementById("progress-bar");
const coverImg = document.getElementById("cover");

let lastTrack = "";
let progress = 0;
const duration = 220;

function fetchSnipData() {
  fetch("Snip.txt")
    .then((res) => res.text())
    .then((data) => {
      const lines = data.split("\n");
      let track = "",
        artist = "",
        album = "",
        coverUrl = "";

      lines.forEach((line) => {
        if (line.startsWith("Track:"))
          track = line.replace("Track: ", "").trim();
        if (line.startsWith("Artist:"))
          artist = line.replace("Artist: ", "").trim();
        if (line.startsWith("Album:"))
          album = line.replace("Album: ", "").trim();
        if (line.startsWith("Cover:"))
          coverUrl = line.replace("Cover: ", "").trim();
      });

      if (track && track !== lastTrack) {
        progress = 0;
        updateInfo(track, artist, coverUrl);
        lastTrack = track;
      }
    });
}

function updateInfo(track, artist, cover) {
  trackElem.textContent = track;
  artistElem.textContent = artist;
  if (cover) {
    coverImg.crossOrigin = "Anonymous";
    coverImg.src = cover;
  }
}

function updateProgress() {
  if (progress < duration) progress++;
  const percent = (progress / duration) * 100;
  progressBar.style.width = `${percent}%`;
}

// Helper: Convert RGB to HSL
function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return [h * 360, s, l];
}

// Helper: Convert HSL to RGB
function hslToRgb(h, s, l) {
  h /= 360;
  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

// Helper: Make color pastel
function pastelize(rgb) {
  let [h, s, l] = rgbToHsl(rgb[0], rgb[1], rgb[2]);
  s = 0.3; // lower saturation for pastel
  l = 0.85; // high lightness for pastel
  return hslToRgb(h, s, l);
}

function darken(rgb, amount = 0.1) {
  let [h, s, l] = rgbToHsl(rgb[0], rgb[1], rgb[2]);
  l = Math.max(0, l - amount); // decrease lightness
  return hslToRgb(h, s, l);
}

function brighten(rgb, amount = 0.8) {
  let [h, s, l] = rgbToHsl(rgb[0], rgb[1], rgb[2]);
  l = Math.min(1, l + amount); // increase lightness
  return hslToRgb(h, s, l);
}

function setPlayerGradient() {
  const playerElem = document.querySelector('.player');
  if (!window.ColorThief || !coverImg.complete) return;
  try {
    const colorThief = new ColorThief();
    if (coverImg.naturalWidth && coverImg.naturalHeight) {
      const dominant = colorThief.getColor(coverImg);
      const light = pastelize(dominant); // lighter version
      const accent = brighten(dominant, 0.4); // brighter version of detected color
      const color1 = `rgb(${light[0]}, ${light[1]}, ${light[2]})`;
      const color2 = `rgb(${accent[0]}, ${accent[1]}, ${accent[2]})`;
      playerElem.style.background = `linear-gradient(90deg, ${color1}, ${color2})`;
    }
  } catch (e) {
    playerElem.style.background = '#e7e6f0';
  }
}

// Update gradient when cover loads
coverImg.addEventListener('load', setPlayerGradient);

setInterval(fetchSnipData, 2000);
setInterval(updateProgress, 1000);
