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
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const createWidget = async () => {
    try {
      setLoading(true);
      const res = await axios.post("/api/widget/create", { type: selected });
      setLink(
        `${process.env.NEXT_PUBLIC_BASE_URL}/widget/${res.data.widgetId}`
      );
      window.open(res.data.redirectUrl, "_blank");
    } catch (err) {
      console.error("Failed to create widget", err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (link) {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center px-4">
      <div className="flex flex-col items-center w-full max-w-4xl py-12">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Choose Your Spotify Widget
        </h1>

        {/* Widget Type Selector */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-8">
          {TYPES.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setSelected(t.id);
                setLink(null);
                setCopied(false);
              }}
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

        {/* Live Preview */}
        <div className="mb-8 w-full">
          <h2 className="text-xl font-semibold mb-3 text-center">
            Live Preview
          </h2>
          <div className="flex justify-center">
            <WidgetPreview type={selected} />
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={createWidget}
          disabled={loading}
          className="bg-blue-600 px-6 py-3 rounded hover:bg-blue-700 text-lg font-semibold cursor-pointer transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading
            ? "Creating..."
            : `Create ${TYPES.find((t) => t.id === selected)?.name} Widget`}
        </button>

        {/* Redirect Fallback / Copy UI */}
        {link && (
          <div className="mt-6 w-full max-w-xl bg-gray-800 p-4 rounded-lg text-center">
            <p className="mb-2 text-sm text-gray-400">Your Widget Link:</p>
            <div className="bg-gray-900 p-2 px-3 rounded flex items-center justify-between gap-2">
              <a
                href={link}
                className="text-blue-400 break-all text-sm underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {link}
              </a>
              <div className="flex items-center gap-2">
                <button
                  onClick={copyToClipboard}
                  className="bg-blue-600 hover:bg-blue-700 text-sm px-3 py-1 rounded cursor-pointer transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
                <button
                  onClick={() => window.open(link, "_blank")}
                  className="bg-blue-600 hover:bg-blue-700 text-sm px-3 py-1 rounded cursor-pointer transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Preview Link
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
