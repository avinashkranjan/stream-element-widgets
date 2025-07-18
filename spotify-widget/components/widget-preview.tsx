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

  switch (type) {
    case "minimal":
      return (
        <div className="text-white bg-gray-800 p-4 rounded-lg w-64 text-center">
          <p className="text-lg font-semibold">{item.name}</p>
          <p className="text-sm text-gray-300">{artist}</p>
        </div>
      );
    case "compact":
      return <div className="w-24 h-24 rounded overflow-hidden">{cover}</div>;
    case "banner":
      return (
        <div className="flex items-center bg-gray-800 text-white p-4 rounded-lg space-x-4 w-[350px]">
          <div className="w-16 h-16 rounded overflow-hidden">{cover}</div>
          <div>
            <p className="text-lg font-bold">{item.name}</p>
            <p className="text-sm text-gray-300">{artist}</p>
          </div>
        </div>
      );
    case "stats":
      return (
        <div className="bg-gray-800 text-white p-4 rounded-lg w-64">
          <p>
            {item.name} – {artist}
          </p>
          <p className="text-sm text-gray-300">
            Duration: {(dur / 1000).toFixed(0)}s
          </p>
          <p className="text-sm text-green-400">
            Status: {is_playing ? "Playing" : "Paused"}
          </p>
        </div>
      );
    default: // classic
      return (
        <div className="flex bg-gray-800 text-white p-4 rounded-lg space-x-4 w-[350px]">
          <div className="w-24 h-24 rounded overflow-hidden">{cover}</div>
          <div className="flex-1">
            <p className="text-lg font-bold">{item.name}</p>
            <p className="text-sm text-gray-300">{artist}</p>
            <div className="w-full bg-gray-600 h-1 mt-2 rounded">
              <div
                className="bg-green-400 h-full rounded"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        </div>
      );
  }
};

export default WidgetPreview;
