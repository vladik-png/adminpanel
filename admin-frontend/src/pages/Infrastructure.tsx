import * as React from 'react';
import { useEffect, useState } from 'react';
import api from '../api/axios';
import { RefreshCcw, Activity, Play, Square } from 'lucide-react';

const Infrastructure: React.FC = () => {
  const [instances, setInstances] = useState<any[]>([]);
  const [region, setRegion] = useState<string>('FETCHING...');
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [instRes, infoRes] = await Promise.all([
        api.get('/'),
        api.get('/info')
      ]);
      setInstances(instRes.data.flatMap((r: any) => r.Instances));
      setRegion(infoRes.data.region.toUpperCase());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="w-full flex flex-col bg-[#f8fafc] min-h-screen">
      <div className="bg-[#0f172a] py-4 px-10 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <h2 className="text-sm font-medium text-white tracking-widest uppercase">
            AWS EC2 Monitoring Center
          </h2>
        </div>
        <div className="bg-[#1e293b] text-blue-400 text-[10px] font-medium px-4 py-1.5 rounded-lg border border-blue-600/20 uppercase tracking-widest">
          Region: {region}
        </div>
      </div>

      <div className="p-10 w-full">
        <div className="flex justify-between items-center mb-10 border-b border-slate-200 pb-8">
          <div>
            <h1 className="text-4xl font-medium text-slate-800 uppercase tracking-tighter">System Nodes</h1>
            <p className="text-slate-400 font-medium mt-1 uppercase text-[10px] tracking-[0.3em]">Infrastructure Control Pipeline</p>
          </div>
          
          <button 
            onClick={fetchData}
            style={{ backgroundColor: '#0f172a' }}
            className="p-5 text-white rounded-2xl hover:bg-[#1e293b] transition-all shadow-xl active:scale-95 flex items-center justify-center border border-slate-700/50"
          >
            <RefreshCcw size={28} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
          {instances.map((inst) => (
            <div key={inst.InstanceId} className="bg-white rounded-[1.5rem] border border-slate-200 shadow-sm p-8 hover:shadow-md transition-all border-t-2 border-t-blue-500/50 group">
              <div className="flex justify-between items-start mb-6">
                <div className="p-2.5 bg-slate-50 rounded-xl text-slate-300 group-hover:text-blue-500 transition-colors">
                  <Activity size={24} />
                </div>
                <span className={`px-3 py-1 rounded-lg text-[10px] font-medium uppercase tracking-widest border ${
                  inst.State.Name === 'running' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100'
                }`}>
                  {inst.State.Name}
                </span>
              </div>

              <div className="mb-6">
                <p className="text-[9px] font-medium text-slate-400 uppercase tracking-widest mb-1">Instance Identifier</p>
                <code className="text-lg font-medium text-slate-700 tracking-tight">{inst.InstanceId}</code>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                  <p className="text-[8px] font-medium text-slate-400 uppercase mb-1">Hardware</p>
                  <p className="text-[11px] font-medium text-slate-600">{inst.InstanceType}</p>
                </div>
                <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                  <p className="text-[8px] font-medium text-slate-400 uppercase mb-1">Platform</p>
                  <p className="text-[11px] font-medium text-slate-600">{inst.PlatformDetails || 'Linux/x64'}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  style={{ backgroundColor: '#0f172a' }}
                  className="flex-1 text-white py-3 rounded-xl font-medium text-[10px] uppercase tracking-widest hover:bg-[#1e293b] transition-all shadow-sm"
                >
                  Start
                </button>
                <button className="flex-1 border border-slate-200 text-slate-400 py-3 rounded-xl font-medium text-[10px] uppercase tracking-widest hover:bg-rose-50 hover:text-rose-500 hover:border-rose-100 transition-all">
                  Stop
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Infrastructure;