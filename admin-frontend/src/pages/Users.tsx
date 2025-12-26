import * as React from 'react';
import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Mail, Calendar, ShieldCheck, Search, UserCircle, X, Download, Trash2, Users as UsersIcon } from 'lucide-react';

interface UserData {
  user_id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  created_at: string;
  avatar_url: string;
  // Додаємо поля з твого curl
  bio?: string;
  followers?: number;
  followings?: number;
}

const Users: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      if (res.data && res.data.results) {
        setUsers(res.data.results);
      }
    } catch (err) {
      console.error("Помилка завантаження користувачів:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewProfile = async (worker: UserData) => {
    try {
      // Спочатку показуємо те, що є
      setSelectedUser(worker);
      
      // Довантажуємо Bio та статистику
      const res = await api.get(`http://13.62.214.254:8080/users/${worker.user_id}`);
      
      if (res.data && res.data.results) {
        setSelectedUser(prev => ({
          ...prev!,
          ...res.data.results,
          // Оскільки в curl email порожній, лишаємо той що був у списку
          email: prev?.email || res.data.results.email 
        }));
      }
    } catch (err) {
      console.error("Помилка деталей:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(u => {
    const search = searchTerm.toLowerCase();
    return (
      u.username.toLowerCase().includes(search) ||
      u.email.toLowerCase().includes(search) ||
      u.first_name.toLowerCase().includes(search) ||
      u.last_name.toLowerCase().includes(search)
    );
  });

  return (
    <div className="w-full flex flex-col bg-[#f8fafc] min-h-screen font-medium relative">
      {/* Header (дизайн не міняємо) */}
      <div className="bg-[#0f172a] py-4 px-10 flex justify-between items-center sticky top-0 z-50 shadow-md text-white">
        <div className="flex items-center gap-2">
           <ShieldCheck size={16} className="text-blue-400" />
           <h2 className="text-sm tracking-widest uppercase font-bold">Staff Management System</h2>
        </div>
        <div className="relative w-64">
          <input 
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 text-white text-[11px] px-10 py-2.5 rounded-xl outline-none"
          />
          <Search size={14} className="absolute left-3 top-3 text-slate-500" />
        </div>
      </div>

      <div className="p-10 w-full">
        <div className="mb-10 border-b border-slate-200 pb-8 flex justify-between items-end">
          <div>
            <h1 className="text-4xl text-slate-800 uppercase tracking-tighter font-black">Customer Base Control</h1>
            <p className="text-slate-400 mt-1 uppercase text-[10px] tracking-[0.3em]">Database Records</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
          {filteredUsers.map((worker) => (
            <div key={worker.user_id} className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-6 group">
              <div className="flex items-start gap-5">
                <img src={worker.avatar_url} className="w-16 h-16 rounded-2xl object-cover" />
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-black text-slate-800 truncate uppercase">{worker.first_name} {worker.last_name}</h3>
                  <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest">@{worker.username}</p>
                </div>
              </div>
              <button 
                onClick={() => handleViewProfile(worker)}
                className="w-full mt-6 py-4 bg-slate-50 text-slate-400 text-[10px] uppercase font-black rounded-xl group-hover:bg-[#0f172a] group-hover:text-white transition-all"
              >
                Inspect Profile
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL з доданим Біо */}
      {selectedUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedUser(null)}>
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden relative" onClick={(e) => e.stopPropagation()}>
            <div className="h-32 bg-[#0f172a] relative">
              <button onClick={() => setSelectedUser(null)} className="absolute top-6 right-6 p-2 text-white/50 hover:text-white"><X size={20} /></button>
            </div>
            
            <div className="px-12 pb-12">
                <div className="relative -mt-16 mb-8 flex items-end gap-6">
                    <img src={selectedUser.avatar_url} className="w-32 h-32 rounded-[2.5rem] border-8 border-white shadow-xl object-cover" />
                    <div className="pb-2">
                        <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">{selectedUser.first_name} {selectedUser.last_name}</h2>
                        <p className="text-blue-600 font-bold uppercase tracking-[0.2em] text-[10px]">@{selectedUser.username}</p>
                    </div>
                </div>

                {/* ДОДАНО: Статистика з твого curl */}
                <div className="flex gap-4 mb-6">
                    <div className="flex-1 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                        <p className="text-xl font-black text-slate-900">{selectedUser.followers || 0}</p>
                        <p className="text-[8px] uppercase font-bold text-slate-400">Followers</p>
                    </div>
                    <div className="flex-1 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                        <p className="text-xl font-black text-slate-900">{selectedUser.followings || 0}</p>
                        <p className="text-[8px] uppercase font-bold text-slate-400">Following</p>
                    </div>
                </div>

                {/* ДОДАНО: Блок Біографії (згідно з твоїм curl) */}
                {selectedUser.bio && (
                  <div className="mb-8 p-6 bg-blue-50/50 rounded-3xl border border-blue-100">
                    <p className="text-[9px] uppercase font-black text-blue-600 mb-2 tracking-widest">Biography</p>
                    <p className="text-slate-700 text-sm font-medium italic leading-relaxed">
                      "{selectedUser.bio}"
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-6 mb-10">
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                        <p className="text-[9px] text-slate-400 uppercase font-bold mb-1">Email Channel</p>
                        <p className="text-slate-800 font-bold truncate text-sm">{selectedUser.email || 'N/A'}</p>
                    </div>
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                        <p className="text-[9px] text-slate-400 uppercase font-bold mb-1">Created At</p>
                        <p className="text-slate-800 font-bold truncate text-sm">{new Date(selectedUser.created_at).toLocaleDateString()}</p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button className="flex-1 py-4 bg-[#0f172a] text-white rounded-2xl text-[10px] uppercase tracking-[0.4em] font-black shadow-lg">System Access</button>
                    <button className="p-4 border border-slate-200 text-rose-500 rounded-2xl hover:bg-rose-50"><Trash2 size={20} /></button>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;