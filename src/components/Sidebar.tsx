
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Shield, BarChart, Activity, Zap, Database, Search, Lock, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const navItems = [
    { to: '/', icon: <BarChart className="h-5 w-5" />, label: 'Dashboard' },
    { to: '/threats', icon: <Shield className="h-5 w-5" />, label: 'Threat Analysis' },
    { to: '/traffic', icon: <Activity className="h-5 w-5" />, label: 'Traffic Monitor' },
    { to: '/api', icon: <Zap className="h-5 w-5" />, label: 'API Security' },
    { to: '/network', icon: <Database className="h-5 w-5" />, label: 'Network Graph' },
    { to: '/scan', icon: <Search className="h-5 w-5" />, label: 'Security Scanner' },
    { to: '/encryption', icon: <Lock className="h-5 w-5" />, label: 'Encryption' },
  ];

  return (
    <aside 
      className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 border-r border-white/5 bg-background transition-transform duration-300 ease-in-out md:translate-x-0 scroll-container",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex h-16 items-center justify-center border-b border-white/5">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          <span className="text-xl font-semibold">Digishield</span>
        </div>
      </div>
      
      <div className="py-4">
        <div className="px-4 pb-2">
          <p className="text-xs uppercase text-muted-foreground">Main Navigation</p>
        </div>
        
        <nav className="grid gap-1 px-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => 
                cn("nav-item", isActive && "active")
              }
              end={item.to === "/"}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 border-t border-white/5 p-4">
        <NavLink to="/settings" className={({ isActive }) => 
          cn("nav-item", isActive && "active")
        }>
          <Settings className="h-5 w-5" />
          <span>Settings</span>
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
