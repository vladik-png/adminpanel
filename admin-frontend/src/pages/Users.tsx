import * as React from 'react';
import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { 
  Mail, Calendar, ShieldCheck, Search, UserCircle, X, 
  Download, Trash2, Clock, ChevronDown, SlidersHorizontal 
} from 'lucide-react';

interface UserData {
  user_id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  created_at: string;
  avatar_url: string;
  bio?: string;
  followers?: number;
  followings?: number;
}

const Users: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserData[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  const [sortType, setSortType] = useState<'newest' | 'oldest' | 'az' | 'za'>('newest');

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
      setSelectedUser(worker);
      const res = await api.get(`http://13.62.214.254:8080/users/${worker.user_id}`);
      if (res.data && res.data.results) {
        setSelectedUser(prev => ({
          ...prev!,
          ...res.data.results,
          email: prev?.email || res.data.results.email 
        }));
      }
    } catch (err) { console.error("Помилка деталей:", err); }
  };

  const exportToCSV = () => {
    const delimiter = ";";
    const headers = ["User ID", "Username", "First Name", "Last Name", "Email", "Joined Date"].join(delimiter);
    const dataRows = processedUsers.map(u => [
      u.user_id, u.username, u.first_name, u.last_name, u.email, 
      new Date(u.created_at).toLocaleDateString('uk-UA')
    ].join(delimiter));

    const csvContent = "\uFEFF" + [headers, ...dataRows].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `cinelink_users_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => { fetchUsers(); }, []);

  const processedUsers = useMemo(() => {
    let result = users.filter(u => {
      const search = searchTerm.toLowerCase();
      return (
        u.username.toLowerCase().includes(search) ||
        u.email.toLowerCase().includes(search) ||
        u.first_name.toLowerCase().includes(search) ||
        u.last_name.toLowerCase().includes(search)
      );
    });

    result.sort((a, b) => {
      if (sortType === 'az') return a.first_name.localeCompare(b.first_name);
      if (sortType === 'za') return b.first_name.localeCompare(a.first_name);
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortType === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [users, searchTerm, sortType]);

  return (
    <div className="w-full flex flex-col bg-[#f8fafc] min-h-screen font-medium relative">
      {}
      <div className="bg-[#0f172a] py-4 px-10 flex justify-between items-center sticky top-0 z-50 shadow-md text-white border-b border-slate-800">
        <div className="flex items-center gap-2">
           <ShieldCheck size={16} className="text-[#3b82f6]" />
           <h2 className="text-sm tracking-widest uppercase font-bold text-white">User Management System</h2>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative w-72">
            <input 
              type="text" 
              placeholder="Search user..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              className="w-full bg-slate-800/50 border border-slate-700 text-white text-[11px] px-10 py-3 rounded-xl outline-none focus:border-[#3b82f6] transition-all placeholder:text-slate-600" 
            />
            <Search size={14} className="absolute left-3 top-3.5 text-slate-500" />
          </div>
        </div>
      </div>

      <div className="p-10 w-full">
        <div className="mb-10 border-b border-slate-200 pb-8 flex justify-between items-end">
          <div>
            <h1 className="text-4xl text-slate-900 uppercase tracking-tighter font-black leading-none">Users List</h1>
            <p className="text-slate-400 mt-2 uppercase text-[10px] tracking-[0.4em]">Node records: {processedUsers.length}</p>
          </div>

          {}
          <div className="flex items-center gap-3">
            
            {}
            <button 
              onClick={exportToCSV}
              className="flex items-center gap-3 bg-[#0f172a] border border-slate-800 text-[#3b82f6] text-[11px] font-black uppercase px-6 py-4 rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 active:scale-95"
            >
              <Download size={14} />
              <span>Export CSV</span>
            </button>

            {}
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3b82f6]">
                <SlidersHorizontal size={12} />
              </div>
              <select 
                value={sortType}
                onChange={(e) => setSortType(e.target.value as any)}
                className="appearance-none bg-[#0f172a] border border-slate-800 text-[#3b82f6] text-[11px] font-black uppercase pl-11 pr-12 py-4 rounded-2xl outline-none hover:bg-slate-800 transition-all cursor-pointer shadow-xl shadow-slate-900/20 active:scale-95"
              >
                <option value="newest">Sort: Newest</option>
                <option value="oldest">Sort: Oldest</option>
                <option value="az">Sort: A-Z</option>
                <option value="za">Sort: Z-A</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#3b82f6] pointer-events-none">
                <ChevronDown size={14} />
              </div>
            </div>
          </div>
        </div>

        {}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
          {processedUsers.map((worker) => (
            <div key={worker.user_id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-7 group hover:shadow-xl transition-all duration-300">
              <div className="flex items-start gap-5">
                <img src={worker.avatar_url} className="w-16 h-16 rounded-[1.2rem] object-cover shadow-sm border border-slate-100" alt="avatar" />
                <div className="flex-1 min-w-0">
                  <h3 className="text-[17px] font-black text-slate-900 truncate uppercase leading-tight">{worker.first_name} {worker.last_name}</h3>
                  <p className="text-[10px] text-[#3b82f6] font-bold uppercase tracking-widest mt-1">@{worker.username}</p>
                  
                  <div className="flex items-center gap-2 mt-3">
                    <Calendar size={11} className="text-slate-400" />
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider leading-none pt-0.5">
                      Joined {new Date(worker.created_at).toLocaleDateString('uk-UA')}
                    </span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => handleViewProfile(worker)}
                className="w-full mt-7 py-4 bg-slate-50 text-slate-400 text-[10px] uppercase font-black rounded-xl group-hover:bg-[#0f172a] group-hover:text-white transition-all shadow-sm active:scale-95"
              >
                Inspect Profile
              </button>
            </div>
          ))}
        </div>
      </div>

      {}
      {selectedUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedUser(null)}>
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden relative" onClick={(e) => e.stopPropagation()}>
            <div className="h-32 bg-[#0f172a] relative">
              <button onClick={() => setSelectedUser(null)} className="absolute top-6 right-6 p-2 text-white/50 hover:text-white transition-colors"><X size={20} /></button>
            </div>
            
            <div className="px-12 pb-12">
                <div className="relative -mt-16 mb-8 flex items-end gap-6">
                    <img src={selectedUser.avatar_url} className="w-32 h-32 rounded-[2.5rem] border-8 border-white shadow-xl object-cover" alt="profile" />
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-tight">{selectedUser.first_name} {selectedUser.last_name}</h2>
                        <p className="text-[#3b82f6] font-bold uppercase tracking-[0.2em] text-[10px] mt-1 flex items-center gap-2">
                          <span className="w-2 h-2 bg-[#3b82f6] rounded-full animate-pulse"></span>
                          @{selectedUser.username}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-10">
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                        <p className="text-[9px] text-slate-400 uppercase font-bold mb-1 tracking-widest leading-none">Email Channel</p>
                        <p className="text-slate-900 font-bold truncate text-sm mt-2">{selectedUser.email || 'N/A'}</p>
                    </div>
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                        <p className="text-[9px] text-slate-400 uppercase font-bold mb-1 tracking-widest leading-none">Registration Date</p>
                        <p className="text-slate-900 font-bold truncate text-sm mt-2">{new Date(selectedUser.created_at).toLocaleDateString('uk-UA')}</p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button className="flex-1 py-4 bg-[#0f172a] text-white rounded-2xl text-[10px] uppercase tracking-[0.4em] font-black shadow-lg hover:bg-slate-800 transition-all active:scale-95">System Access Control</button>
                    <button className="p-4 border border-slate-200 text-rose-500 rounded-2xl hover:bg-rose-50 transition-colors active:scale-95"><Trash2 size={20} /></button>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;