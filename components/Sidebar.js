import {
  HomeIcon,
  LibraryIcon,
  PlusCircleIcon,
  RssIcon,
  SearchIcon,
} from "@heroicons/react/outline";
import { HeartIcon } from "@heroicons/react/solid";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import useSpotify from "../hooks/useSpotify";
import { playlistState, playlistIdState } from "../atoms/playlistAtom";

console.log(playlistState);

function Sidebar() {
  const spotifyApi = useSpotify();
  const { data: session, status } = useSession();
  const [playlists, setPlaylists] = useState([]);
  const [playlistId, setPlaylistId] = useRecoilState(playlistIdState);
  const [playlist, setPlaylist] = useRecoilState(playlistState);

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi.getUserPlaylists().then((data) => {
        setPlaylists(data.body.items);
      });
    }
    console.log(playlists);
  }, [session, spotifyApi]);

  return (
    <div className="w-52 h-screen bg-black p-4 pb-36 space-y-4 overflow-y-scroll scrollbar-thin scrollbar-thumb-zinc-600 scrollbar-track-transparent border-r-[1px] border-zinc-900">
      {session ? (
        <div className="listItemContainer" onClick={() => signOut()}>
          <p className="listItemText">Logout</p>
        </div>
      ) : null}

      <div className="listItemContainer">
        <HomeIcon className="listItemIcon" />
        <p className="listItemText">Home</p>
      </div>
      <div className="listItemContainer">
        <SearchIcon className="listItemIcon" />
        <p className="listItemText">Search</p>
      </div>
      <div className="listItemContainer">
        <LibraryIcon className="listItemIcon" />
        <p className="listItemText">Your Library</p>
      </div>

      <hr className="border-neutral-900" />

      <div className="listItemContainer">
        <PlusCircleIcon className="listItemIcon" />
        <p className="listItemText">Create Playlist</p>
      </div>
      <div className="listItemContainer">
        <HeartIcon className="listItemIcon text-blue-700 hover:text-blue-600" />
        <p className="listItemText">Liked Songs</p>
      </div>
      <div className="listItemContainer">
        <RssIcon className="listItemIcon text-lime-700 hover:text-lime-600" />
        <p className="listItemText">Your Library</p>
      </div>
      <hr className="border-neutral-900" />

      {/* Playlists */}

      {playlists.map((playlist) => (
        <div
          className="listItemContainer"
          key={playlist.id}
          onClick={() => {
            setPlaylistId(playlist.id);
            setPlaylist(playlist);
          }}
        >
          <p className="listItemText">
            {playlist.name.length <= 18
              ? playlist.name
              : playlist.name.substring(0, 17) + "..."}
          </p>
        </div>
      ))}
    </div>
  );
}

export default Sidebar;
