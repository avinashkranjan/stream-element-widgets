// app/page.tsx
import { getSpotifyAuthURL } from "@/lib/spotify";

export default function Home() {
  return (
    <main className="flex flex-col justify-center items-center h-screen bg-black text-white">
      <h1 className="text-4xl mb-6 font-bold">Spotify OBS Widget</h1>
      <a
        href={getSpotifyAuthURL()}
        className="bg-green-500 px-6 py-3 rounded font-semibold text-lg hover:bg-green-600 transition"
      >
        Connect with Spotify
      </a>
    </main>
  );
}
