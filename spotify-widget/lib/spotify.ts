export function getSpotifyAuthURL() {
  const scopes = [
    "user-read-playback-state",
    "user-read-currently-playing",
  ].join(" ");

  console.log("ENV:", {
    SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
    SPOTIFY_REDIRECT_URI: process.env.SPOTIFY_REDIRECT_URI,
  });
  const params = new URLSearchParams({
    client_id: process.env.SPOTIFY_CLIENT_ID!,
    response_type: "code",
    redirect_uri: process.env.SPOTIFY_REDIRECT_URI!,
    scope: scopes,
  });

  console.log("Spotify Auth URL Params:", params.toString());
  return `https://accounts.spotify.com/authorize?${params}`;
}
