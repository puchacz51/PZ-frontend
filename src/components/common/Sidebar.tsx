import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { LogOut, MessageCircle, FolderKanban, Mail, X } from "lucide-react";
import clsx from "clsx";
import { useUser } from "@/context/UserContext";

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
    const { logout } = useUser();

    const handleLogout = () => {
        logout();
        onClose();
    };

    return (
        <>
            <div className={clsx(
                "fixed top-0 left-0 h-screen w-64 bg-black border-r border-white/10 shadow-lg z-50 transition-transform duration-300 ease-in-out",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="flex flex-col h-full">
                    {/* Górna część: nagłówek */}
                    <div className="flex items-center justify-between p-4 border-b border-white/10 h-14">
                        <span className="text-white text-lg font-semibold">Menu</span>
                        <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/10">
                            <X className="text-white" />
                        </Button>
                    </div>

                    {/* Środkowa część: linki + logout na dole */}
                    <div className="flex flex-col justify-between flex-1 p-4 text-white">
                        <div className="flex flex-col space-y-2">
                            <Link to="/projects" onClick={onClose} className="flex items-center gap-2 hover:underline hover:font-semibold">
                                <FolderKanban size={18} />
                                Projects
                            </Link>
                            <Link to="/kontakt" onClick={onClose} className="flex items-center gap-2 hover:underline hover:font-semibold">
                                <Mail size={18} />
                                Kontakt
                            </Link>
                            <Link to="/chat" onClick={onClose} className="flex items-center gap-2 hover:underline hover:font-semibold">
                                <MessageCircle size={18} />
                                Chat
                            </Link>
                        </div>

                        <Button
                            variant="ghost"
                            className="text-left justify-start text-white hover:bg-white/10 mt-4"
                            onClick={handleLogout}
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            Wyloguj
                        </Button>
                    </div>
                </div>
            </div>

            {isOpen && <div className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm" onClick={onClose} />}
        </>
    );
};

export default Sidebar;
