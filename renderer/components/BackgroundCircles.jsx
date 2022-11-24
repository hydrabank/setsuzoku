export default function BackgroundCircles() {
    return (
        <div className="absolute -top-28 -left-16">
            <div className="absolute top-10 -left-2 w-72 h-72 bg-purple-300 rounded-full blur-md filter opacity-100 animate-blob"></div>
            <div className="absolute top-10 left-24 w-72 h-72 bg-red-300 rounded-full blur-md filter opacity-100 animate-blob animation-delay-2000"></div>
            <div className="absolute top-20 left-4 w-72 h-72 bg-yellow-300 rounded-full blur-md filter opacity-70 animate-blob animation-delay-4000"></div>
        </div>
    )
};