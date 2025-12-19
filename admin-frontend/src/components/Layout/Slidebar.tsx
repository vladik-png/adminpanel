import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, ShieldAlert, Server, BarChart3, Newspaper } from 'lucide-react';

const Sidebar: React.FC = () => {
  const location = useLocation();
  
  const menuItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20}/> },
    { name: 'Users', path: '/users', icon: <Users size={20}/> },
    { name: 'Moderation', path: '/moderation', icon: <ShieldAlert size={20}/> },
    { name: 'AWS Server', path: '/infrastructure', icon: <Server size={20}/> },
    { name: 'Analytics', path: '/analytics', icon: <BarChart3 size={20}/> },
  ];

  return (
    <div className="w-64 bg-slate-900 text-slate-300 flex flex-col min-h-screen fixed left-0 top-0">
      <div className="p-6 text-white font-bold text-xl border-b border-slate-800 flex items-center gap-2">
        <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center text-xs">AWS</div>
        ADMIN PANEL
      </div>
      
      <nav className="flex-1 mt-6 px-4">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-all ${
              location.pathname === item.path 
              ? 'bg-orange-600 text-white shadow-lg' 
              : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            {item.icon}
            <span className="text-sm font-medium">{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 px-2 py-3 bg-slate-800/50 rounded-lg border border-slate-700">
          <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center text-[10px] font-bold">VP</div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-white truncate">vladik-png</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-tighter">System Admin</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;