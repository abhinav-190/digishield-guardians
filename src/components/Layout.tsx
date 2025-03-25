
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import { cn } from '@/lib/utils';

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} />
      
      <div 
        className={cn(
          "min-h-screen transition-all duration-300 ease-in-out",
          sidebarOpen ? "md:ml-64" : "md:ml-0"
        )}
      >
        <Header onMenuToggle={toggleSidebar} isSidebarOpen={sidebarOpen} />
        
        <main className="container max-w-7xl py-6 px-4 sm:px-6 animate-fade-in">
          <Outlet />
        </main>
      </div>
      
      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/50 md:hidden" 
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
};

export default Layout;
