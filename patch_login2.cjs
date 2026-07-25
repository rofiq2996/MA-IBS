const fs = require('fs');

const code = `import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { KeyRound, User as UserIcon, Eye, EyeOff } from 'lucide-react';
import { apiClient } from '../lib/apiClient';

export function Login() {
  const { user, login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await apiClient('/login.php', {
        method: 'POST',
        body: JSON.stringify({ username, password })
      });
      
      if (response.status === 'success' && response.user) {
        login(response.user.id.toString(), response.user);
        setLoading(false);
        return;
      } else {
        setError(response.message || 'Username atau password salah');
        setLoading(false);
        return;
      }
    } catch (apiError) {
      console.warn("API Login failed", apiError);
      setError('Terjadi kesalahan pada server. Coba lagi nanti.');
    }
    setLoading(false);
  };

  return (
    <div className="h-[100dvh] flex items-center justify-center bg-slate-100 md:p-4 font-sans text-slate-800 overflow-hidden">
      <div className="w-full h-full md:h-auto md:max-w-4xl md:w-full bg-white md:rounded-3xl md:shadow-xl overflow-hidden flex flex-col md:flex-row relative">
        
        {/* Left Side (Top on Mobile) - Green Background */}
        <div className="w-full h-[55%] md:h-auto md:w-1/2 bg-[#126442] text-white p-4 md:p-12 flex flex-col items-center justify-center relative overflow-hidden flex-shrink-0">
          {/* Subtle background decoration */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
             <div className="absolute top-[-20%] left-[-10%] w-64 h-64 rounded-full bg-white blur-3xl"></div>
             <div className="absolute bottom-[-20%] right-[-10%] w-80 h-80 rounded-full bg-white blur-3xl"></div>
          </div>
          
          <div className="relative z-10 flex flex-col items-center text-center -mt-8 md:mt-0">
            <div className="w-14 h-14 md:w-32 md:h-32 mb-3 md:mb-6 bg-white/10 p-2 rounded-2xl backdrop-blur-sm border border-white/20">
              <img src="https://iili.io/CjZhFb2.png" alt="Logo MAS Al-Ihsan" className="w-full h-full object-contain drop-shadow-md" />
            </div>
            
            <h2 className="text-base md:text-2xl font-bold mb-2 md:mb-8">Keutamaan Menuntut Ilmu</h2>
            
            <div className="mb-2 md:mb-6">
              <p className="text-xl md:text-3xl text-[#F2C94C]" dir="rtl" style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", "Traditional Arabic", serif', lineHeight: '2' }}>
                مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ طَرِيقًا إِلَى الْجَنَّةِ
              </p>
            </div>
            
            <p className="text-[10px] md:text-base italic mb-1 md:mb-4 opacity-90 max-w-[280px] md:max-w-sm px-2">
              "Barangsiapa menempuh suatu jalan untuk menuntut ilmu, maka Allah memudahkan baginya jalan menuju surga."
            </p>
            
            <p className="text-[10px] md:text-sm font-bold opacity-80">(HR. Muslim)</p>
          </div>
        </div>

        {/* Right Side (Bottom on Mobile) - Login Form */}
        <div className="w-full h-[50%] md:h-auto md:w-1/2 p-6 md:p-12 bg-white flex flex-col justify-start md:justify-center absolute bottom-0 md:relative rounded-t-3xl md:rounded-none z-20 shadow-[0_-8px_30px_rgba(0,0,0,0.12)] md:shadow-none">
          
          <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-5 md:hidden"></div>
          
          <div className="mb-6 hidden md:block">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">MAS Al-Ihsan IBS</h1>
            <p className="text-sm text-emerald-600 font-semibold mt-1">Sistem Informasi Akademik Terpadu</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4 md:space-y-5">
            {error && (
              <div className="bg-red-50 text-red-600 text-xs p-3 rounded-lg border border-red-100 text-center font-bold">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-[11px] md:text-xs font-bold text-slate-700 mb-1.5 md:mb-2">Username / NIS</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().trim())}
                  className="block w-full pl-10 pr-3 py-2.5 md:py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white outline-none transition-all placeholder:text-slate-400"
                  placeholder="Masukkan Username/NIS"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-[11px] md:text-xs font-bold text-slate-700 mb-1.5 md:mb-2">Password</label>
              <div className="relative flex items-center">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <KeyRound className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-2.5 md:py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white outline-none transition-all placeholder:text-slate-400"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <div className="flex justify-end mt-2">
                 <a href="#" onClick={(e) => { e.preventDefault(); alert("Silahkan hubungi administrator madrasah untuk mereset password Anda."); }} className="text-[10px] md:text-xs font-bold text-[#b49021] hover:text-[#d4aa27] transition-colors">Lupa Password?</a>
              </div>
            </div>
            
            <div className="pt-1 md:pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#126442] hover:bg-[#0e4e33] text-white font-bold py-3 md:py-3.5 px-4 rounded-xl transition-all shadow-md shadow-[#126442]/20 active:scale-[0.98] flex items-center justify-center disabled:opacity-70 text-sm md:text-base"
              >
                {loading ? 'Memproses...' : 'Masuk'}
              </button>
            </div>
          </form>
        </div>
        
      </div>
    </div>
  );
}
`;

fs.writeFileSync('src/pages/Login.tsx', code);
