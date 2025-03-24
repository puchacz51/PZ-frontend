import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogIn, Menu } from "lucide-react";
import { Link, useLocation } from "@tanstack/react-router";
import { useUser } from "@/context/UserContext";
import Sidebar from "./Sidebar";

const Navbar = () => {
    const { user } = useUser();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <>
            <nav className="bg-black/10 shadow-lg border-b border-white/10 px-4 py-2 flex justify-between items-center z-50 backdrop-blur-md w-full h-14 fixed">
                <Button variant="ghost" onClick={() => setMenuOpen(true)} className={`text-white ${user ? '' : "opacity-0"}`}>
                    <Menu className="h-6 w-6" />
                </Button>

                {user ? (
                    <Avatar className="cursor-pointer hover:ring-2 hover:ring-white transition-all">
                        {user?.avatarUrl ? <AvatarImage src={user.avatarUrl} alt="user avatar" /> : (
                            <AvatarFallback className="bg-white/20 text-white font-semibold uppercase">
                                {user.firstName?.charAt(0)}
                                {user.lastName?.charAt(0)}
                            </AvatarFallback>
                        )}
                    </Avatar>
                ) : (
                    <Button
                        className="bg-white text-black hover:bg-white/80 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                        disabled={location.pathname === "/auth"}
                    >
                        <Link to="/auth" className="flex items-center">
                            <LogIn className="mr-2 h-4 w-4" />
                            Zaloguj
                        </Link>
                    </Button>
                )}
            </nav>

            {user && <Sidebar isOpen={menuOpen} onClose={() => setMenuOpen(false)} />}
        </>
    );
};

export default Navbar;