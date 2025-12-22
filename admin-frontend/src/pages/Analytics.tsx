import * as React from 'react';
import { useEffect, useState } from 'react';
import api from '../api/axios';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Database, Server, Activity } from 'lucide-react';

const Analytics: React.FC = () => {

  const [nodesHistory, setNodesHistory] = useState<Record<string, any[]>>({});
  const [activeCount, setActiveCount] = useState(0);

  const fetchAllMetrics = async () => {
    try {
      const res = await api.get('/system-metrics');
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
              ram: newNodeData.ram 
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
        <h2 className="text-sm text-white tracking-widest uppercase">
          Cloud Infrastructure Analytics
        </h2>
        <div className="bg-blue-600/20 text-blue-400 text-[10px] px-4 py-1.5 rounded-lg border border-blue-600/30 uppercase tracking-widest">
          Active Agents: <span className="text-white ml-1 font-medium">{activeCount} Nodes</span>
        </div>
      </div>

      <div className="p-10 w-full">
        <div className="mb-10 border-b border-slate-200 pb-8">
          <h1 className="text-4xl text-slate-800 uppercase tracking-tighter">Real-time Telemetry</h1>
          <p className="text-slate-400 mt-1 uppercase text-[10px] tracking-[0.3em]">Multi-Node Monitoring Pipeline</p>
        </div>

        {}
        <div className="grid grid-cols-1 gap-12">
          {Object.keys(nodesHistory).length === 0 ? (
            <div className="p-20 text-center border-2 border-dashed border-slate-200 rounded-[2rem]">
              <p className="text-slate-400 uppercase text-xs tracking-widest">Waiting for agents to report metrics...</p>
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
                      <h3 className="text-xl text-slate-800 tracking-tight uppercase">{nodeId}</h3>
                    </div>
                    <div className="flex gap-8">
                        <div className="text-right">
                            <p className="text-[9px] text-slate-400 uppercase tracking-widest">CPU</p>
                            <p className="text-xl text-slate-800">{latest?.cpu}%</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[9px] text-slate-400 uppercase tracking-widest">RAM</p>
                            <p className="text-xl text-slate-800">{latest?.ram}%</p>
                        </div>
                    </div>
                  </div>

                  <div className="p-10">
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={history}>
                          <defs>
                            <linearGradient id={`colorCpu-${nodeId}`} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis 
                            dataKey="time" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{fill: '#94a3b8', fontSize: 10}} 
                          />
                          <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                          <Tooltip 
                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} 
                          />
                          <Area 
                            type="monotone" 
                            dataKey="cpu" 
                            stroke="#3b82f6" 
                            strokeWidth={3} 
                            fill={`url(#colorCpu-${nodeId})`} 
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