const trackElem = document.getElementById("track");
const artistElem = document.getElementById("artist");
const progressBar = document.getElementById("progress-bar");
const coverImg = document.getElementById("cover");
const albumElem = document.getElementById("album");
const currentTimeElem = document.getElementById("current-time");
const totalTimeElem = document.getElementById("total-time");
const knob = document.getElementById("progress-knob");

let lastTrack = "";
let progress = 0; // seconds
const duration = 220; // 3:40 in seconds
const fullLength = 420;

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
  const offset = fullLength - (fullLength * percent) / 100;
  progressBar.setAttribute("stroke-dashoffset", offset);

  const t = percent / 100;
  const pos = getQuadraticBezierXY(t, 30, 130, 150, 20, 270, 130);
  knob.setAttribute("cx", pos.x);
  knob.setAttribute("cy", pos.y);

  currentTimeElem.textContent = formatTime(progress);
  totalTimeElem.textContent = formatTime(duration);
}

function formatTime(sec) {
  const min = Math.floor(sec / 60);
  const s = sec % 60;
  return `${min}:${s.toString().padStart(2, "0")}`;
}

function getQuadraticBezierXY(t, sx, sy, cx, cy, ex, ey) {
  const x = (1 - t) ** 2 * sx + 2 * (1 - t) * t * cx + t ** 2 * ex;
  const y = (1 - t) ** 2 * sy + 2 * (1 - t) * t * cy + t ** 2 * ey;
  return { x, y };
}

setInterval(fetchSnipData, 2000);
setInterval(updateProgress, 1000);
