import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { 
  ThermometerSun, MapPin, Users as UsersIcon, 
  Activity, Server, Database, Clock, ArrowUpRight
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const [employee, setEmployee] = useState<any>(null);
  const [weather, setWeather] = useState<any>(null);
  const [stats, setStats] = useState({ users: 0 });
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  
  // Живі метрики (симуляція реальних даних)
  const [metrics, setMetrics] = useState({ cpu: 12.4, db: 84.2 });

  useEffect(() => {
    // 1. Оновлення годинника кожну секунду (корисно для терміналу)
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);

    // 2. Симуляція зміни навантаження (поки не підключено Go-агент)
    const metricInterval = setInterval(() => {
      setMetrics(prev => ({
        cpu: +(prev.cpu + (Math.random() * 2 - 1)).toFixed(1),
        db: +(prev.db + (Math.random() * 0.1)).toFixed(1)
      }));
    }, 3000);

    const fetchData = async () => {
      const empId = localStorage.getItem('employee_id');
      if (!empId) return;
      try {
        const empRes = await api.get(`/employee/${empId}`);
        setEmployee(empRes.data.results);

        if (empRes.data.results?.location) {
          const city = empRes.data.results.location.split(',')[0].trim();
          const weatherRes = await fetch(`https://wttr.in/${city},Ivano-Frankivsk,Ukraine?format=j1`);
          const wData = await weatherRes.json();
          setWeather({
            temp: wData.current_condition[0].temp_C,
            condition: wData.current_condition[0].weatherDesc[0].value
          });
        }
        const usersRes = await api.get('/users');
        setStats({ users: usersRes.data.results?.length || 0 });
      } catch (err) { console.error(err); }
    };

    fetchData();
    return () => { clearInterval(timer); clearInterval(metricInterval); };
  }, []);

  return (
    // ml-64 ПРИБРАНО, бо він вже є в App.tsx
    <div className="w-full min-h-screen p-10 flex flex-col items-start justify-start bg-[#f8fafc]">
      
      {/* ВЕРХНЯ ПАНЕЛЬ: Погода + Новий Годинник */}
      <div className="w-full flex justify-between items-start mb-16">
        <div className="text-left">
          <h1 className="text-[54px] font-black text-slate-900 uppercase tracking-tighter leading-none">
            CONTROL <span className="text-blue-600">TERMINAL</span>
          </h1>
          <div className="flex items-center gap-4 mt-4">
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.5em]">
              System Monitoring
            </p>
            <div className="flex items-center gap-2 bg-slate-900 text-blue-400 px-3 py-1 rounded-lg font-mono text-xs shadow-lg">
              <Clock size={12} /> {time}
            </div>
          </div>
        </div>

        {/* Weather Widget */}
        <div className="bg-white p-5 rounded-[2.2rem] shadow-2xl shadow-blue-900/5 border border-white flex items-center gap-5 min-w-[300px]">
          <div className="bg-blue-600 p-4 rounded-2xl text-white shadow-lg shadow-blue-500/30">
            <ThermometerSun size={24} />
          </div>
          <div className="text-left">
            <p className="flex items-center gap-1.5 text-blue-600 font-black text-[9px] uppercase tracking-widest mb-1">
              <MapPin size={10} /> {employee?.location || "ЗАМУЛИНЦІ CITY"}
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 tracking-tighter">
                {weather ? `${weather.temp}°C` : "--°C"}
              </span>
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tight">
                {weather?.condition || "LOADING..."}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* КАРТКИ МЕТРИК: Тепер з динамічними даними */}
      <div className="flex flex-wrap gap-8 mb-12 w-full justify-start">
        <StatTile icon={<UsersIcon />} label="Total Users" value={stats.users.toString()} unit="accounts" />
        <StatTile icon={<Activity />} label="CPU Usage" value={`${metrics.cpu}%`} unit="load" isLive />
        <StatTile icon={<Server />} label="Node Status" value="Online" unit="stable" />
        <StatTile icon={<Database />} label="DB Capacity" value={`${metrics.db}%`} unit="filled" />
      </div>

      {/* МОЯ ДОБАВКА: РЕАЛЬНО КОРИСНИЙ БЛОК — ACTIVITY LOG & QUICK ACTIONS */}
      <div className="w-full grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Останні дії в системі */}
        <div className="xl:col-span-2 bg-white rounded-[3rem] p-10 shadow-xl border border-slate-100">
           <div className="flex justify-between items-center mb-8">
              <h3 className="text-slate-900 font-black uppercase tracking-widest text-sm">Recent Activity Log</h3>
              <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase">Live Update</span>
           </div>
           <div className="space-y-4">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-blue-200 transition-all">
                   <div className="flex items-center gap-4">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <p className="text-xs font-bold text-slate-700 uppercase">User registration successful</p>
                   </div>
                   <span className="text-[10px] font-mono text-slate-400">14:2{i} PM</span>
                </div>
              ))}
           </div>
        </div>

        {/* Швидкі дії */}
        <div className="bg-[#0f172a] rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
           <div className="relative z-10">
              <h3 className="text-white font-black uppercase tracking-widest text-sm mb-6">Quick Actions</h3>
              <div className="space-y-3">
                 <button className="w-full py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-700 transition-all">
                    Generate Report <ArrowUpRight size={14}/>
                 </button>
                 <button className="w-full py-4 bg-slate-800 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:text-white transition-all">
                    System Reboot
                 </button>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

const StatTile = ({ icon, label, value, unit, isLive }: any) => (
  <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-100 flex flex-col items-start min-w-[260px] group transition-all duration-300">
    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all">
      {React.cloneElement(icon, { size: 22 })}
    </div>
    <div className="flex items-center gap-2">
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      {isLive && <span className="w-1 h-1 bg-red-500 rounded-full animate-ping mb-1"></span>}
    </div>
    <div className="flex items-baseline gap-2">
      <p className="text-4xl font-black text-slate-900 tracking-tighter">{value}</p>
      <span className="text-[10px] font-bold text-slate-300 uppercase">{unit}</span>
    </div>
  </div>
);

export default Dashboard;