import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { CgHomeAlt } from 'react-icons/cg';

const handleSubmit = (e) => {
    e.preventDefault();
    const displayName = document.getElementById("displayName")?.value;
    const host = document.getElementById("host")?.value;
    const username = document.getElementById("username")?.value;
    const auth = document.getElementById("auth")?.value;

    const data = {
        displayName,
        host: host.split(":")[0],
        port: host.split(":")[1] || 22,
        username,
        auth: {
            method: auth ? "key" : "agent",
            auth: auth ? auth : null
        }
    };
    
    window.setsuzoku.listing.create(data);
    (() => {
        window.onmessage = (event) => {
            // event.source === window means the message is coming from the preload
            // script, as opposed to from an <iframe> or other source.
            if (event.source === window && event.data?.type === "create" && event.data?.payload?.host === data.host) {
                if (event.data?.payload?.success === false) alert(`Failed to add server: ${event.data?.payload?.error || "Unknown error"}`);
                
                else window.location.href = "index";
            }
        };
    })()
};

function Home() {
    const [authMethod, setAuthMethod] = React.useState("agent");
    return (
        <React.Fragment>
            <Head>
                <title>Add a server - Setsuzoku</title>
            </Head>
            <div className="flex flex-col text-right items-center md:items-end space-y-6">
                <Link href="index" className="text-4xl">
                    <CgHomeAlt />
                </Link>
                <h1 className="text-4xl font-bold font-Inter md:text-right text-center">Add a server</h1>
                <form className="flex flex-col space-y-4 w-full" onSubmit={handleSubmit}>
                    <input id="displayName" type="text" placeholder="Name" className="w-full pl-0 pr-2 py-4 bg-transparent border-b-[1px] focus:border-b-[2px] text-white text-base text-right focus:outline-none" required />
                    <input id="host" type="text" placeholder="Host" className="w-full pl-0 pr-2 px-8 py-4 bg-transparent border-b-[1px] focus:border-b-[2px] text-white text-base text-right focus:outline-none" required />
                    <input id="username" type="text" placeholder="Username" className="w-full pl-0 pr-2 py-4 bg-transparent border-b-[1px] focus:border-b-[2px] text-white text-base text-right focus:outline-none" required />
                    {
                        authMethod === "key" && (
                            <input id="auth" type="text" placeholder="SSH key path" className="w-full pl-0 pr-2 py-4 bg-transparent border-b-[1px] focus:border-b-[2px] text-white text-base text-right focus:outline-none" required />
                        )
                    }
                    <div className="form-check form-switch flex flex-row items-center justify-between pr-2 pt-2">
                        <input className="form-check-input appearance-none w-12 -ml-10 rounded-full float-left h-7 align-to bg-no-repeat bg-contain bg-gray-300 focus:outline-none cursor-pointer shadow-sm" type="checkbox" role="switch" id="keyOrPassword" defaultChecked
                            onChange={(e) => {
                                if (e.target.checked) {
                                    setAuthMethod("agent");
                                } else {
                                    setAuthMethod("key");
                                }
                            }}
                        />
                        <h1 className="text-md text-medium">Use SSH agent</h1>
                    </div>
                    <div className="flex items-center justify-center w-full">
                        <button type="submit" className="px-8 md:px-12 py-2 bg-gray-50 text-black rounded-2xl text-lg">Add</button>
                    </div>
                </form>
            </div>
        </React.Fragment>
    );
}

export default Home;
