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

  const knobX = useTransform(progressValue, (p) => `${p * 100}%`);

  const formatTime = (ms: number) => {
    const totalSec = Math.floor(ms / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return `${min}:${sec.toString().padStart(2, "0")}`;
  };

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
          className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t opacity-90 z-10"
          style={{ background: colors.backgroundColor }}
        />
        {/* Straight Progress Bar */}
        <div className="absolute bottom-6 left-5 right-5 z-30">
          <div className="flex justify-between text-xs text-yellow-300 font-semibold drop-shadow-lg mb-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
          <div className="relative w-full h-2 bg-black/30 rounded-full overflow-hidden">
            {/* Progress Fill */}
            <motion.div
              className="absolute left-0 top-0 h-full rounded-full"
              style={{
                width: useTransform(progressValue, (p) => `${p * 100}%`),
                background: colors.progressColor,
              }}
            />
          </div>
        </div>
        {/* Track Info on Top */}
        <div className="absolute bottom-14 left-0 right-0 text-center z-30 px-4">
          <div className="text-lg font-bold text-white drop-shadow-lg truncate">
            {trackName}
          </div>
          <div className="text-sm text-yellow-300 opacity-90 drop-shadow-lg truncate flex items-center justify-center gap-2 mt-1">
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
        </div>{" "}
        {/* Animated Knob */}
      </div>
    </div>
  );
};

export default ImmersiveWidget;
