import { getGradientColorsFromImage } from "@/lib/colorthief";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";

const ImmersiveWidget = ({
  trackName = "Track Title",
  artistName = "Artist Name",
  isPlaying = false,
  isPreview = false,
  coverImage = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGh5WFH8TOIfRKxUrIgJZoDCs1yvQ4hIcppw&s",
  currentTime = 0,
  duration = 220000,
}) => {
  const progressValue = useMotionValue(0);
  const [colors, setColors] = useState({
    backgroundColor: "#eee",
    progressColor: "#aaa",
  });

  useEffect(() => {
    getGradientColorsFromImage(coverImage)
      .then((result) => {
        setColors({
          backgroundColor: `linear-gradient(to top, ${result.backgroundColor}, transparent)`,
          progressColor: result.progressColor,
        });
      })
      .catch(console.error);
  }, [coverImage]);

  useEffect(() => {
    const newProgress = duration > 0 ? currentTime / duration : 0;
    animate(progressValue, newProgress, { duration: 0.5, ease: "easeOut" });
  }, [currentTime, duration, progressValue]);

  // Arc path points
  const start = { x: 30, y: 130 };
  const control = { x: 150, y: 20 };
  const end = { x: 270, y: 130 };
  const arcLength = 420;

  const formatTime = (ms: number) => {
    const totalSec = Math.floor(ms / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return `${min}:${sec.toString().padStart(2, "0")}`;
  };

  const getBezierPoint = (t: number) => {
    const x =
      (1 - t) ** 2 * start.x + 2 * (1 - t) * t * control.x + t ** 2 * end.x;
    const y =
      (1 - t) ** 2 * start.y + 2 * (1 - t) * t * control.y + t ** 2 * end.y;
    return { x, y };
  };

  const knobX = useTransform(progressValue, (p) => getBezierPoint(p).x);
  const knobY = useTransform(progressValue, (p) => getBezierPoint(p).y);
  const dashOffset = useTransform(progressValue, (p) => arcLength * (1 - p));

  return (
    <div
      className={`${
        isPreview ? "" : "min-h-screen"
      } flex justify-center items-center bg-transparent font-sans`}
    >
      <div className="relative w-[300px] h-[380px] rounded-3xl overflow-hidden shadow-2xl bg-black">
        {/* Album Cover */}
        <div className="absolute inset-0 z-0">
          <img
            src={coverImage}
            alt="Album Art"
            className="w-full h-full object-cover brightness-75"
            crossOrigin="anonymous"
          />
        </div>

        {/* Gradient Overlay */}
        <div
          className={`absolute bottom-0 w-full h-1/2 bg-gradient-to-t opacity-90 z-10`}
          style={{
            background: colors.backgroundColor,
          }}
        />

        {/* Progress Arc SVG */}
        <div className="absolute top-[200px] w-full h-[150px] z-20">
          <svg className="w-full h-full" viewBox="0 0 300 150">
            {/* Base arc */}
            <path
              d="M 30 130 Q 150 20 270 130"
              stroke="rgba(255, 255, 255, 0.3)"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />

            {/* Progress arc */}
            <motion.path
              d="M 30 130 Q 150 20 270 130"
              stroke="url(#progressGradient)"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
              strokeDasharray={arcLength}
              style={{ strokeDashoffset: dashOffset }}
            />

            {/* Progress knob */}
            <motion.circle
              r="6"
              fill="url(#knobGradient)"
              className="drop-shadow-lg"
              cx={knobX}
              cy={knobY}
            />

            {/* Gradient Definitions */}
            <defs>
              <linearGradient
                id="progressGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#fde68a" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
              <radialGradient id="knobGradient">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#f59e0b" />
              </radialGradient>
            </defs>
          </svg>
        </div>

        {/* Time Display */}
        <div className="absolute top-[340px] left-0 right-0 flex justify-between px-4 z-30">
          <span className="text-xs font-semibold text-yellow-300 drop-shadow-lg">
            {formatTime(currentTime)}
          </span>
          <span className="text-xs font-semibold text-yellow-300 drop-shadow-lg">
            {formatTime(duration)}
          </span>
        </div>

        {/* Track Info */}
        <div className="absolute bottom-6 left-0 right-0 text-center z-30 px-4">
          <div className="text-xl font-bold text-white drop-shadow-lg mb-1 truncate">
            {trackName}
          </div>
          <div className="text-sm text-yellow-300 opacity-90 drop-shadow-lg truncate flex items-center justify-center gap-2">
            {isPlaying && (
              <div className="flex gap-1">
                <div className="w-1 h-3 bg-yellow-300 rounded-full animate-pulse" />
                <div
                  className="w-1 h-3 bg-yellow-300 rounded-full animate-pulse"
                  style={{ animationDelay: "0.2s" }}
                />
                <div
                  className="w-1 h-3 bg-yellow-300 rounded-full animate-pulse"
                  style={{ animationDelay: "0.4s" }}
                />
              </div>
            )}
            {artistName}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImmersiveWidget;
