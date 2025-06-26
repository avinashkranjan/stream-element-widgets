let lastTrack = "";
let progress = 0;
let duration = 220;

// DOM elements
const trackElem = document.getElementById("title");
const artistElem = document.getElementById("artist");
const coverImg = document.getElementById("cover");
const albumElem = document.getElementById("album");
const currentElem = document.getElementById("current");
const durationElem = document.getElementById("duration");
const progressBar = document.getElementById("bar");

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
  currentElem.textContent = formatTime(progress);
}

function formatTime(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min}:${sec.toString().padStart(2, "0")}`;
}

function parseTimeToSeconds(timeStr) {
  const [min, sec] = timeStr.split(":").map(Number);
  return min * 60 + sec;
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

function setGlassGradient() {
  const glassElem = document.querySelector(".glass");
  if (!window.ColorThief || !coverImg.complete || !glassElem) return;
  try {
    const colorThief = new ColorThief();
    if (coverImg.naturalWidth > 0 && coverImg.naturalHeight > 0) {
      const dominant = colorThief.getColor(coverImg);
      const accent = `rgb(${dominant[0]}, ${dominant[1]}, ${dominant[2]})`;
      const accentTransparent = `rgba(${dominant[0]}, ${dominant[1]}, ${dominant[2]}, 0)`;
      glassElem.style.background = `linear-gradient(to bottom, ${accent}, ${accentTransparent})`;
    }
  } catch (e) {
    console.error("Error setting gradient:", e);
    glassElem.style.background = `linear-gradient(to bottom, rgb(183, 218, 255), rgba(0, 123, 255, 0))`;
  }
}

// Update gradient when cover loads
coverImg.addEventListener("load", setGlassGradient);

// Refresh data and update progress
setInterval(fetchSnipData, 2000);
setInterval(updateProgress, 1000);
