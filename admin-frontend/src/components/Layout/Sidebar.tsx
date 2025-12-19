import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, ShieldAlert, Server, BarChart3 } from 'lucide-react';

const Sidebar: React.FC = () => {
  const location = useLocation();
  
  const menuItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={18}/> },
    { name: 'Users', path: '/users', icon: <Users size={18}/> },
    { name: 'Moderation', path: '/moderation', icon: <ShieldAlert size={18}/> },
    { name: 'AWS Server', path: '/infrastructure', icon: <Server size={18}/> },
    { name: 'Analytics', path: '/analytics', icon: <BarChart3 size={18}/> },
  ];

  return (
    <div className="w-64 bg-[#0f172a] text-slate-400 flex flex-col min-h-screen fixed left-0 top-0 shadow-xl border-r border-slate-800/50">
      <div className="p-8 text-white font-medium text-xl tracking-tight italic">
        Leafy <span className="text-blue-400 not-italic">Admin</span>
      </div>
      
      <nav className="flex-1 mt-4 px-4">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-all duration-200 ${
              location.pathname === item.path 
              ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20' 
              : 'hover:bg-slate-800/50 hover:text-slate-200'
            }`}
          >
            {item.icon}
            <span className="text-[13px] font-medium uppercase tracking-wider">{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800/50">
        <div className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-xl border border-slate-800/50">
          <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center text-[10px] font-medium text-blue-400 border border-blue-600/30 uppercase">VP</div>
          <div className="overflow-hidden">
            <p className="text-[11px] font-medium text-slate-200 truncate uppercase">vladik-png</p>
            <p className="text-[9px] text-slate-500 font-medium uppercase tracking-tighter">System Admin</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;