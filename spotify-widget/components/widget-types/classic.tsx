import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { getGradientColorsFromImage } from "@/lib/colorthief";

interface ClassicWidgetProps {
  trackName: string;
  artistName: string;
  coverImage: string;
  isPlaying: boolean;
  isPreview?: boolean;
  progress: number;
}

const ClassicWidget: React.FC<ClassicWidgetProps> = ({
  trackName = "Track Name",
  artistName = "Artist Name",
  coverImage,
  isPlaying = false,
  isPreview = false,
  progress = 65,
}) => {
  const [colors, setColors] = useState({
    backgroundColor: "#eee",
    progressColor: "#aaa",
  });

  useEffect(() => {
    getGradientColorsFromImage(coverImage)
      .then((result) => setColors(result))
      .catch(console.error);
  }, [coverImage]);

  const PlayIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 24 24"
      className="w-6 h-6"
    >
      <path
        fillRule="evenodd"
        d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z"
        clipRule="evenodd"
      />
    </svg>
  );

  const PauseIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 24 24"
      className="w-6 h-6"
    >
      <path
        fillRule="evenodd"
        d="M6.75 5.25a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H7.5a.75.75 0 0 1-.75-.75V5.25Zm7.5 0A.75.75 0 0 1 15 4.5h1.5a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H15a.75.75 0 0 1-.75-.75V5.25Z"
        clipRule="evenodd"
      />
    </svg>
  );

  return (
    <div
      className={`${
        isPreview ? "" : "min-h-screen"
      } flex justify-center items-center  bg-transparent font-sans`}
    >
      <div
        className={`flex items-center rounded-xl pr-8 gap-3 text-gray-800 shadow-lg bg-gradient-to-r`}
        style={{ background: colors.backgroundColor }}
      >
        {/* Album Cover */}
        <div className="relative w-18 h-18">
          {coverImage ? (
            <Image
              src={coverImage}
              alt="Album cover"
              width={72}
              height={72}
              className="rounded-xl object-cover"
              style={{
                WebkitMaskImage:
                  "linear-gradient(to right, rgba(0,0,0,1) 40%, rgba(0,0,0,0.8) 60%, rgba(0,0,0,0.3) 80%, rgba(0,0,0,0) 100%)",
                maskImage:
                  "linear-gradient(to right, rgba(0,0,0,1) 40%, rgba(0,0,0,0.8) 60%, rgba(0,0,0,0.3) 80%, rgba(0,0,0,0) 100%)",
              }}
            />
          ) : (
            <div className="w-18 h-18 bg-gray-300 rounded-xl flex items-center justify-center">
              <span className="text-gray-500 text-xs">No Cover</span>
            </div>
          )}
        </div>

        {/* Play/Pause Button */}
        <div className="text-gray-700">
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </div>

        {/* Track Info */}
        <div className="flex flex-col justify-center min-w-[200px]">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
            <span className="font-semibold truncate max-w-[120px]">
              {trackName}
            </span>
            <span className="text-gray-900">•</span>
            <span className="opacity-80 truncate max-w-[120px]">
              {artistName}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="mt-2 bg-black/30 bg-opacity-60 rounded h-1.5 w-full overflow-hidden">
            <div
              className={`h-full transition-all duration-700 ease-out bg-gradient-to-r`}
              style={{
                width: `${Math.min(100, Math.max(0, progress))}%`,
                background: colors.progressColor,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassicWidget;
