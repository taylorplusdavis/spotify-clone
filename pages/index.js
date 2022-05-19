import Head from "next/head";
import Sidebar from "../components/Sidebar";
import Center from "../components/Center";
import Player from "../components/Player";
import { getSession, GetSessionParams } from "next-auth/react";

export default function Home() {
  return (
    <div className="">
      <Head>
        <title>Spotify</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex overflow-hidden">
        <Sidebar />
        <Center />
      </main>

      <div className="sticky bottom-0 ">
        <Player />
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  return {
    props: {
      session,
    },
  };
}
