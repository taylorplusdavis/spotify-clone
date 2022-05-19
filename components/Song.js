import React from "react";
import { useRecoilState } from "recoil";
import { currentTrackIdState, isPlayingState } from "../atoms/songAtom";
import useSpotify from "../hooks/useSpotify";
import { millisToMinutesAndSeconds } from "../lib/time";

function Song({
  order,
  track,
  trackName,
  trackImg,
  trackArtist,
  album,
  songLength,
}) {
  const spotifyApi = useSpotify();
  const [currentTrack, setCurrentTrack] = useRecoilState(currentTrackIdState);
  const [isPLaying, setIsPlaying] = useRecoilState(isPlayingState);

  const playSong = () => {
    setCurrentTrack(track.track.id);
    setIsPlaying(true);
    spotifyApi.play({
      uris: [track.track.uri],
    });
  };

  return (
    <div
      className="grid grid-cols-2 py-4 mx-10 hover:bg-slate-800 items-center px-4 cursor-pointer transition-all duration-100 ease-out"
      onClick={playSong}
    >
      {/* left */}
      <div className="left flex space-x-4 items-center">
        <p className="opacity-50">{order + 1}</p>
        <img src={trackImg} className="w-10 h-10" alt="" />
        <div className="album-info">
          <p className="w-36 lg:w-64 truncate">{trackName}</p>
          <p className="opacity-50 w-40 truncate">{trackArtist}</p>
        </div>
      </div>

      <div className="flex items-center justify-between ml-auto md:ml-0">
        <p className="hidden md:inline opacity-50 w-64 truncate">{album}</p>
        <div className="right opacity-50">
          <p>{millisToMinutesAndSeconds(songLength)}</p>
        </div>
      </div>
    </div>
  );
}

export default Song;
