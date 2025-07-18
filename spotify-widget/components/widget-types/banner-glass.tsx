import { getGradientColorsFromImage } from "@/lib/colorthief";
import React, { useState, useEffect, useRef } from "react";

const BannerGlassWidget = ({
  trackName = "Track Name",
  artistName = "Artist Name",
  isPlaying = false,
  isPreview = false,
  progress = 0,
  coverImage = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGh5WFH8TOIfRKxUrIgJZoDCs1yvQ4hIcppw&s",
  currentTime = 0,
  duration = 220000,
}) => {
  const [animatedProgress, setAnimatedProgress] = useState(progress);
  const [colors, setColors] = useState({
    backgroundColor: "#eee",
    progressColor: "#aaa",
  });

  useEffect(() => {
    getGradientColorsFromImage(coverImage)
      .then((result) => {
        setColors({
          backgroundColor: `linear-gradient(to bottom, ${result.backgroundColor}, transparent)`,
          progressColor: result.progressColor,
        });
      })
      .catch(console.error);
  }, [coverImage]);

  useEffect(() => {
    setAnimatedProgress(progress);
  }, [progress]);

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

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
        d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0a.75.75 0 01.75-.75h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z"
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
      <div className="w-80 rounded-3xl overflow-hidden relative">
        <img
          src={coverImage}
          alt="Album Art"
          className="w-full block object-cover"
          crossOrigin="anonymous"
        />

        <div
          className={`absolute top-0 left-0 right-0 p-4 rounded-3xl text-white border border-white bg-gradient-to-b`}
          style={{
            boxShadow: "inset 0 0 0 1000px rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(1px)",
            margin: "0 auto",
            background: colors.backgroundColor,
          }}
        >
          {/* Track Info */}
          <div className="text-center mb-3">
            <h1 className="text-lg font-bold text-gray-900 mb-0.5 line-clamp-1">
              {trackName}
            </h1>
            <p className="text-sm opacity-85 text-gray-900 line-clamp-1 my-0.5">
              {artistName}
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            {/* Play/Pause Icon */}
            <div className="text-gray-900 pr-2 drop-shadow-sm">
              {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </div>

            {/* Current Time */}
            <span className="text-xs text-gray-900 opacity-85">
              {formatTime(currentTime)}
            </span>

            {/* Progress Bar */}
            <div className="flex-1 h-1.5 bg-gray-300 mx-1.5 rounded-sm overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ease-out bg-gradient-to-r`}
                style={{
                  width: `${Math.min(100, Math.max(0, animatedProgress))}%`,
                  background: colors.progressColor,
                }}
              />
            </div>

            {/* Total Time */}
            <span className="text-xs text-gray-900 opacity-85">
              {formatTime(duration)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerGlassWidget;
