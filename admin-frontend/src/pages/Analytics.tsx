import * as React from 'react';
import { useEffect, useState } from 'react';
import api from '../api/axios';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, Server, Activity, Globe, HardDrive, AlertCircle } from 'lucide-react';

const Analytics: React.FC = () => {
  const [nodesHistory, setNodesHistory] = useState<Record<string, any[]>>({});
  const [activeCount, setActiveCount] = useState(0);

  const fetchAllMetrics = async () => {
    try {
      const res = await api.get('http://13.62.214.254:8081/system-metrics');
      const allNodesData = res.data;

      setNodesHistory(prevHistory => {
        const newHistory = { ...prevHistory };

        Object.keys(allNodesData).forEach(nodeId => {
          const newNodeData = allNodesData[nodeId];
          const currentData = newHistory[nodeId] || [];

          const updatedNodeHistory = [
            ...currentData,
            { 
              time: newNodeData.time, 
              cpu: newNodeData.cpu, 
              ram: newNodeData.ram,
              disk: parseFloat(newNodeData.disk), 
              ping: newNodeData.ping,
              // ДОДАНО: Перетворюємо packet_loss у число
              packet_loss: parseFloat(newNodeData.packet_loss) || 0,
            }
          ];

          newHistory[nodeId] = updatedNodeHistory.slice(-20);
        });

        return newHistory;
      });

      setActiveCount(Object.keys(allNodesData).length);
    } catch (err) {
      console.error("Error fetching multi-node metrics:", err);
    }
  };

  useEffect(() => {
    fetchAllMetrics();
    const interval = setInterval(fetchAllMetrics, 2000);
    return () => clearInterval(interval);
  }, []);

  const themeColor = '#0f172a';

  return (
    <div className="w-full flex flex-col bg-[#f8fafc] min-h-screen font-medium">
      <div style={{ backgroundColor: themeColor }} className="py-4 px-10 flex justify-between items-center sticky top-0 z-50 shadow-md">
        <h2 className="text-sm text-white tracking-widest uppercase flex items-center gap-2">
          <Activity size={16} className="text-blue-400" />
          Cloud Infrastructure Analytics
        </h2>
        <div className="bg-blue-600/20 text-blue-400 text-[10px] px-4 py-1.5 rounded-lg border border-blue-600/30 uppercase tracking-widest">
          Active Agents: <span className="text-white ml-1 font-medium">{activeCount} Nodes</span>
        </div>
      </div>

      <div className="p-10 w-full">
        <div className="mb-10 border-b border-slate-200 pb-8">
          <h1 className="text-4xl text-slate-800 uppercase tracking-tighter font-black">Real-time Telemetry</h1>
          <p className="text-slate-400 mt-1 uppercase text-[10px] tracking-[0.3em]">Combined Metrics Pipeline</p>
        </div>

        <div className="grid grid-cols-1 gap-12">
          {Object.keys(nodesHistory).length === 0 ? (
            <div className="p-20 text-center border-2 border-dashed border-slate-200 rounded-[2rem]">
              <p className="text-slate-400 uppercase text-xs tracking-widest animate-pulse">Waiting for agents...</p>
            </div>
          ) : (
            Object.keys(nodesHistory).map(nodeId => {
              const history = nodesHistory[nodeId];
              const latest = history[history.length - 1];

              return (
                <div key={nodeId} className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
                  <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                    <div>
                      <span className="text-[10px] text-blue-500 uppercase tracking-widest font-bold">Node Identifier</span>
                      <h3 className="text-xl text-slate-800 tracking-tight uppercase flex items-center gap-2 font-black">
                        <Server size={20} className="text-slate-400" />
                        {nodeId}
                      </h3>
                    </div>

                    {/* Додано Loss у швидку панель */}
                    <div className="flex gap-10 text-[10px] uppercase font-bold tracking-widest">
                        <div className="text-blue-500">CPU: {latest?.cpu}%</div>
                        <div className="text-purple-500">RAM: {latest?.ram}%</div>
                        <div className="text-orange-500">Disk: {latest?.disk}%</div>
                        <div className="text-emerald-500">Ping: {latest?.ping}ms</div>
                        <div className={latest?.packet_loss > 0 ? "text-red-500 animate-pulse" : "text-slate-400"}>
                          Loss: {latest?.packet_loss}%
                        </div>
                    </div>
                  </div>

                  <div className="p-10">
                    <div className="flex items-center gap-2 mb-6">
                        <TrendingUp size={16} className="text-slate-800" />
                        <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Combined System Load</span>
                    </div>
                    
                    <div className="h-[400px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={history}>
                          <defs>
                            <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/></linearGradient>
                            <linearGradient id="colorRam" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#a855f7" stopOpacity={0.1}/><stop offset="95%" stopColor="#a855f7" stopOpacity={0}/></linearGradient>
                            <linearGradient id="colorDisk" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f97316" stopOpacity={0.1}/><stop offset="95%" stopColor="#f97316" stopOpacity={0}/></linearGradient>
                            <linearGradient id="colorPing" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/><stop offset="95%" stopColor="#10b981" stopOpacity={0}/></linearGradient>
                            {/* Градієнт для Packet Loss */}
                            <linearGradient id="colorLoss" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/><stop offset="95%" stopColor="#ef4444" stopOpacity={0}/></linearGradient>
                          </defs>
                          
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                          <YAxis domain={[0, 'auto']} axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                          <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                          <Legend verticalAlign="top" height={36} iconType="circle" />

                          <Area name="CPU (%)" type="monotone" dataKey="cpu" stroke="#3b82f6" strokeWidth={3} fill="url(#colorCpu)" animationDuration={300} />
                          <Area name="RAM (%)" type="monotone" dataKey="ram" stroke="#a855f7" strokeWidth={3} fill="url(#colorRam)" animationDuration={300} />
                          <Area name="Disk (%)" type="monotone" dataKey="disk" stroke="#f97316" strokeWidth={3} fill="url(#colorDisk)" animationDuration={300} />
                          <Area name="Ping (ms)" type="monotone" dataKey="ping" stroke="#10b981" strokeWidth={3} fill="url(#colorPing)" animationDuration={300} />
                          
                          {/* ДОДАНО: Лінія втрати пакетів (червона) */}
                          <Area 
                            name="Packet Loss (%)" 
                            type="stepAfter" 
                            dataKey="packet_loss" 
                            stroke="#ef4444" 
                            strokeWidth={3} 
                            fill="url(#colorLoss)" 
                            animationDuration={300} 
                          />
                          
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;