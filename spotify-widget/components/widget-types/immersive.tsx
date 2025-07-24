import { getGradientColorsFromImage } from "@/lib/colorthief";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";

const ImmersiveWidget = ({
  trackName = "Track Title",
  artistName = "Artist Name",
  isPlaying = false,
  isPreview = false,
  coverImage = "",
  currentTime = 0,
  duration = 220000,
}) => {
  const progressValue = useMotionValue(0);
  const [colors, setColors] = useState({
    backgroundColor: "#eee",
    progressColor: "#aaa",
    domainColor: "#fff",
  });

  useEffect(() => {
    getGradientColorsFromImage(coverImage)
      .then((result) => {
        const match = result.backgroundColor.match(/rgb\([^)]+\)/);
        const primaryColor = match ? match[0] : "rgb(97,30,32)";

        const updatedBackgroundImage = `linear-gradient(to top, ${primaryColor}, transparent)`;

        setColors({
          backgroundColor: updatedBackgroundImage,
          progressColor: result.progressColor,
          domainColor: result.domainColor,
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
          className="absolute bottom-0 w-full h-1/2 opacity-90 z-10"
          style={{
            backgroundImage: colors.backgroundColor,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
          }}
        />
        {/* Straight Progress Bar */}
        <div className="absolute bottom-6 left-5 right-5 z-30">
          <div
            className="flex justify-between text-xs font-semibold drop-shadow-lg mb-1"
            style={{ color: colors.domainColor }}
          >
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
          <div
            className="text-sm opacity-90 drop-shadow-lg font-semibold truncate flex items-center justify-center gap-2 mt-1"
            style={{ color: colors.domainColor }}
          >
            {isPlaying && (
              <div className="flex gap-1">
                <div
                  className="w-1 h-3 rounded-full animate-pulse"
                  style={{ background: colors.domainColor }}
                />
                <div
                  className="w-1 h-3  rounded-full animate-pulse"
                  style={{
                    animationDelay: "0.2s",
                    background: colors.domainColor,
                  }}
                />
                <div
                  className="w-1 h-3 rounded-full animate-pulse"
                  style={{
                    animationDelay: "0.4s",
                    background: colors.domainColor,
                  }}
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
