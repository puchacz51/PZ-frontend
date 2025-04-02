import Background from "@/components/ui/Background";
import { FaBolt } from "react-icons/fa";
import stars from "/public/media/stars.webm";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserContext";
import { Link } from "@tanstack/react-router";

const HomePage = () => {
    const { user } = useUser();

    const renderLogIn = () => {
        return (
            <Link to="/auth" className="flex items-center mix-blend-difference">
                <Button className="mix-blend-difference mt-6 bg-white/5 text-white border-2 border-white text-xl hover:bg-white hover:text-black font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center px-6 py-3 rounded-xl shadow-lg backdrop-blur-sm transition-all hover:shadow-white/40 duration-700 ease-in-out">
                    Zacznij już dziś 🚀
                </Button>
            </Link>
        );
    };

    return (
        <div className="relative w-screen h-screen overflow-hidden">
            <Background videoSrc={stars} isFixed={true} playbackRate={1.0} />

            <div className="relative flex flex-col justify-center items-center min-h-full px-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white mix-blend-difference text-center flex items-center mb-5">
                    <span>Organizuj</span>
                    <FaBolt className="mx-3 text-white mix-blend-difference" />
                    <span>Zwyciężaj</span>
                </h1>
                {!user && renderLogIn()}
            </div>
        </div>
    );
};

export default HomePage;
