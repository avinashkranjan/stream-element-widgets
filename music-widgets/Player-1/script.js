const trackElem = document.getElementById("track");
const artistElem = document.getElementById("artist");
const progressBar = document.getElementById("progress-bar");

let lastTrack = "";
let progress = 0;
const duration = 210; // Assume 3:30

function fetchSnipData() {
  fetch("Snip.txt")
    .then((res) => res.text())
    .then((data) => {
      const lines = data.split("\n");
      let track = "",
        artist = "";

      lines.forEach((line) => {
        if (line.startsWith("Track:"))
          track = line.replace("Track: ", "").trim();
        if (line.startsWith("Artist:"))
          artist = line.replace("Artist: ", "").trim();
      });

      if (track && track !== lastTrack) {
        progress = 0;
        updateInfo(track, artist);
        lastTrack = track;
      }
    });
}

function updateInfo(track, artist) {
  trackElem.textContent = track;
  artistElem.textContent = artist;
}

function updateProgress() {
  if (progress < duration) progress++;
  const percent = (progress / duration) * 100;
  progressBar.style.width = `${percent}%`;
}

setInterval(fetchSnipData, 2000);
setInterval(updateProgress, 1000);
