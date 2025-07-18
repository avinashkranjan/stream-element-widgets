export default function LoginPage() {
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

  return (
    <a href={`https://accounts.spotify.com/authorize?${params}`}>
      Connect with Spotify
    </a>
  );
}
