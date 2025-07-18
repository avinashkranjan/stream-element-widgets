export function getSpotifyAuthURL() {
  const scopes = [
    "user-read-playback-state",
    "user-read-currently-playing",
  ].join(" ");

  const params = new URLSearchParams({
    client_id: process.env.SPOTIFY_CLIENT_ID!,
    response_type: "code",
    redirect_uri: process.env.SPOTIFY_REDIRECT_URI!,
    scope: scopes,
  });

  return `https://accounts.spotify.com/authorize?${params}`;
}
