import React, { useEffect, useState } from "react";
import Image from "next/image";
import Songs from "../components/Songs";
import { useSession } from "next-auth/react";
import { ChevronDownIcon } from "@heroicons/react/outline";
import { shuffle } from "lodash";
import useSpotify from "../hooks/useSpotify";
import { playlistIdState, playlistState } from "../atoms/playlistAtom";
import { useRecoilState, useRecoilValue } from "recoil";
import SpotifyWebApi from "spotify-web-api-node";

const colors = [
  "from-indigo-500",
  "from-green-500",
  "from-blue-500",
  "from-purple-500",
  "from-teal-500",
  "from-rose-500",
  "from-green-500",
  "from-red-500",
  "from-lime-500",
  "from-yellow-500",
];

function Center() {
  const spotifyApi = useSpotify();
  const { data: session } = useSession();
  const [color, setColor] = useState(null);
  const playlistId = useRecoilValue(playlistIdState);
  const [playlist, setPlaylist] = useRecoilState(playlistState);

  useEffect(() => {
    setColor(shuffle(colors).pop());
  }, [playlistId]);

  useEffect(() => {
    spotifyApi.getPlaylist(playlistId).then(
      function (data) {
        setPlaylist(data.body);
      },
      function (err) {
        console.log("Something went wrong!", err);
      }
    );
  }, [spotifyApi, playlistId]);

  return (
    <div
      className={` w-full bg-black text-white justify-center items-center flex-grow overflow-hidden h-screen overflow-y-scroll scrollbar-none`}
    >
      <header className="absolute top-5 right-8">
        <div className="flex bg-black justify-center items-center space-x-2 opacity-90 hover:opacity-80 cursor-pointer rounded-full p-1 pr-2 ">
          <div className="image-container relative w-12 h-12">
            {session?.user.image ? (
              <img
                className="rounded-full object-contain"
                src={session?.user.image}
                alt="profile picture"
              />
            ) : null}
          </div>
          <p>{session?.user.name}</p>
          <ChevronDownIcon className="w-5 h-5" />
        </div>
      </header>

      <section
        className={` bg-gradient-to-b to-black ${color} flex items-end space-x-7  h-80 text-white padding-8`}
      >
        <img src={playlist?.images?.[0]?.url} className="h-44 w-44 ml-[2em]" />
        <div>
          <p className="opacity-50">PLAYLIST</p>
          <h1 className="font-bold text-6xl">{playlist?.name}</h1>
        </div>
      </section>
      <Songs />
    </div>
  );
}

export default Center;
