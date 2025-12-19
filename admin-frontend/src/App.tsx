import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Layout/Sidebar';
import Infrastructure from './pages/Infrastructure';

const Dashboard = () => <div className="p-8 text-2xl font-bold text-slate-800">Welcome</div>;

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex bg-slate-100 min-h-screen">
        <Sidebar />
        
        {/* Контент зміщений вправо через фіксований Sidebar */}
        <div className="flex-1 ml-64">
          <header className="h-16 bg-white border-b border-slate-200 flex items-center px-8 sticky top-0 z-10">
            <h1 className="text-sm font-bold text-slate-400 uppercase tracking-widest">
              Control Center / <span className="text-slate-900">Live Monitor</span>
            </h1>
          </header>
          
          <main>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/users" element={<Users />} />
              <Route path="/infrastructure" element={<Infrastructure />} />
              {/* Додай інші маршрути тут */}
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;