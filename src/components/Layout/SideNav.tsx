
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Monitor, 
  Users, 
  Building2, 
  Tags, 
  Cpu, 
  Wrench 
} from "lucide-react";
import { 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton 
} from "@/components/ui/sidebar";

const navItems = [
  { title: "Dashboard", path: "/", icon: LayoutDashboard },
  { title: "Assets", path: "/assets", icon: Monitor },
  { title: "Users", path: "/users", icon: Users },
  { title: "Divisions", path: "/divisions", icon: Building2 },
  { title: "Categories", path: "/categories", icon: Tags },
  { title: "Components", path: "/components", icon: Cpu },
  { title: "Maintenance", path: "/maintenance", icon: Wrench }
];

const SideNav = () => {
  const location = useLocation();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>IT Inventory</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild isActive={location.pathname === item.path}>
                <Link to={item.path}>
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export default SideNav;
