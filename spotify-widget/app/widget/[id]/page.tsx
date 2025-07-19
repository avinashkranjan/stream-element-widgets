"use client";

import { useEffect, useRef, useState } from "react";
import ColorThief from "colorthief";
import MinimalWidget from "@/components/widget-types/minimal";
import ClassicWidget from "@/components/widget-types/classic";
import BannerWidget from "@/components/widget-types/banner";
import BannerGlassWidget from "@/components/widget-types/banner-glass";
import ImmersiveWidget from "@/components/widget-types/immersive";
import { useParams, useRouter } from "next/navigation";

export default function Widget() {
  const params = useParams();
  const { id } = params;
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const [data, setData] = useState<any>(null);
  const [type, setType] = useState<
    "minimal" | "classic" | "banner" | "banner-glass" | "immersive"
  >("classic");
  const [bg, setBg] = useState("rgb(30,30,30)");
  const [error, setError] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!id || id === "null") {
      router.push("/create");
    }
  }, [id, router]);

  const fetchMeta = async () => {
    try {
      const meta = await fetch(`/api/widget/meta?id=${id}`).then((r) =>
        r.json()
      );
      setType(meta.type);
    } catch (err) {
      console.error("Error fetching widget meta:", err);
      setError("Failed to load widget metadata. Please try again.");
    }
  };

  const fetchNow = async () => {
    try {
      const res = await fetch(`/api/spotify/now-playing?id=${id}`);
      const json = await res.json();

      if (res.status === 401 || json?.error?.status === 401) {
        setError("Spotify access token expired. Please reconnect.");
        return;
      }

      setData(json.item ? json : null);
    } catch (err) {
      console.error("Error fetching now playing:", err);
      setError("Something went wrong while fetching your Spotify data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeta();
    fetchNow();
    const iv = setInterval(fetchNow, 5000);
    return () => clearInterval(iv);
  }, [id]);

  useEffect(() => {
    if (imgRef.current && imgRef.current.complete) {
      try {
        const ct = new ColorThief();
        const [r, g, b] = ct.getColor(imgRef.current);
        setBg(`rgb(${r},${g},${b})`);
      } catch (e) {
        console.warn("ColorThief failed", e);
      }
    }
  }, [data]);

  const renderByType = () => {
    if (loading)
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1e1e2f] to-[#121212]">
          <div className="w-12 h-12 border-4 border-white border-dashed rounded-full animate-spin"></div>
        </div>
      );

    if (error) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1e1e2f] to-[#121212] font-sans px-4">
          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl shadow-xl px-8 py-10  text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 mx-auto mb-2 text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18.364 5.636l-12.728 12.728m0-12.728l12.728 12.728"
              />
            </svg>
            <h2 className="text-white text-xl font-semibold mb-2">Error</h2>
            <p className="text-red-400 text-sm mb-4">{error}</p>
            <button
              onClick={() => router.push("/")}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition cursor-pointer"
            >
              Go to Login
            </button>
          </div>
        </div>
      );
    }

    if (!data) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1e1e2f] to-[#121212] font-sans px-4">
          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl shadow-xl px-8 py-10 max-w-sm text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 mx-auto mb-2 text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.75 9.75h4.5m-2.25 4.5h.008M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h2 className="text-white text-xl font-semibold mb-2">
              Nothing Playing Right Now
            </h2>
            <p className="text-gray-400 text-sm">
              We couldn’t detect any music. Start playing a song on Spotify to
              see it appear here.
            </p>
          </div>
        </div>
      );
    }

    const { item, is_playing, progress_ms } = data;
    const dur = item.duration_ms;
    const pct = (progress_ms / dur) * 100;
    const Artist = item.artists.map((a: any) => a.name).join(", ");

    switch (type) {
      case "minimal":
        return (
          <MinimalWidget
            trackName={item.name}
            artistName={Artist?.split(",")[0]}
            coverImage={item.album.images[0].url}
            isPlaying={is_playing}
            progress={pct}
            isPreview={false}
          />
        );
      case "classic":
        return (
          <ClassicWidget
            trackName={item.name}
            artistName={Artist?.split(",")[0]}
            isPlaying={is_playing}
            isPreview={false}
            progress={pct}
            coverImage={item.album.images[0].url}
          />
        );
      case "banner":
        return (
          <BannerWidget
            trackName={item.name}
            artistName={Artist?.split(",")[0]}
            isPlaying={is_playing}
            isPreview={false}
            progress={pct}
            coverImage={item.album.images[0].url}
            currentTime={progress_ms}
            duration={item.duration_ms}
          />
        );
      case "banner-glass":
        return (
          <BannerGlassWidget
            trackName={item.name}
            artistName={Artist?.split(",")[0]}
            isPlaying={is_playing}
            isPreview={false}
            progress={pct}
            coverImage={item.album.images[0].url}
            currentTime={progress_ms}
            duration={item.duration_ms}
          />
        );
      case "immersive":
        return (
          <ImmersiveWidget
            trackName={item.name}
            artistName={Artist?.split(",")[0]}
            isPlaying={is_playing}
            isPreview={false}
            coverImage={item.album.images[0].url}
            currentTime={progress_ms}
            duration={item.duration_ms}
          />
        );
    }
  };

  return <div className="rounded-lg overflow-hidden">{renderByType()}</div>;
}
