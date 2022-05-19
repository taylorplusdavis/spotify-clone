import React from "react";
import { getProviders, signIn } from "next-auth/react";
import Image from "next/image";

function Login({ providers }) {
  return (
    <div className="flex flex-col items-center bg-black min-h-screen w-full justify-center">
      <div className="w-52 h-52 mb-5 relative">
        <Image
          priority
          src="https://links.papareact.com/9xl"
          layout="fill"
          objectFit="contain"
        />
      </div>

      {Object.values(providers).map((provider) => (
        <div key={provider.name}>
          <button
            className="bg-[#18D860] text-lime-900 font-semibold rounded-full p-5"
            onClick={() => signIn(provider.id, { callbackUrl: "/" })}
          >
            Login with {provider.name}
          </button>
        </div>
      ))}
    </div>
  );
}

export default Login;

export async function getServerSideProps() {
  const providers = await getProviders();

  return {
    props: {
      providers,
    },
  };
}
