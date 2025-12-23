import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Mail, Phone, Calendar, MapPin, Briefcase, Hash, ShieldCheck } from 'lucide-react';

interface EmployeeData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  hire_date: string;
  avatar_url: string;
  location: string;
  department_id: number;
  employee_id: number;
}

const Profile: React.FC = () => {
  const [emp, setEmp] = useState<EmployeeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const id = localStorage.getItem('employee_id');
      if (!id) return;
      try {
        const res = await api.get(`http://13.62.214.254:8080/employee?employee_id=${id}`);
        if (res.data.results) setEmp(res.data.results);
      } catch (err) {
        console.error("Error loading profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#f1f5f9] animate-pulse uppercase tracking-widest text-xs">Loading...</div>;
  if (!emp) return <div className="p-10 text-center text-red-500">Profile Not Found</div>;

  const formattedDate = new Date(emp.hire_date).toLocaleDateString('uk-UA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-[#f1f5f9] pb-20">
      {}
      <div className="h-[200px] bg-gradient-to-r from-slate-900 via-[#0f172a] to-blue-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-500/40 via-transparent to-transparent"></div>
        
        {}
        <div className="max-w-7xl mx-auto px-8 pt-6 relative z-10 opacity-30 select-none pointer-events-none">
           <h1 className="text-[6rem] font-black text-white leading-none tracking-tighter">
            PROFILE
           </h1>
        </div>
      </div>

      {}
      <div className="max-w-5xl mx-auto px-6 sm:px-8 relative z-20 -mt-24">
        <div className="bg-white/95 backdrop-blur-xl rounded-[3rem] shadow-2xl p-8 sm:p-12 border border-white/50 relative overflow-hidden">
          
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

          {}
          <div className="flex flex-col md:flex-row gap-10 items-center md:items-end relative z-10 mb-16">
            <div className="relative group">
               <div className="absolute -inset-0.5 bg-gradient-to-br from-blue-500 to-blue-300 rounded-full blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
              <img 
                src={emp.avatar_url || `https://ui-avatars.com/api/?name=${emp.first_name}+${emp.last_name}&background=0D8ABC&color=fff`} 
                alt="Profile" 
                className="relative w-48 h-48 rounded-full border-[8px] border-white shadow-xl object-cover"
              />
              <div className="absolute bottom-2 right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center shadow-sm">
                <ShieldCheck size={14} className="text-white" />
              </div>
            </div>

            <div className="text-center md:text-left flex-1 pb-4">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
                <span className="px-4 py-1.5 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-widest rounded-full border border-blue-100">
                  Employee ID: {emp.employee_id}
                </span>
                <div className="flex items-center gap-1 text-slate-400 text-[11px] uppercase font-bold tracking-wider">
                  <MapPin size={12} className="text-blue-400" />
                  {emp.location}
                </div>
              </div>
              
              {}
              <h1 className="text-5xl sm:text-6xl font-black text-slate-900 tracking-tighter mb-2 leading-tight">
                {emp.first_name} <br className="hidden sm:block"/>
                <span className="text-slate-900">
                  {emp.last_name}
                </span>
              </h1>
              <p className="text-slate-500 text-sm font-medium tracking-wide">system_administrator • cinelink_team</p>
            </div>
          </div>

          {}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 relative z-10">
            <InfoTile icon={<Mail />} label="Corporate Email" value={emp.email} />
            <InfoTile icon={<Phone />} label="Contact Phone" value={emp.phone} />
            <InfoTile icon={<Calendar />} label="Hire Date" value={`${formattedDate}`} />
            <InfoTile icon={<Briefcase />} label="Department" value={`Dept. ID #${emp.department_id}`} />
            <InfoTile icon={<Hash />} label="System Role" value="Administrator Access" />
            
            {}
            <div className="bg-gradient-to-br from-slate-900 to-blue-900 p-6 rounded-[2rem] flex items-center justify-center text-center group cursor-pointer hover:shadow-xl transition-all hover:-translate-y-1">
              <div>
                <div className="text-white/80 text-3xl font-black mb-2 group-hover:text-white transition-colors">EDIT PROFILE</div>
                <p className="text-blue-200/60 text-[10px] uppercase tracking-[0.2em] font-bold">Cumming Soon</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

const InfoTile: React.FC<{icon: React.ReactNode, label: string, value: string}> = ({icon, label, value}) => {
  return (
    <div className="bg-slate-50 hover:bg-white p-6 rounded-[2rem] border border-slate-100 transition-all duration-300 hover:shadow-xl hover:border-blue-100 group">
      <div className="flex items-start gap-5">
        <div className="p-4 bg-white text-blue-500 rounded-2xl shadow-sm border border-slate-100 group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300">
          {React.cloneElement(icon as React.ReactElement, { size: 24 })}
        </div>
        <div className="overflow-hidden">
          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1.5">{label}</p>
          <p className="text-lg font-bold text-slate-800 break-words leading-tight">{value}</p>
        </div>
      </div>
    </div>
  );
}

export default Profile;