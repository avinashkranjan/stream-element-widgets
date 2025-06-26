const trackElem = document.getElementById("track");
const artistElem = document.getElementById("artist");
const albumElem = document.getElementById("album"); // 👈 Add this in HTML too
const progressBar = document.getElementById("progress-bar");

let lastTrack = "";
let progress = 0;
const duration = 210; // 3:30 in seconds

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
          updateInfo(track, artist, album);
          lastTrack = track;
        }
      }
    })
    .catch((err) => console.error("Error reading Snip.txt:", err));
}

function updateInfo(track, artist, album) {
  if (trackElem) trackElem.textContent = track;
  if (artistElem) artistElem.textContent = artist;
  if (albumElem) albumElem.textContent = album;
}

function updateProgress() {
  if (progress < duration) progress++;
  const percent = (progress / duration) * 100;
  if (progressBar) progressBar.style.width = `${percent}%`;
}

setInterval(fetchSnipData, 2000);
setInterval(updateProgress, 1000);
