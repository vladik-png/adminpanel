import * as React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Layout/Sidebar';
import Infrastructure from './pages/Infrastructure';
import Analytics from './pages/Analytics';
import Login from './pages/Login';
import Profile from './pages/Profile';

const App: React.FC = () => {
  const isAuthenticated = () => {
    return localStorage.getItem('admin_token') !== null;
  };

  return (
    <Router>
      <Routes>
        {}
        <Route path="/" element={<Login />} />

        {}
        <Route
          path="/*"
          element={
            isAuthenticated() ? (
              <div className="flex w-full min-h-screen bg-[#f8fafc]">
                <Sidebar />
                <div className="flex-1 ml-64 min-h-screen flex flex-col w-[calc(100%-16rem)]">
                  <main className="flex-1 w-full h-full">
                    <Routes>
                      <Route path="/infrastructure" element={<Infrastructure />} />
                      <Route path="/analytics" element={<Analytics />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="*" element={<Navigate to="/analytics" />} />
                    </Routes>
                  </main>
                </div>
              </div>
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default App;