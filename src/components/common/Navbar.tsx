import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogIn, Menu, MessageCircle } from "lucide-react";
import { Link, useLocation } from "@tanstack/react-router";
import { useUser } from "@/context/UserContext";
import { useChat } from "@/context/ChatContext";
import Sidebar from "./Sidebar";
import Logo from "./Logo";

const Navbar = () => {
    const { user } = useUser();
    const { unreadMessages, markAllAsRead } = useChat();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);
    
    const handleChatClick = () => {
      markAllAsRead();
    };

    return (
        <>
            <nav className="bg-black/10 shadow-lg border-b border-white/10 px-4 py-2 flex justify-between items-center z-50 backdrop-blur-md w-full h-14 fixed top-0 z-100">
                <Button variant="ghost" onClick={() => setMenuOpen(true)} className={`text-white ${user ? "" : "hidden"}`}>
                    <Menu className="h-6 w-6" />
                </Button>
                <Logo />

                <div className="flex items-center gap-3">
                    {user && (
                        <Link to="/chat" onClick={handleChatClick} className="relative">
                            <Button variant="ghost" className="text-white hover:bg-white color-black  rounded-10 w-9 h-9 p-0 cursor-pointer">
                                <MessageCircle className="h-5 w-5" />
                            </Button>
                            {unreadMessages > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs text-black font-bold border-2 border-black">
                                    {unreadMessages > 9 ? '9+' : unreadMessages}
                                </span>
                            )}
                        </Link>
                    )}
                    
                    {user ? (
                        <Link to="/settings">
                            <Avatar className="cursor-pointer hover:ring-2 hover:ring-white transition-all">
                                {user?.avatarUrl ? (
                                    <AvatarImage src={user.avatarUrl} alt="user avatar" />
                                ) : (
                                    <AvatarFallback className="bg-white/20 text-white font-semibold uppercase">
                                        {user.firstName?.charAt(0)}
                                        {user.lastName?.charAt(0)}
                                    </AvatarFallback>
                                )}
                            </Avatar>
                        </Link>
                    ) : (
                        <Button className="bg-white text-black hover:bg-white/80 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center" disabled={location.pathname === "/auth"}>
                            <Link to="/auth" className="flex items-center">
                                <LogIn className="mr-2 h-4 w-4" />
                                Zaloguj
                            </Link>
                        </Button>
                    )}
                </div>
            </nav>

            {user && <Sidebar isOpen={menuOpen} onClose={() => setMenuOpen(false)} />}
        </>
    );
};

export default Navbar;
