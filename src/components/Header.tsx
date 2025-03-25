
import React, { useState } from 'react';
import { Bell, Menu, Shield, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  onMenuToggle: () => void;
  isSidebarOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle, isSidebarOpen }) => {
  const [notifications, setNotifications] = useState(3);

  return (
    <header className="sticky top-0 z-30 w-full border-b border-white/5 bg-background/80 backdrop-blur-md">
      <div className="flex h-16 items-center px-4 sm:px-6">
        <div className="flex items-center gap-3 md:gap-5">
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden" 
            onClick={onMenuToggle}
          >
            {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-semibold hidden md:inline-block">Digishield</span>
          </div>
        </div>
        
        <div className="ml-auto flex items-center gap-2">
          <div className="relative">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  {notifications}
                </span>
              )}
            </Button>
          </div>
          
          <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
            <span className="text-xs font-medium">DS</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
