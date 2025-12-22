import * as React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Layout/Sidebar';
import Infrastructure from './pages/Infrastructure';
import Analytics from './pages/Analytics';

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex w-full min-h-screen bg-[#f8fafc]">
        <Sidebar />
        <div className="flex-1 ml-64 min-h-screen flex flex-col w-[calc(100%-16rem)]">
          <main className="flex-1 w-full h-full">
            <Routes>
              {}
              <Route path="/" element />
              <Route path="/infrastructure" element={<Infrastructure />} />
              <Route path="/analytics" element={<Analytics />} /> {}
              {}
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;