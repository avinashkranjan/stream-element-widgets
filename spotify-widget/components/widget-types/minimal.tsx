import { getGradientColorsFromImage } from "@/lib/colorthief";
import React, { useEffect, useState } from "react";

const MinimalWidget = ({
  trackName = "Track Name",
  artistName = "Artist Name",
  isPlaying = false,
  isPreview = false,
  coverImage = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGh5WFH8TOIfRKxUrIgJZoDCs1yvQ4hIcppw&s",
  progress = 0,
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
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-5 h-5"
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
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-5 h-5"
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
        className={`flex items-center rounded-3xl px-5 py-2.5 gap-3 shadow-lg`}
        style={{ backgroundImage: colors.backgroundColor }}
      >
        {/* Play/Pause Icon */}
        <div className="text-gray-700">
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </div>

        {/* Progress Container */}
        <div className="relative w-30 h-1.5 bg-black/30 rounded-full overflow-hidden">
          <div
            className={`absolute h-full bg-gradient-to-r  transition-all duration-700 ease-out rounded-full`}
            style={{
              width: `${Math.min(100, Math.max(0, progress))}%`,
              background: colors.progressColor,
            }}
          />
        </div>

        {/* Track Info */}
        <div className="flex items-center gap-1.5 text-sm text-gray-700 whitespace-nowrap">
          <span className="text-lg font-semibold">⋮</span>
          <span className="font-semibold">{trackName}</span>
          <span className="opacity-40">|</span>
          <span>{artistName?.split(",")[0]}</span>
        </div>
      </div>
    </div>
  );
};

export default MinimalWidget;
