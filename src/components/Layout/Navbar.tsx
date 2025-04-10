
import { Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <header className="border-b px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <SidebarTrigger />
        </div>
        <h1 className="text-xl font-semibold">IT Inventory Management</h1>
        <div className="flex items-center gap-4 flex-1 justify-end">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

import { SidebarTrigger } from "@/components/ui/sidebar";
export default Navbar;
