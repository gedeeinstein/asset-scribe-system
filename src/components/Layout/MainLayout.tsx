
import React from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { Sidebar } from "./Sidebar";

interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const MainLayout = ({ children, title = "Asset Scribe System" }: MainLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-white border-b h-16 flex items-center justify-between px-6">
            <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
                <span className="sr-only">Notifications</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                </svg>
              </button>
              <div className="relative">
                <button className="flex items-center focus:outline-none">
                  <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center">
                    <span className="text-sm font-medium">AD</span>
                  </div>
                  <span className="ml-2 text-gray-700">Admin User</span>
                </button>
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
