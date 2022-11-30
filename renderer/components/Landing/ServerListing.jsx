import { useContext } from 'react';
import { useRouter } from "next/router";
import Link from "next/link";
import { IoClose } from "react-icons/io5";
import { PagewideContext } from '/components/Contexts/PagewideContext';

export default function ServerListing(props) {
    const { context, setContext } = useContext(PagewideContext);

    const removeItem = async () => {
        setContext({
            ...context,
            dialog: {
                open: true,
                type: "confirmDeletion",
                props: {
                    id: props.host,
                    name: props.displayName
                }
            }
        })
        console.log(context)
        if (context === true) {
            await window.setsuzoku.listing.remove(props.host);
            window?.setsuzoku?.router.push("/");
        };
    };

    return (
        <div key={props.index} className="flex flex-row rounded-2xl w-full px-8 py-4 bg-gray-50 hover:bg-gray-300 text-black items-center justify-between animation-preset-brand">
            <Link href={`/connect/${props.host}`} className="text-xl font-bold font-Inter hover:text-gray-800 animation-preset-brand">{props.displayName}</Link>
            <button onClick={removeItem}>
                <IoClose className="text-2xl text-red-500 hover:text-red-700 animation-preset-brand" />
            </button>
        </div>
    );
};