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
  if (cover) coverElem.src = cover;
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

// Refresh data and update progress
setInterval(fetchSnipData, 2000);
setInterval(updateProgress, 1000);
