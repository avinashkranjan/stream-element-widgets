let lastTrack = "";
let progress = 0;
let duration = 200; // fallback default duration

// DOM elements
const titleElem = document.getElementById("title");
const artistElem = document.getElementById("artist");
const coverElem = document.getElementById("cover");
const currentElem = document.getElementById("current");
const durationElem = document.getElementById("duration");
const progressBar = document.getElementById("bar");

function fetchSnipData() {
  fetch("Snip.txt")
    .then((res) => res.text())
    .then((data) => {
      const lines = data.split("\n");
      let track = "",
        artist = "",
        cover = "",
        length = "";

      lines.forEach((line) => {
        if (line.startsWith("Track:"))
          track = line.replace("Track: ", "").trim();
        if (line.startsWith("Artist:"))
          artist = line.replace("Artist: ", "").trim();
        if (line.startsWith("Cover:"))
          cover = line.replace("Cover: ", "").trim();
        if (line.startsWith("Length:"))
          length = line.replace("Length: ", "").trim();
      });

      if (track && track !== lastTrack) {
        lastTrack = track;
        progress = 0;
        duration = parseTimeToSeconds(length || "3:00");
        updateWidget(track, artist, cover);
      }
    })
    .catch((err) => console.error("Error fetching Snip.txt:", err));
}

function updateWidget(track, artist, cover) {
  titleElem.textContent = track;
  artistElem.textContent = artist;
  if (cover) {
    coverElem.crossOrigin = "Anonymous";
    coverElem.src = cover;
  }
  durationElem.textContent = formatTime(duration);
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

function setGlassGradient() {
  const glassElem = document.querySelector('.glass');
  if (!window.ColorThief || !coverElem.complete || !glassElem) return;
  try {
    const colorThief = new ColorThief();
    if (coverElem.naturalWidth > 0 && coverElem.naturalHeight > 0) {
      const dominant = colorThief.getColor(coverElem);
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
coverElem.addEventListener('load', setGlassGradient);

// Refresh data and update progress
setInterval(fetchSnipData, 2000);
setInterval(updateProgress, 1000);
