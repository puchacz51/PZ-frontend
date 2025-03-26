import { FaBolt } from "react-icons/fa";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";

interface LogoProps {
  className?: string;
}

const Logo = ({ className }: LogoProps) => {
  return (
    <Link to="/" className={cn("flex items-center gap-2 text-xl font-semibold text-white select-none", className)}>
      <FaBolt className="w-6 h-6 text-white opacity-80" />
      <span className="tracking-tight">
        <span className="text-white">Task</span>
        <span className="text-gray-400">It</span>
      </span>
    </Link>
  );
};

export default Logo;
