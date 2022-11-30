import React, { useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { CgInfinity, CgAdd } from 'react-icons/cg';
import ServerListing from '/components/Landing/ServerListing';
import { PagewideContext } from '/components/Contexts/PagewideContext';

function Home() {
    const [ servers, setServers ] = React.useState([]);
    const [ loading, setLoading ] = React.useState(true);

    useEffect(() => {
        async function getServers() {
            const servers = await window.setsuzoku.listing.list();
            setServers(servers);
            setLoading(false);
        };
        getServers();
    }, []);
    return (
        <React.Fragment>
            <Head>
                <title>Home - Setsuzoku</title>
            </Head>
            <h1 className="text-4xl font-bold font-Inter md:text-right text-center bg-clip-text text-transparent text-gradient-brand">Select a server</h1>
            <Link href="add" className="flex flex-col gap-y-4 w-full">
                <div className="flex flex-row rounded-2xl w-full px-8 py-4 bg-gray-50 text-black items-center justify-evenly">
                    <CgAdd className="text-2xl" />
                    <h1 className="text-xl font-bold font-Inter">Add a server</h1>
                </div>
            </Link>
            {
                !loading && servers.map((server, index) => (
                    <ServerListing {...server} key={index} />
                ))
            }
        </React.Fragment>
    );
}

export default Home;
