import { useRouter } from 'next/router';
import { useEffect, useState } from "react";
import LoadingCircle from "/components/LoadingCircle";
import { IoCheckmark, IoLockClosed, IoSad } from "react-icons/io5";

export default function Connected(props) {
    const router = useRouter();
    const [ status, setStatus ] = useState("connecting");
    const [ displayName, setDisplayName ] = useState(null);
    useEffect(() => {
        if (router.isReady) {
            if (router?.query?.host !== null) window.setsuzoku.listing.connect(router?.query?.host);
            else router.push(window?.setsuzoku?.rootPath);

            window.onmessage = (event) => {
                // event.source === window means the message is coming from the preload
                // script, as opposed to from an <iframe> or other source.
                if (event.source === window && event.data?.type === "connect") {
                    console.log(event.data)
                    if (displayName === null) setDisplayName(event.data.payload.displayName);
                    setStatus(event.data.payload.status);
                };
            };
        };
    }, [router.isReady]);
    return (
        <div className="flex flex-col space-y-4 w-full">
            {
                status === "connecting" && (
                    <>
                        <div>
                            <LoadingCircle />
                        </div>
                        <h1 className="text-2xl font-bold font-Inter text-center">Connecting to server..</h1>
                        <div className="flex flex-row items-center justify-evenly w-full gap-x-4">
                            <button className="bg-gray-50 text-black rounded-2xl px-6 py-2 font-bold font-Inter text-lg" onClick={() => window?.setsuzoku?.router.push("/")}>Go home</button>
                        </div>
                    </>
                )
            }
            {
                status === "connected" && (
                    <>
                        <div className="flex items-center justify-center">
                            <IoCheckmark className="text-6xl" />
                        </div>
                        <h1 className="text-2xl font-bold font-Inter text-center"><b className="bg-clip-text text-transparent text-gradient-brand">Connected</b> to {displayName ? displayName : "server"}</h1>
                        <div className="flex flex-row items-center justify-evenly w-full gap-x-4">
                            <button className="hidden bg-gray-50 text-black rounded-2xl px-6 py-2 font-bold font-Inter text-lg" onClick={() => router.push(`/connect/${router?.query?.host}`, {  }).then(() => router.reload())}>Duplicate session</button>
                            <button className="bg-gray-50 text-black rounded-2xl px-6 py-2 font-bold font-Inter text-lg" onClick={() => window?.setsuzoku?.router.push("/")}>Go home</button>
                        </div>
                    </>
                )
            }
            {
                status === "failed" && (
                    <>
                        <div className="flex items-center justify-center w-full">
                            <IoSad className="text-6xl" />
                        </div>
                        <h1 className="text-2xl font-bold font-Inter text-center"><b className="bg-clip-text text-transparent text-gradient-lust">Failed to connect</b> to <span className="lg:hidden">server</span> <code className="text-xl hidden lg:inline-block">{router?.query?.host}</code></h1>
                        <div className="flex flex-row items-center justify-evenly w-full gap-x-4">
                            <button className="hidden bg-gray-50 text-black rounded-2xl px-6 py-2 font-bold font-Inter text-lg" onClick={() => router.push(`/connect/${router?.query?.host}`).then(() => router.reload())}>Reconnect</button>
                            <button className="bg-gray-50 text-black rounded-2xl px-6 py-2 font-bold font-Inter text-lg" onClick={() => window?.setsuzoku?.router.push("/")}>Go home</button>
                        </div>
                    </>
                )
            }
            {
                status === "disconnected" && (
                    <>
                        <div className="flex items-center justify-center w-full">
                            <IoLockClosed className="text-6xl" />
                        </div>
                        <h1 className="text-2xl font-bold font-Inter text-center"><b className="bg-clip-text text-transparent text-gradient-lust">Disconnected</b> from {displayName ? displayName : "server"}</h1>
                        <div className="flex flex-row items-center justify-evenly w-full gap-x-4">
                            <button className="hidden bg-gray-50 text-black rounded-2xl px-6 py-2 font-bold font-Inter text-lg" onClick={() => router.push(`/connect/${router?.query?.host}`).then(() => router.reload())}>Reconnect</button>
                            <button className="bg-gray-50 text-black rounded-2xl px-6 py-2 font-bold font-Inter text-lg" onClick={() => window?.setsuzoku?.router.push("/")}>Go home</button>
                        </div>
                    </>
                )
            }
        </div>
    );
};

export function UNUSED_getServerSideProps(context) {
    if (context.query.host) return {
        props: {
            host: context.query?.host || null
        }
    };
    else return {
        redirect: {
            destination: "/",
            permanent: false
        }
    };
};