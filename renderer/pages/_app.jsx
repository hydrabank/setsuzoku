import React from 'react';
import { Inter } from '@next/font/google';
import BackgroundCircles from '/components/BackgroundCircles';
import Image from 'next/image';
import { CgInfinity, CgAdd } from 'react-icons/cg';
import { PagewideContext } from '/components/Contexts/PagewideContext';

import '../styles/globals.css';
const inter = Inter({ subsets: ['latin'], variable: "--font-inter" });

function MyApp({ Component, pageProps }) {
    const [ context, setContext ] = React.useState({
        dialog: {
            open: false,
            type: "default",
            props: {}
        }
    });
    return <PagewideContext.Provider value={{ context, setContext }}>
        <div className={`${inter.variable}`}>
            <div className={`min-w-screen min-h-screen w-full h-full bg-black bg-opacity-[75%] absolute top-0 left-0 z-[90] flex items-center justify-center ${context?.dialog?.open === false ? "hidden" : ""}`}>
                <div className="flex flex-col bg-gray-900 px-8 py-6 rounded-2xl items-start justify-start">
                    <Image src="images/infinity.webp" width={74} height={50} />
                    <h1 className="text-4xl font-bold font-Inter bg-clip-text text-transparent text-gradient-lust">Confirm deletion</h1>
                    <p className="text-xl font-Inter text-gray-300 pt-2 max-w-[500px]">Are you sure you want to delete this server from your list? You will <b className="text-transparent bg-clip-text text-gradient-lust">not</b> be able to undo this later.</p>
                    <div className="flex flex-row w-full justify-end space-x-2 items-center pt-4">
                        <button 
                            className="bg-red-500 text-gray-300 px-4 py-2 rounded-2xl font-Inter font-bold text-xl hover:bg-red-400 animation-preset-brand"
                            onClick={() => {
                                setContext({
                                    ...context,
                                    dialog: {
                                        open: false,
                                        type: "confirmDeletion",
                                        props: {}
                                    }
                                });

                                window?.setsuzoku?.listing?.remove(context?.dialog?.props?.id);
                                window?.setsuzoku?.router?.push("/");
                            }}
                        >
                            Delete
                        </button>
                        <button 
                            className="bg-gray-800 text-gray-300 px-4 py-2 rounded-2xl font-Inter font-bold text-xl hover:bg-gray-700 animation-preset-brand"
                            onClick={() => setContext({
                                ...context,
                                dialog: {
                                    open: false,
                                    type: "confirmDeletion",
                                    props: {}
                                }
                            })}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
            <div className="min-h-screen flex items-center w-full justify-center px-16">
                <BackgroundCircles />
                <div className="flex flex-col md:flex-row md:justify-between md:px-24 items-center text-5xl font-bold font-Inter w-full bg-slate-800 md:bg-transparent z-50 px-8 py-8 md:py-0 rounded-2xl md:rounded-none">
                    <div className="flex flex-row items-center text-5xl">
                        <CgInfinity className="hidden text-8xl text-blue bg-clip-text bg-gradient-to-r from-indigo-200 via-red-200 to-yellow-100" />
                        <Image src="images/infinity.webp" width={148} height={100} unoptimized />
                    </div>
                    <div className="flex flex-col space-y-6 items-center transition-all ease-in-out duration-250 text-xl">
                        <Component {...pageProps} />
                    </div>
                </div>
            </div>
        </div>
    </PagewideContext.Provider>;
}

export default MyApp;
