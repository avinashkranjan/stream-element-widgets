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
  if (cover) coverImg.src = cover;
}

function updateProgress() {
  if (progress < duration) progress++;
  const percent = (progress / duration) * 100;
  progressBar.style.width = `${percent}%`;
}

setInterval(fetchSnipData, 2000);
setInterval(updateProgress, 1000);
