import React from 'react';
import { UserAnnouncements } from '../components/ui/UserAnnouncements';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Calendar, CheckSquare, Edit3, CalendarDays, 
  Book, Folder, LineChart as LineChartIcon, FileText, Sun, Moon, ClipboardList,
  FileCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function DashboardGuru() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { to: '/data-siswa', icon: Users, label: 'Data Siswa' },
    { to: '/jadwal-mengajar', icon: Calendar, label: 'Jadwal Mengajar' },
    { to: '/absensi', icon: CheckSquare, label: 'Absensi' },
    { to: '/input-nilai', icon: Edit3, label: 'Input Nilai' },
    { to: '/kalender-akademik', icon: CalendarDays, label: 'Kalender Akademik' },
    { to: '/jurnal-mengajar', icon: Book, label: 'Jurnal Mengajar' },
    { to: '/perangkat-ngajar', icon: Folder, label: 'Perangkat Ngajar' },
    { to: '/analisis-siswa', icon: LineChartIcon, label: 'Analisis Siswa' },
    { to: '/laporan', icon: FileText, label: 'Laporan' },
    { to: '/sholat-duha', icon: Sun, label: 'Sholat Duha' },
    { to: '/absensi-zuhur', icon: Moon, label: 'Absensi Sholat Zuhur Guru' },
    { to: '/leave', icon: ClipboardList, label: 'Form Perizinan Guru' },
    { to: '/settings', icon: FileCheck, label: 'Pengaturan Guru' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-800">Dashboard Guru</h1>
          <p className="text-slate-500 mt-1 text-sm">Selamat datang kembali, {user?.name}.</p>
        </div>
      </div>
      <UserAnnouncements />

      

      <div className="grid grid-cols-2 gap-3 md:hidden">
        {menuItems.map((item, index) => (
          <button 
            key={index}
            onClick={() => navigate(item.to)}
            className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col items-center justify-center gap-3 hover:border-emerald-500 hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
              <item.icon className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-slate-600 text-center uppercase tracking-wider group-hover:text-emerald-700">
              {item.label}
            </span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center">
              <span className="w-1 h-4 bg-emerald-500 rounded mr-2"></span> 
              Jadwal Mengajar & Absensi Hari Ini
            </CardTitle>
            <button className="text-[10px] font-bold text-emerald-600 uppercase hover:underline">Lihat Semua</button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="text-[10px] text-slate-400 uppercase tracking-tighter border-b border-slate-100 bg-slate-50/50">
                  <tr>
                    <th className="py-3 px-4">Waktu</th>
                    <th className="py-3 px-4">Kelas</th>
                    <th className="py-3 px-4">Mata Pelajaran</th>
                    <th className="py-3 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {[
                    { time: '07:30 - 09:00', class: 'X-IPA 1', subject: 'Matematika Wajib', status: 'Selesai' },
                    { time: '09:15 - 10:45', class: 'XI-IPA 3', subject: 'Matematika Peminatan', status: 'Berlangsung' },
                    { time: '11:00 - 12:30', class: 'XII-IPS 2', subject: 'Matematika Dasar', status: 'Belum Mulai' },
                  ].map((schedule, i) => {
                    const isCurrentlyActive = (() => {
                      try {
                        const [startStr, endStr] = schedule.time.split(' - ');
                        const [startHour, startMinute] = startStr.split(':').map(Number);
                        const [endHour, endMinute] = endStr.split(':').map(Number);
                        const now = new Date();
                        const currentHour = now.getHours();
                        const currentMinute = now.getMinutes();
                        const currentTimeMinutes = currentHour * 60 + currentMinute;
                        const startTimeMinutes = startHour * 60 + startMinute;
                        const endTimeMinutes = endHour * 60 + endMinute;
                        return currentTimeMinutes >= startTimeMinutes && currentTimeMinutes <= endTimeMinutes;
                      } catch (e) { return false; }
                    })();
                    const isButtonsActive = (() => {
                      try {
                        const [startStr] = schedule.time.split(' - ');
                        const [startHour, startMinute] = startStr.split(':').map(Number);
                        const now = new Date();
                        const currentHour = now.getHours();
                        const currentMinute = now.getMinutes();
                        const currentTimeMinutes = currentHour * 60 + currentMinute;
                        const startTimeMinutes = startHour * 60 + startMinute;
                        const cutoffTimeMinutes = 17 * 60; // 17:00
                        return currentTimeMinutes >= startTimeMinutes && currentTimeMinutes <= cutoffTimeMinutes;
                      } catch (e) { return false; }
                    })();
                    
                    return (
                    <tr key={i} className={`border-b border-slate-50 hover:bg-slate-50 transition-colors ${isCurrentlyActive ? 'bg-emerald-50/30' : ''}`}>
                      <td className={`py-4 px-4 font-medium ${isCurrentlyActive ? 'text-emerald-700' : 'text-slate-500'}`}>{schedule.time}</td>
                      <td className={`py-4 px-4 font-bold ${isCurrentlyActive ? 'text-emerald-900' : ''}`}>{schedule.class}</td>
                      <td className={`py-4 px-4 ${isCurrentlyActive ? 'text-emerald-900' : ''}`}>{schedule.subject}</td>
                      <td className="py-4 px-4">
                        <div className="flex gap-1.5 justify-end">
                          <button 
                            disabled={!isButtonsActive}
                            onClick={() => navigate('/jurnal-mengajar')}
                            className={`px-3 py-1.5 flex items-center justify-center text-[10px] font-bold rounded transition-all ${
                              isButtonsActive 
                                ? 'bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 shadow-sm active:scale-95' 
                                : 'bg-slate-50 text-slate-400 border border-slate-100 cursor-not-allowed'
                            }`}
                            title="Isi Jurnal Mengajar"
                          >
                            JURNAL
                          </button>
                          <button 
                            disabled={!isButtonsActive}
                            onClick={() => navigate('/absensi')}
                            className={`px-3 py-1.5 flex items-center justify-center text-[10px] font-bold rounded transition-all ${
                              isButtonsActive 
                                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm active:scale-95' 
                                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            }`}
                            title="Isi Absensi Siswa"
                          >
                            ABSENSI
                          </button>
                        </div>
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        

      </div>

        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex items-center gap-2">
              <span className="w-1 h-4 bg-emerald-500 rounded"></span>
              <CardTitle>Rata-rata Nilai Siswa (Bulan Ini)</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height={256}>
              <LineChart data={[
                { name: 'Mg 1', 'X-IPA 1': 78, 'XI-IPA 3': 82, 'XII-IPS 2': 75 },
                { name: 'Mg 2', 'X-IPA 1': 80, 'XI-IPA 3': 85, 'XII-IPS 2': 78 },
                { name: 'Mg 3', 'X-IPA 1': 82, 'XI-IPA 3': 84, 'XII-IPS 2': 81 },
                { name: 'Mg 4', 'X-IPA 1': 85, 'XI-IPA 3': 88, 'XII-IPS 2': 83 },
              ]} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                <Line type="monotone" dataKey="X-IPA 1" stroke="#10b981" strokeWidth={2} />
                <Line type="monotone" dataKey="XI-IPA 3" stroke="#6366f1" strokeWidth={2} />
                <Line type="monotone" dataKey="XII-IPS 2" stroke="#f59e0b" strokeWidth={2} />
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

</div>
  );
}
