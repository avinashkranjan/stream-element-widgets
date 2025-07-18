"use client";

import { useState } from "react";
import axios from "axios";
import WidgetPreview from "@/components/widget-preview";

const TYPES = [
  { id: "minimal", name: "Minimal" },
  { id: "classic", name: "Classic" },
  { id: "banner", name: "Banner" },
  { id: "banner-glass", name: "Banner Glass" },
  { id: "immersive", name: "Immersive" },
];

export default function CreatePage() {
  const [selected, setSelected] = useState("classic");
  const [link, setLink] = useState<string | null>(null);

  const createWidget = async () => {
    const res = await axios.post("/api/widget/create", { type: selected });
    setLink(res.data.redirectUrl);
    window.location.href = res.data.redirectUrl;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center px-4">
      <div className="flex flex-col items-center w-full max-w-4xl py-12">
        <h1 className="text-3xl font-bold mb-4">Choose Your Spotify Widget</h1>

        {/* Selector */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-8">
          {TYPES.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelected(t.id)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                selected === t.id
                  ? "bg-green-600"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>

        <div className="mb-8 w-full">
          <h2 className="text-xl font-semibold mb-3 text-center">
            Live Preview
          </h2>
          <div className="flex justify-center">
            <WidgetPreview type={selected} />
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={createWidget}
          className="bg-blue-600 px-6 py-3 rounded hover:bg-blue-700 text-lg font-semibold"
        >
          Create {TYPES.find((t) => t.id === selected)?.name} Widget
        </button>

        {/* Redirect Fallback */}
        {link && (
          <p className="mt-4 break-all text-sm text-gray-400 text-center max-w-md">
            If you’re not redirected automatically, open: <br />
            <a href={link} className="text-blue-400 underline">
              {link}
            </a>
          </p>
        )}
      </div>
    </div>
  );
}
