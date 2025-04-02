import { Outlet } from "@tanstack/react-router";
import Navbar from "./Navbar";

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-black pt-14">
      <Navbar />
      <main className="flex-1 ">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
