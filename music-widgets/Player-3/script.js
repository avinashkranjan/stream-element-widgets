const trackElem = document.getElementById("track");
const artistElem = document.getElementById("artist");
const albumElem = document.getElementById("album");
const progressBar = document.getElementById("progress-bar");
const coverImg = document.getElementById("cover");
const currentTimeElem = document.getElementById("current-time");
const totalTimeElem = document.getElementById("total-time");

let lastTrack = "";
let progress = 0;
const duration = 220; // 3:40

function fetchSnipData() {
  fetch("../Snip.txt")
    .then((res) => res.text())
    .then((data) => {
      console.log(data);
      const line = data.trim();
      const match = line.match(/“(.+?)”\s*―\s*(.+?)(?:,\s*(.+))?$/);

      if (match) {
        const [_, track, artist, album] = match;

        if (track !== lastTrack) {
          progress = 0;
          const coverUrl = "../Snip_Artwork.jpg";
          updateInfo(track, artist, album, coverUrl);
          lastTrack = track;
        }
      }
    })
    .catch((err) => console.error("Error reading Snip.txt:", err));
}

function updateInfo(track, artist, album, coverUrl) {
  if (trackElem) trackElem.textContent = track;
  if (artistElem) artistElem.textContent = artist;
  if (albumElem) albumElem.textContent = album;
  if (coverImg && coverUrl) {
    coverImg.crossOrigin = "Anonymous";
    coverImg.src = coverUrl;
  }
}

function updateProgress() {
  if (progress < duration) progress++;
  const percent = (progress / duration) * 100;
  progressBar.style.width = `${percent}%`;

  currentTimeElem.textContent = formatTime(progress);
  totalTimeElem.textContent = formatTime(duration);
}

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// Helper: Convert RGB to HSL
function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h,
    s,
    l = (max + min) / 2;
  if (max === min) {
    h = s = 0;
  } else {
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
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
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
  const playerElem = document.querySelector(".widget");
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
    playerElem.style.background = "#e7e6f0";
  }
}

// Update gradient when cover loads
coverImg.addEventListener("load", setPlayerGradient);

setInterval(fetchSnipData, 2000);
setInterval(updateProgress, 1000);
