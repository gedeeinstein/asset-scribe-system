
import { Outlet } from "react-router-dom";
import { Sidebar, SidebarContent, SidebarTrigger } from "@/components/ui/sidebar";
import Navbar from "./Navbar";
import SideNav from "./SideNav";

const MainLayout = () => {
  return (
    <div className="min-h-screen flex w-full">
      <Sidebar>
        <SidebarContent>
          <SideNav />
        </SidebarContent>
      </Sidebar>
      <div className="flex flex-col flex-1">
        <Navbar />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
