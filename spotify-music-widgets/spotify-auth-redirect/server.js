require("dotenv").config();
const express = require("express");
const axios = require("axios");
const path = require("path");
const open = require("open");
const app = express();
const port = 4000;

const scopes = [
  "user-read-playback-state",
  "user-read-currently-playing",
  "user-read-private",
  "user-read-email",
];

app.use(express.static("public"));

app.get("/", (req, res) => {
  const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${
    process.env.CLIENT_ID
  }&scope=${encodeURIComponent(
    scopes.join(" ")
  )}&redirect_uri=${encodeURIComponent(process.env.REDIRECT_URI)}`;
  res.redirect(authUrl);
});

// 🚩 Spotify Redirect URI
app.get("/callback", async (req, res) => {
  const code = req.query.code;
  if (!code) return res.send("No code provided.");

  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: process.env.REDIRECT_URI,
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const { access_token, refresh_token } = response.data;

    // ✅ Save tokens or use them as needed
    res.redirect(
      `/success.html?access_token=${access_token}&refresh_token=${refresh_token}`
    );
  } catch (err) {
    console.error(
      "Error exchanging code for token:",
      err.response?.data || err
    );
    res.status(500).send("Authentication failed.");
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
