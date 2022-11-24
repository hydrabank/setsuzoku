import { useRouter } from "next/router";
import Link from "next/link";
import { IoClose } from "react-icons/io5";
export default function ServerListing(props) {
    const router = useRouter();

    const removeItem = async () => {
        const dialog = confirm("Are you sure you want to remove this server from your list?");
        if (dialog === true) {
            await window.setsuzoku.listing.remove(props.host);
            router.reload();
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