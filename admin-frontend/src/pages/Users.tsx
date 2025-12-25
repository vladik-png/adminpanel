import * as React from 'react';
import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Mail, Calendar, ShieldCheck, Search, UserCircle, X, Shield, Settings, Trash2, UserX } from 'lucide-react';

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
      <div style={{ backgroundColor: themeColor }} className="py-4 px-10 flex justify-between items-center sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-2">
           <ShieldCheck size={16} className="text-blue-400" />
           <h2 className="text-sm text-white tracking-widest uppercase font-bold">Staff Management System</h2>
        </div>
        
        {}
        <div className="relative w-80">
          <input 
            type="text"
            placeholder="Search by name, username or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 text-white text-[11px] px-10 py-2.5 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-500 uppercase tracking-widest"
          />
          <Search size={14} className="absolute left-3 top-3 text-slate-500" />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-3 text-slate-500 hover:text-white"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="p-10 w-full">
        {}
        <div className="mb-10 border-b border-slate-200 pb-8 flex justify-between items-end">
          <div>
            <h1 className="text-4xl text-slate-800 uppercase tracking-tighter font-black italic">Customer Base Control</h1>
            <p className="text-slate-400 mt-1 uppercase text-[10px] tracking-[0.3em]">Registered Users Database</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Total Users Found</p>
            <p className="text-3xl font-black text-blue-600 tracking-tighter">{filteredUsers.length}</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800"></div>
          </div>
        ) : (
          <>
            {}
            {filteredUsers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
                <div className="p-6 bg-slate-50 rounded-full text-slate-300 mb-4">
                  <UserX size={48} />
                </div>
                <h3 className="text-xl font-black text-slate-800 uppercase italic">No Matches Found</h3>
                <p className="text-slate-400 text-xs uppercase tracking-widest mt-2">Try different keywords or clear the search</p>
                <button 
                  onClick={() => setSearchTerm('')}
                  className="mt-6 text-blue-500 text-[10px] uppercase font-bold border-b border-blue-500 pb-1 hover:text-blue-600 transition-colors"
                >
                  Clear search filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                {filteredUsers.map((worker) => (
                  <div key={worker.user_id} className="bg-white rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all p-6 group">
                    <div className="flex items-start gap-5">
                      <div className="relative">
                        <div className="w-16 h-16 rounded-2xl bg-slate-100 overflow-hidden border-2 border-slate-50">
                          {worker.avatar_url ? (
                            <img src={worker.avatar_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                              <UserCircle size={40} />
                            </div>
                          )}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-black text-slate-800 truncate tracking-tight uppercase italic">
                          {worker.first_name} {worker.last_name}
                        </h3>
                        <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest mb-3">
                          @{worker.username}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 space-y-3">
                      <div className="flex items-center gap-3 text-slate-500 bg-slate-50 p-3 rounded-xl">
                        <Mail size={14} className="text-slate-400" />
                        <span className="text-xs truncate">{worker.email}</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-slate-400 px-1 font-bold">
                        <div className="flex items-center gap-2">
                          <Calendar size={12} />
                          <span>ID: {worker.user_id}</span>
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={() => setSelectedUser(worker)}
                      className="w-full mt-6 py-4 bg-slate-50 text-slate-400 text-[10px] uppercase tracking-[0.3em] font-black rounded-xl group-hover:bg-[#0f172a] group-hover:text-white transition-all shadow-sm active:scale-95"
                    >
                      View Profile
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {}
      {selectedUser && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setSelectedUser(null)}
        >
          <div 
            className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-32 bg-[#0f172a] relative">
              <button 
                onClick={() => setSelectedUser(null)}
                className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <div className="px-12 pb-12">
              <div className="relative -mt-16 mb-8 flex items-end gap-6">
                <div className="w-32 h-32 rounded-[2.5rem] bg-white p-2 shadow-xl">
                  <div className="w-full h-full rounded-[2rem] bg-slate-100 overflow-hidden">
                    {selectedUser.avatar_url ? (
                      <img src={selectedUser.avatar_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <UserCircle size={100} />
                      </div>
                    )}
                  </div>
                </div>
                <div className="pb-2">
                  <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic">
                    {selectedUser.first_name} {selectedUser.last_name}
                  </h2>
                  <p className="text-blue-600 font-bold uppercase tracking-[0.2em] text-[10px]">
                    Verified Account @{selectedUser.username}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-10">
                <InfoBlock icon={<Mail size={16}/>} label="Email" value={selectedUser.email} />
                <InfoBlock icon={<Calendar size={16}/>} label="Joined" value={new Date(selectedUser.created_at).toLocaleDateString()} />
                <InfoBlock icon={<Shield size={16}/>} label="UID" value={`#${selectedUser.user_id}`} />
                <InfoBlock icon={<Settings size={16}/>} label="Status" value="Standard User" />
              </div>

              <div className="flex gap-4">
                <button className="flex-1 py-4 bg-[#0f172a] text-white rounded-2xl text-[10px] uppercase tracking-[0.4em] font-black hover:opacity-90 transition-all shadow-lg active:scale-95">
                  Coming Soon
                </button>
                <button className="p-4 border border-slate-200 text-rose-500 rounded-2xl hover:bg-rose-50 transition-all">
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const InfoBlock = ({ icon, label, value }: { icon: any, label: string, value: string }) => (
  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
    <div className="flex items-center gap-2 mb-2 text-slate-400">
      {icon}
      <span className="text-[9px] uppercase tracking-widest font-black">{label}</span>
    </div>
    <p className="text-slate-800 font-bold truncate text-sm">{value}</p>
  </div>
);

export default Users;