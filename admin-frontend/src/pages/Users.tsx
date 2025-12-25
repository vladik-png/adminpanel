import * as React from 'react';
import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Mail, Calendar, ShieldCheck, Search, UserCircle, X, Shield, Settings, Trash2, UserX, Download } from 'lucide-react';

interface UserData {
  user_id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  created_at: string;
  avatar_url: string;
}

const Users: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      if (res.data.status === 'success' || res.data.results) {
        setUsers(res.data.results);
      }
    } catch (err) {
      console.error("Помилка завантаження користувачів:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

 const exportToCSV = () => {
    const delimiter = ";";
    
    const headers = ["User ID", "Username", "First Name", "Last Name", "Email", "Joined Date"].join(delimiter);
    
    const dataRows = filteredUsers.map(u => 
      [
        u.user_id,
        u.username,
        u.first_name,
        u.last_name,
        u.email,
        new Date(u.created_at).toLocaleDateString()
      ].join(delimiter)
    );

    const csvContent = "\uFEFF" + [headers, ...dataRows].join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `users_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    
    link.click();
    document.body.removeChild(link);
  };

  const filteredUsers = users.filter(u => {
    const search = searchTerm.toLowerCase();
    return (
      u.username.toLowerCase().includes(search) ||
      u.email.toLowerCase().includes(search) ||
      u.first_name.toLowerCase().includes(search) ||
      u.last_name.toLowerCase().includes(search)
    );
  });

  const themeColor = '#0f172a';

  return (
    <div className="w-full flex flex-col bg-[#f8fafc] min-h-screen font-medium relative">
      {}
      <div style={{ backgroundColor: themeColor }} className="py-4 px-10 flex justify-between items-center sticky top-0 z-50 shadow-md text-white">
        <div className="flex items-center gap-2">
           <ShieldCheck size={16} className="text-blue-400" />
           <h2 className="text-sm tracking-widest uppercase font-bold">Staff Management System</h2>
        </div>
        
        <div className="flex items-center gap-4">
          {}
          <button 
            onClick={exportToCSV}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-[10px] px-4 py-2.5 rounded-xl transition-all uppercase tracking-widest font-black shadow-lg shadow-blue-900/20 active:scale-95"
          >
            <Download size={14} />
            Export CSV
          </button>

          <div className="relative w-64 text-white">
            <input 
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-white text-[11px] px-10 py-2.5 rounded-xl focus:outline-none focus:border-blue-500 transition-all placeholder:text-slate-500 uppercase tracking-widest"
            />
            <Search size={14} className="absolute left-3 top-3 text-slate-500" />
          </div>
        </div>
      </div>

      <div className="p-10 w-full">
        {}
        <div className="mb-10 border-b border-slate-200 pb-8 flex justify-between items-end">
          <div>
            <h1 className="text-4xl text-slate-800 uppercase tracking-tighter font-black">Customer Base Control</h1>
            <p className="text-slate-400 mt-1 uppercase text-[10px] tracking-[0.3em]">Registered Users Database</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Total Users Found</p>
            <p className="text-3xl font-black text-blue-600 tracking-tighter">{filteredUsers.length}</p>
          </div>
        </div>

        {}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            {filteredUsers.map((worker) => (
              <div key={worker.user_id} className="bg-white rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-lg transition-all p-6 group">
                <div className="flex items-start gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 overflow-hidden border-2 border-slate-50">
                    {worker.avatar_url ? <img src={worker.avatar_url} className="w-full h-full object-cover" /> : <UserCircle size={40} className="m-auto mt-3 text-slate-300" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-black text-slate-800 truncate tracking-tight uppercase">{worker.first_name} {worker.last_name}</h3>
                    <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest">@{worker.username}</p>
                  </div>
                </div>
                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-3 text-slate-500 bg-slate-50 p-3 rounded-xl">
                    <Mail size={14} className="text-slate-400" />
                    <span className="text-xs truncate">{worker.email}</span>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedUser(worker)}
                  className="w-full mt-6 py-4 bg-slate-50 text-slate-400 text-[10px] uppercase tracking-[0.3em] font-black rounded-xl group-hover:bg-[#0f172a] group-hover:text-white transition-all shadow-sm"
                >
                  View Profile
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {}
      {selectedUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setSelectedUser(null)}>
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-300" onClick={(e) => e.stopPropagation()}>
            {}
            <div className="h-32 bg-[#0f172a] relative">
              <button onClick={() => setSelectedUser(null)} className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full"><X size={20} /></button>
            </div>
            <div className="px-12 pb-12">
                <div className="relative -mt-16 mb-8 flex items-end gap-6">
                    <div className="w-32 h-32 rounded-[2.5rem] bg-white p-2 shadow-xl">
                        <div className="w-full h-full rounded-[2rem] bg-slate-100 overflow-hidden">
                            {selectedUser.avatar_url ? <img src={selectedUser.avatar_url} className="w-full h-full object-cover" /> : <UserCircle size={100} className="m-auto mt-4 text-slate-300" />}
                        </div>
                    </div>
                    <div className="pb-2">
                        <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">{selectedUser.first_name} {selectedUser.last_name}</h2>
                        <p className="text-blue-600 font-bold uppercase tracking-[0.2em] text-[10px]">Verified Account @{selectedUser.username}</p>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-6 mb-10">
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                        <p className="text-[9px] text-slate-400 uppercase font-bold mb-1">Email</p>
                        <p className="text-slate-800 font-bold truncate text-sm">{selectedUser.email}</p>
                    </div>
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                        <p className="text-[9px] text-slate-400 uppercase font-bold mb-1">Joined</p>
                        <p className="text-slate-800 font-bold truncate text-sm">{new Date(selectedUser.created_at).toLocaleDateString()}</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <button className="flex-1 py-4 bg-[#0f172a] text-white rounded-2xl text-[10px] uppercase tracking-[0.4em] font-black hover:opacity-90 transition-all shadow-lg">Coming Soon</button>
                    <button className="p-4 border border-slate-200 text-rose-500 rounded-2xl hover:bg-rose-50 transition-all"><Trash2 size={20} /></button>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;