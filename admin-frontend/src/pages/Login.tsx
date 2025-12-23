import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Login: React.FC = () => {
  const [employeeCode, setEmployeeCode] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);
  setIsLoading(true);

  console.log("Відправка запиту на:", 'http://13.62.214.254:8080/auth/login/employee');
  console.log("Дані:", { employee_code: employeeCode, password: password });

  try {
    const response = await api.post('http://13.62.214.254:8080/auth/login/employee', {
      employee_code: employeeCode,
      password: password
    });

    // ДИВИМОСЬ СЮДИ В КОНСОЛІ (F12)
    console.log("Статус відповіді:", response.status);
    console.log("Тіло відповіді (data):", response.data);

    if (response.status === 200) {
      // Перевіряємо, чи є поле results у відповіді
      const employeeId = response.data.results;
      console.log("Отримано ID працівника:", employeeId);

      if (employeeId) {
        localStorage.setItem('admin_token', 'true'); 
        localStorage.setItem('employee_id', employeeId.toString());
        console.log("Токени збережено, виконую перехід...");
        navigate('/analytics');
      } else {
        setError("Сервер повернув успіх, але ID працівника порожній");
      }
    }
  } catch (err: any) {
    console.error("Повна помилка:", err);
    if (err.response) {
      console.log("Статус помилки від сервера:", err.response.status);
      console.log("Дані помилки:", err.response.data);
      
      if (err.response.status === 401) setError('Працівника не знайдено');
      else if (err.response.status === 403) setError('Невірний пароль');
      else setError(`Помилка сервера: ${err.response.status}`);
    } else {
      setError('Не вдалося з’єднатися з сервером. Перевір інтернет та IP.');
    }
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] p-12 shadow-2xl border border-slate-800/10">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Terminal Access</h2>
          <p className="text-slate-400 text-[9px] uppercase tracking-[0.4em] mt-2">Authentication Required</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="text-[10px] uppercase text-slate-400 font-bold ml-1 mb-2 block">Employee Code</label>
            <input 
              type="text" 
              required
              className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-mono text-slate-800"
              placeholder="XXXX"
              value={employeeCode}
              onChange={(e) => setEmployeeCode(e.target.value)}
            />
          </div>
          <div>
            <label className="text-[10px] uppercase text-slate-400 font-bold ml-1 mb-2 block">Security Password</label>
            <input 
              type="password" 
              required
              className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-800"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 p-4 rounded-xl">
              <p className="text-red-500 text-[11px] font-bold text-center uppercase tracking-wider">
                {error}
              </p>
            </div>
          )}

          <button 
            type="submit"
            disabled={isLoading}
            className={`w-full bg-slate-900 hover:bg-black text-white font-bold py-5 rounded-2xl uppercase text-[11px] tracking-widest transition-all shadow-xl ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Authenticating...' : 'Authorize Entry'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;