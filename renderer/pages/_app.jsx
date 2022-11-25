import React from 'react';
import { Inter } from '@next/font/google';
import BackgroundCircles from '/components/BackgroundCircles';
import Image from 'next/image';
import { CgInfinity, CgAdd } from 'react-icons/cg';

import '../styles/globals.css';
const inter = Inter({ subsets: ['latin'], variable: "--font-inter" });

function MyApp({ Component, pageProps }) {
  return <>
    <div className={`${inter.variable}`}>
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
  </>;
}

export default MyApp;
