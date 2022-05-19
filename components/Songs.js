import React from "react";
import { useRecoilValue } from "recoil";
import { playlistState } from "../atoms/playlistAtom";
import Song from "./Song";

function Songs() {
  const playlist = useRecoilValue(playlistState);
  console.log(playlist);

  return (
    <div className="text-white bg-black">
      {playlist?.tracks.items?.map((track, i) => (
        <div>
          <Song
            key={track.track.id}
            album={track.track.album.name}
            order={i}
            track={track}
            trackArtist={track.track.artists[0].name}
            trackImg={track.track.album.images[0].url}
            trackName={track.track.name}
            songLength={track.track.duration_ms}
          />
        </div>
      ))}
    </div>
  );
}

export default Songs;
