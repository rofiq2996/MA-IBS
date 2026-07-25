import React from 'react';
import { UserAnnouncements } from '../components/ui/UserAnnouncements';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { Shield, TrendingUp, Stethoscope, Map, Scale, Users, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

export function DashboardBK() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { to: '/preventif', icon: Shield, label: 'Fungsi Preventif', color: 'text-blue-600', bg: 'bg-blue-50' },
    { to: '/pengembangan', icon: TrendingUp, label: 'Fungsi Pengembangan', color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { to: '/kuratif', icon: Stethoscope, label: 'Fungsi Kuratif', color: 'text-amber-600', bg: 'bg-amber-50' },
    { to: '/penyaluran', icon: Map, label: 'Fungsi Penyaluran', color: 'text-purple-600', bg: 'bg-purple-50' },
    { to: '/advokasi', icon: Scale, label: 'Fungsi Advokasi', color: 'text-red-600', bg: 'bg-red-50' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-800">Dashboard Bimbingan Konseling</h1>
          <p className="text-slate-500 mt-1 text-sm">Portal layanan dan pendampingan siswa terpadu.</p>
        </div>
      
        <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
          <Search className="w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Cari siswa (NIS/Nama)" className="text-sm outline-none w-48 bg-transparent" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:hidden">
        {menuItems.map((item, index) => (
          <button 
            key={index}
            onClick={() => navigate(item.to)}
            className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col items-center justify-center gap-3 hover:border-emerald-500 hover:shadow-md transition-all group"
          >
            <div className={`w-12 h-12 rounded-full ${item.bg} flex items-center justify-center ${item.color} transition-colors`}>
              <item.icon className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold text-slate-600 text-center uppercase tracking-wider group-hover:text-emerald-700">
              {item.label}
            </span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <span className="w-1 h-4 bg-emerald-500 rounded"></span>
              <CardTitle>Agenda Konseling Hari Ini</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            {[
              { time: '09:00', student: 'Ahmad Fauzi (XII-IPA 1)', type: 'Karir / Penyaluran', status: 'Selesai' },
              { time: '10:30', student: 'Siti Aminah (X-IPS 2)', type: 'Akademik / Kuratif', status: 'Menunggu' },
              { time: '13:00', student: 'Budi Santoso (XI-IPA 3)', type: 'Pribadi / Advokasi', status: 'Terjadwal' }
            ].map((agenda, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-lg">
                <div>
                  <p className="text-sm font-bold text-slate-800">{agenda.student}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-mono text-slate-500">{agenda.time}</span>
                    <span className="text-[10px] bg-slate-200 px-1.5 py-0.5 rounded text-slate-600 font-medium">{agenda.type}</span>
                  </div>
                </div>
                <div>
                   <span className={`text-[10px] px-2 py-1 rounded font-bold uppercase tracking-wider ${
                     agenda.status === 'Selesai' ? 'bg-emerald-100 text-emerald-700' :
                     agenda.status === 'Menunggu' ? 'bg-amber-100 text-amber-700' :
                     'bg-blue-100 text-blue-700'
                   }`}>
                     {agenda.status}
                   </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <span className="w-1 h-4 bg-blue-500 rounded"></span>
              <CardTitle>Statistik Penanganan Bulan Ini</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-bold text-slate-600">Bimbingan Pribadi / Sosial</span>
                  <span className="text-slate-400">12 Siswa</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '40%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-bold text-slate-600">Bimbingan Belajar</span>
                  <span className="text-slate-400">25 Siswa</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-bold text-slate-600">Bimbingan Karir</span>
                  <span className="text-slate-400">30 Siswa</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '80%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-bold text-slate-600">Penanganan Kasus (Kuratif)</span>
                  <span className="text-slate-400">4 Siswa</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-amber-500 h-2 rounded-full" style={{ width: '15%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="lg:col-span-2">
        <CardHeader>
          <div className="flex items-center gap-2">
            <span className="w-1 h-4 bg-emerald-500 rounded"></span>
            <CardTitle>Distribusi Layanan Bimbingan (Semester Ini)</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="h-64 w-full pt-4 flex items-center justify-center">
          <ResponsiveContainer width="100%" height={256}>
            <PieChart>
              <Pie
                data={[
                  { name: 'Pribadi/Sosial', value: 45 },
                  { name: 'Belajar', value: 30 },
                  { name: 'Karir', value: 15 },
                  { name: 'Kasus (Kuratif)', value: 10 },
                ]}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                <Cell fill="#3b82f6" />
                <Cell fill="#10b981" />
                <Cell fill="#a855f7" />
                <Cell fill="#f59e0b" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

</div>
  );
}
