"use client";

import { useEffect, useRef, useState } from "react";
import ColorThief from "colorthief";
import MinimalWidget from "@/components/widget-types/minimal";
import ClassicWidget from "@/components/widget-types/classic";
import BannerWidget from "@/components/widget-types/banner";
import BannerGlassWidget from "@/components/widget-types/banner-glass";
import ImmersiveWidget from "@/components/widget-types/immersive";
import { redirect } from "next/navigation";

interface WidgetPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function Widget({ params }: WidgetPageProps) {
  const { id } = await params;

  if (!id) {
    redirect("/create");
  }

  const [data, setData] = useState<any>(null);
  const [type, setType] = useState<
    "minimal" | "classic" | "banner" | "banner-glass" | "immersive"
  >("classic");

  const [bg, setBg] = useState("rgb(30,30,30)");
  const imgRef = useRef<HTMLImageElement>(null);

  const fetchMeta = async () => {
    const meta = await fetch(`/api/widget/meta?id=${id}`).then((r) => r.json());
    setType(meta.type);
  };

  const fetchNow = async () => {
    const res = await fetch(`/api/spotify/now-playing?id=${id}`);
    const json = await res.json();
    setData(json.item ? json : null);
  };

  useEffect(() => {
    fetchMeta();
    fetchNow();
    const iv = setInterval(fetchNow, 5000);
    return () => clearInterval(iv);
  }, [id]); // Add id as dependency

  const renderByType = () => {
    if (!data)
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
              No Data Available
            </h2>
            <p className="text-gray-400 text-sm">
              We're not receiving any data at the moment. Please try again later
              or check your connection.
            </p>
          </div>
        </div>
      );
    const { item, is_playing, progress_ms } = data;
    const dur = item.duration_ms;
    const pct = (progress_ms / dur) * 100;

    const Artist = item.artists.map((a: any) => a.name).join(", ");
    const Cover = (
      <img
        ref={imgRef}
        crossOrigin="anonymous"
        src={item.album.images[0].url}
        alt="cover"
      />
    );

    switch (
      type as
        | string
        | "classic"
        | "banner"
        | "banner-glass"
        | "minimal"
        | "immersive"
    ) {
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

  useEffect(() => {
    if (imgRef.current && imgRef.current.complete) {
      const ct = new ColorThief();
      const [r, g, b] = ct.getColor(imgRef.current);
      setBg(`rgb(${r},${g},${b})`);
    }
    console.log("Background color set to:", bg);
  }, [data, bg]);

  return (
    <div className="rounded-lg overflow-hidden" style={{ backgroundColor: bg }}>
      {renderByType()}
    </div>
  );
}
