
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Sidebar as SidebarContainer,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  Layers, 
  Cpu, 
  Monitor, 
  Wrench,
  Database
} from "lucide-react";

export const Sidebar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const items = [
    {
      title: "Dashboard",
      path: "/",
      icon: LayoutDashboard,
    },
    {
      title: "Assets",
      path: "/assets",
      icon: Monitor,
    },
    {
      title: "Maintenance",
      path: "/maintenance",
      icon: Wrench,
    },
    {
      title: "Master Data",
      items: [
        {
          title: "Users",
          path: "/users",
          icon: Users,
        },
        {
          title: "Divisions",
          path: "/divisions",
          icon: Building2,
        },
        {
          title: "Categories",
          path: "/categories",
          icon: Layers,
        },
        {
          title: "Components",
          path: "/components",
          icon: Cpu,
        }
      ]
    },
  ];

  return (
    <SidebarContainer>
      <div className="pt-4 pb-2 px-4 flex items-center">
        <Database className="h-6 w-6 text-white" />
        <span className="ml-3 text-lg font-bold text-white">AssetScribe</span>
      </div>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item, index) => {
                // Check if the item has sub-items
                if ('items' in item) {
                  return (
                    <React.Fragment key={index}>
                      <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
                      <SidebarGroupContent>
                        <SidebarMenu>
                          {item.items.map((subItem, subIndex) => (
                            <SidebarMenuItem key={`${index}-${subIndex}`}>
                              <SidebarMenuButton asChild active={isActive(subItem.path)}>
                                <Link to={subItem.path} className="flex items-center">
                                  <subItem.icon className="mr-2 h-5 w-5" />
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          ))}
                        </SidebarMenu>
                      </SidebarGroupContent>
                    </React.Fragment>
                  );
                }
                
                // Regular menu item without subitems
                return (
                  <SidebarMenuItem key={index}>
                    <SidebarMenuButton asChild active={isActive(item.path)}>
                      <Link to={item.path} className="flex items-center">
                        <item.icon className="mr-2 h-5 w-5" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </SidebarContainer>
  );
};
