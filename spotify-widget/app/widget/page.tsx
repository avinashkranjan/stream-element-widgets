"use client";
import { useState, useEffect } from "react";

export default function Widget() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchNow = async () => {
      const res = await fetch("/api/spotify/now-playing");
      const j = await res.json();
      setData(j?.item ? j : null);
    };
    fetchNow();
    const iv = setInterval(fetchNow, 5000);
    return () => clearInterval(iv);
  }, []);

  if (!data)
    return <div style={{ color: "#fff" }}>Connect and play Spotify</div>;

  const { item, is_playing, progress_ms } = data;
  const dur = item.duration_ms;

  const format = (ms: number) => {
    const m = Math.floor(ms / 60000),
      s = ((ms % 60000) / 1000).toFixed(0).padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="widget">
      <div className="info">
        <h1>{item.name}</h1>
        <p>{item.artists.map((a: any) => a.name).join(", ")}</p>
      </div>
      <div className="controls">
        <span>{is_playing ? "⏸" : "▶"}</span>
        <span>{format(progress_ms)}</span>
        <div className="progress-wrapper">
          <div
            className="progress-bar"
            style={{ width: `${(progress_ms / dur) * 100}%` }}
          />
        </div>
        <span>{format(dur)}</span>
      </div>
      <img src={item.album.images[0].url} className="cover" />
      <style jsx>{`
        .widget {
          background: #e7e6f0;
          border-radius: 24px;
          width: 320px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          font-family: "Segoe UI";
        }
        .info h1 {
          font-size: 18px;
          margin: 0;
          text-align: center;
        }
        .info p {
          font-size: 14px;
          margin: 4px 0;
          opacity: 0.7;
        }
        .controls {
          display: flex;
          align-items: center;
          width: 80%;
          gap: 8px;
          margin: 12px 0;
        }
        .progress-wrapper {
          flex: 1;
          height: 6px;
          background: #f1f1f1;
          border-radius: 4px;
          overflow: hidden;
        }
        .progress-bar {
          height: 100%;
          background: linear-gradient(to right, #1f1b42, #f5eeb2);
          transition: width 0.5s ease;
        }
        .cover {
          width: 100%;
          border-radius: 20px;
          object-fit: cover;
        }
      `}</style>
    </div>
  );
}
