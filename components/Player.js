import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { currentTrackIdState, isPlayingState } from "../atoms/songAtom";
import useSpotify from "../hooks/useSpotify";
import useSongInfo from "../hooks/useSongInfo";
import {
  ReplyIcon,
  SwitchHorizontalIcon,
  VolumeUpIcon,
} from "@heroicons/react/outline";
import {
  FastForwardIcon,
  PauseIcon,
  PlayIcon,
  RewindIcon,
  VolumeUpIcon as VolumeUpIconSolid,
} from "@heroicons/react/solid";
import { debounce } from "lodash";

function Player() {
  const spotifyApi = useSpotify();
  const { data: session, status } = useSession();
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [volume, setVolume] = useState(50);
  const songInfo = useSongInfo();

  const fetchCurrentSong = () => {
    if (!songInfo) {
      spotifyApi.getMyCurrentPlayingTrack().then((data) => {
        setCurrentTrackId(data.body?.item?.id);
        spotifyApi.getMyCurrentPlaybackState().then((data) => {
          setIsPlaying(data.body?.is_playing);
        });
      });
    }
  };

  const handlePlayPause = () => {
    spotifyApi.getMyCurrentPlaybackState().then((data) => {
      if (data.body.is_playing) {
        spotifyApi.pause();
        setIsPlaying(false);
      } else {
        spotifyApi.play();
        setIsPlaying(true);
      }
    });
  };

  useEffect(() => {
    if (spotifyApi.getAccessToken() && !currentTrackId) {
      fetchCurrentSong();
      setVolume(50);
    }
  }, [currentTrackIdState, spotifyApi, session]);

  useEffect(() => {
    if (volume > 0 && volume < 100) {
      debouncedAdjustVolume(volume);
    }
  }, [volume]);

  const debouncedAdjustVolume = useCallback(
    debounce((volume) => {
      spotifyApi.setVolume(volume).catch((error) => {});
    }, 100),
    []
  );

  return (
    <div className="bg-zinc-900 text-white border-t-[1px] border-zinc-800 p-6 grid-cols-3 grid text-xs md:text-base">
      {/* left */}
      <div className="flex items-center">
        <img
          src={songInfo?.album.images?.[0].url}
          className="hidden md:inline h-14 w-14"
          alt=""
        />
        <div className="ml-2">
          <h3>{songInfo?.name}</h3>
          <h3 className="opacity-50">{songInfo?.artists?.[0]?.name}</h3>
        </div>
      </div>

      {/* center */}
      <div className="flex justify-around items-center">
        <SwitchHorizontalIcon className="button" />
        <RewindIcon
          onClick={() => spotifyApi.skipToPrevious()}
          className="button"
        />
        {isPlaying ? (
          <PauseIcon onClick={handlePlayPause} className="button w-10 h-10" />
        ) : (
          <PlayIcon onClick={handlePlayPause} className="button w-10 h-10" />
        )}
        <FastForwardIcon className="button" />
        <ReplyIcon className="button" />
      </div>
      {/* right */}
      <div className="flex ml-auto items-center space-x-2">
        <VolumeUpIcon
          onClick={() => volume > 0 && setVolume(volume - 10)}
          className="button"
        />
        <input
          onChange={(e) => setVolume(Number(e.target.value))}
          value={volume}
          type="range"
          min={0}
          max={100}
          name=""
          id=""
        />
        <VolumeUpIconSolid
          onClick={() => volume < 100 && setVolume(volume + 10)}
          className="button"
        />
      </div>
    </div>
  );
}

export default Player;
