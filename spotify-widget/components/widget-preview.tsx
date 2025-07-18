import BannerWidget from "./widget-types/banner";
import BannerGlassWidget from "./widget-types/banner-glass";
import ClassicWidget from "./widget-types/classic";
import ImmersiveWidget from "./widget-types/immersive";
import MinimalWidget from "./widget-types/minimal";

const PREVIEW_DATA = {
  item: {
    name: "Mockingbird",
    album: {
      images: [
        {
          url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRneCLGDb0dzQc-ufX9ELgDNzbvYaBGA7oAyw&s",
        },
      ],
    },
    artists: [{ name: "Eminem" }],
    duration_ms: 210000,
  },
  is_playing: true,
  progress_ms: 105000,
};

const WidgetPreview = ({ type }: { type: string }) => {
  const { item, is_playing, progress_ms } = PREVIEW_DATA;
  const dur = item.duration_ms;
  const pct = (progress_ms / dur) * 100;
  const artist = item.artists.map((a) => a.name).join(", ");
  const cover = (
    <img
      src={item.album.images[0].url}
      alt="cover"
      className="w-full h-full object-cover rounded"
    />
  );

  switch (
    type as
      | string
      | "classic"
      | "banner"
      | "banner-glass"
      | "minimal"
      | "immersive"
  ) {
    case "minimal":
      return (
        <MinimalWidget
          trackName={item.name}
          artistName={artist?.split(",")[0]}
          isPlaying={true}
          coverImage={item.album.images[0].url}
          progress={65}
          isPreview={true}
        />
      );
    case "classic":
      return (
        <ClassicWidget
          trackName={item.name}
          artistName={artist?.split(",")[0]}
          isPlaying={true}
          isPreview={true}
          progress={65}
          coverImage={item.album.images[0].url}
        />
      );
    case "banner":
      return (
        <BannerWidget
          trackName={item.name}
          artistName={artist?.split(",")[0]}
          isPlaying={true}
          isPreview={true}
          progress={65}
          coverImage={item.album.images[0].url}
          duration={dur}
          currentTime={progress_ms}
        />
      );
    case "banner-glass":
      return (
        <BannerGlassWidget
          trackName={item.name}
          artistName={artist?.split(",")[0]}
          isPlaying={true}
          isPreview={true}
          progress={65}
          coverImage={item.album.images[0].url}
          duration={dur}
          currentTime={progress_ms}
        />
      );
    case "immersive":
      return (
        <ImmersiveWidget
          trackName={item.name}
          artistName={artist?.split(",")[0]}
          isPlaying={true}
          isPreview={true}
          coverImage={item.album.images[0].url}
          currentTime={progress_ms}
          duration={dur}
        />
      );
  }
};

export default WidgetPreview;
