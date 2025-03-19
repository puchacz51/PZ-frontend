import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { LogOut, LogIn } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { IUser } from '@/types/user';

const Navbar = ({ user, onLogout }: Props) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <nav className="bg-black shadow-lg border-b border-white/10 px-4 py-2 flex justify-end">
      <div className="relative">
        {user ? (
          <Avatar
            onClick={toggleMenu}
            className="cursor-pointer hover:ring-2 hover:ring-white transition-all"
          >
            {user?.avatarUrl ? (
              <AvatarImage src={user.avatarUrl} alt="user avatar" />
            ) : (
              <AvatarFallback className="bg-white/20 text-white font-semibold uppercase">
                {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
              </AvatarFallback>
            )}
          </Avatar>
        ) : (
          <Button asChild className="bg-white text-black hover:bg-white/80 font-semibold transition-colors">
            <Link to="/auth">
              <LogIn className="mr-2 h-4 w-4" /> Zaloguj
            </Link>
          </Button>
        )}

        {menuOpen && user && (
          <div className="absolute right-0 mt-2 w-40 bg-black border border-white/20 shadow-xl rounded-lg z-50">
            <Button
              variant="ghost"
              className="w-full justify-start text-white hover:bg-white/10"
              onClick={onLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Wyloguj
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

interface Props {
  user?: IUser;
  onLogout: () => void;
}