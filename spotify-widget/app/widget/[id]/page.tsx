"use client";

import { useEffect, useRef, useState } from "react";
import ColorThief from "colorthief";

export default function Widget({ params: { id } }: { params: { id: string } }) {
  const [data, setData] = useState<any>(null);
  const [type, setType] = useState<
    "classic" | "minimal" | "compact" | "banner" | "stats"
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
  }, []);

  const renderByType = () => {
    if (!data)
      return <div className="text-white text-center p-4">Nothing Playing</div>;
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

    switch (type) {
      case "minimal":
        return (
          <div className="p-4">
            <p>{item.name}</p>
            <p>{Artist}</p>
          </div>
        );
      case "compact":
        return <div className="p-2 w-24 h-24">{Cover}</div>;
      case "banner":
        return (
          <div className="flex items-center space-x-4 p-4">
            <div className="w-20 h-20">{Cover}</div>
            <div>
              <p>{item.name}</p>
              <p>{Artist}</p>
            </div>
          </div>
        );
      case "stats":
        return (
          <div className="p-4">
            <p>
              {item.name} – {Artist}
            </p>
            <p>Duration: {(dur / 1000).toFixed(0)}s</p>
          </div>
        );
      default:
        return (
          <div className="p-4 flex space-x-4">
            <div className="w-24 h-24">{Cover}</div>
            <div className="flex-1">
              <p className="font-bold">{item.name}</p>
              <p>{Artist}</p>
              <div className="w-full bg-white/30 h-1 rounded">
                <div className="bg-white h-full" style={{ width: `${pct}%` }} />
              </div>
            </div>
          </div>
        );
    }
  };

  useEffect(() => {
    if (imgRef.current && imgRef.current.complete) {
      const ct = new ColorThief();
      const [r, g, b] = ct.getColor(imgRef.current);
      setBg(`rgb(${r},${g},${b})`);
    }
  }, [data]);

  return (
    <div className="rounded-lg overflow-hidden" style={{ backgroundColor: bg }}>
      {renderByType()}
    </div>
  );
}
