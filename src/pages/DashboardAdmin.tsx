import { apiClient } from '../lib/apiClient';
import React, { useState, useEffect } from 'react';
import { UserAnnouncements } from '../components/ui/UserAnnouncements';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { 
  Users, BookOpen, Calendar as CalendarIcon, Settings, Database, GraduationCap, Building2, Megaphone, BookOpenCheck, FileBarChart, Library, CalendarDays, Laptop 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import { mockUsers, mockClasses, mockStudents } from '../data/mock';
export function DashboardAdmin() {
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState<any[]>([]);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const data = await apiClient('/announcements.php');
        setAnnouncements(data);
      } catch (err) {
        setAnnouncements([]);
      }
    };
    fetchAnnouncements();
  }, []);
  const totalSakit = mockStudents.reduce((acc, curr) => acc + (curr.attendance?.sick || 0), 0);
  const totalIzin = mockStudents.reduce((acc, curr) => acc + (curr.attendance?.permission || 0), 0);
  const totalAlpa = mockStudents.reduce((acc, curr) => acc + (curr.attendance?.absent || 0), 0);
  const totalHadir = mockStudents.reduce((acc, curr) => acc + (curr.attendance?.present || 0), 0);
  const totalHari = totalSakit + totalIzin + totalAlpa + totalHadir;
  const persenHadir = totalHari > 0 ? Math.round((totalHadir / totalHari) * 100) : 0;
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-800">Administrasi Sistem</h1>
          <p className="text-slate-500 mt-1 text-sm">Pusat kendali operasional madrasah.</p>
        </div>
      
        <Button className="shrink-0 gap-2"><Database className="w-4 h-4" /> Import Data</Button>
      </div>
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-50 pb-3">
          <span className="w-1.5 h-4 bg-emerald-500 rounded-full"></span>
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-800">
            Agenda & Info Penting
          </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {announcements.length > 0 ? (
            announcements.slice(0, 2).map((ann) => (
              <div key={ann.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex gap-3 items-start">
                <div className={`p-2.5 rounded-lg shrink-0 ${
                  ann.category === 'Penting' ? 'bg-red-100 text-red-700' :
                  ann.category === 'Maintenance' ? 'bg-orange-100 text-orange-700' :
                  ann.category === 'Kegiatan' ? 'bg-indigo-100 text-indigo-700' :
                  'bg-emerald-100 text-emerald-700'
                }`}>
                  {ann.category === 'Maintenance' ? <Laptop className="w-5 h-5" /> : <CalendarDays className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 text-[9px] font-black rounded uppercase tracking-wider ${
                      ann.category === 'Penting' ? 'bg-red-100/80 text-red-800' :
                      ann.category === 'Maintenance' ? 'bg-orange-100/80 text-orange-800' :
                      ann.category === 'Kegiatan' ? 'bg-indigo-100/80 text-indigo-800' :
                      'bg-emerald-100/80 text-emerald-800'
                    }`}>
                      {ann.category}
                    </span>
                    <span className="text-[9px] text-slate-400 font-bold">{ann.date}</span>
                  </div>
                  <p className="text-sm font-extrabold text-slate-800 mt-1.5 truncate">
                    {ann.title}
                  </p>
                  <p className="text-xs text-slate-500 mt-1 font-medium truncate">
                    {ann.content}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-1 lg:col-span-2 p-6 text-center text-sm text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              Belum ada info terbaru
            </div>
          )}
        </div>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Users className="w-4 h-4" /> Total Pengguna
          </div>
          <div className="flex items-end mt-2">
            <span className="text-3xl font-black text-slate-800">{mockUsers.length}</span>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <BookOpen className="w-4 h-4" /> Total Rombel
          </div>
          <div className="flex items-end mt-2">
            <span className="text-3xl font-black text-slate-800">{mockClasses.length}</span>
          </div>
        </div>
        
        <div className="bg-emerald-600 p-4 rounded-xl shadow-md text-white flex flex-col justify-between">
          <div className="text-xs font-bold text-emerald-200 uppercase tracking-widest flex items-center gap-2">
            <CalendarIcon className="w-4 h-4" /> Tahun Ajaran
          </div>
          <div className="flex items-end justify-between mt-2">
            <span className="text-xl font-black">2026/2027</span>
            <span className="text-[10px] bg-emerald-400/30 px-2 py-1 rounded backdrop-blur-sm font-bold uppercase tracking-wider">Ganjil</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Settings className="w-4 h-4" /> Status Sistem
          </div>
          <div className="flex items-end justify-between mt-2">
            <span className="text-lg font-black text-slate-800">Online</span>
            <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded">Optimal</span>
          </div>
        </div>
      </div>

      {/* MOBILE MENU GRID */}
      <div className="grid grid-cols-1 lg:hidden gap-6">
        {/* COLUMN 1 */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <span className="w-1 h-4 bg-emerald-500 rounded"></span>
              <CardTitle>Manajemen Utama</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
             <button onClick={() => navigate('/users')} className="w-full flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition-colors group">
               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-md bg-white border border-slate-200 flex items-center justify-center text-slate-600 group-hover:text-emerald-600 group-hover:border-emerald-200">
                   <Users className="w-4 h-4" />
                 </div>
                 <div className="text-left">
                   <p className="text-sm font-bold text-slate-800">Kelola Pengguna</p>
                   <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">Admin, Guru, Walas, Ortu</p>
                 </div>
               </div>
               <span className="text-xs font-bold text-slate-400 group-hover:text-emerald-600">→</span>
             </button>
             <button onClick={() => navigate('/students')} className="w-full flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition-colors group">
               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-md bg-white border border-slate-200 flex items-center justify-center text-slate-600 group-hover:text-emerald-600 group-hover:border-emerald-200">
                   <GraduationCap className="w-4 h-4" />
                 </div>
                 <div className="text-left">
                   <p className="text-sm font-bold text-slate-800">Siswa & Kelas</p>
                   <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">Identitas, Kelas, Rombel</p>
                 </div>
               </div>
               <span className="text-xs font-bold text-slate-400 group-hover:text-emerald-600">→</span>
             </button>
             <button onClick={() => navigate('/admin/subjects')} className="w-full flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition-colors group">
               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-md bg-white border border-slate-200 flex items-center justify-center text-slate-600 group-hover:text-emerald-600 group-hover:border-emerald-200">
                   <BookOpenCheck className="w-4 h-4" />
                 </div>
                 <div className="text-left">
                   <p className="text-sm font-bold text-slate-800">Mata Pelajaran</p>
                   <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">Kelola Kurikulum & Beban Mapel</p>
                 </div>
               </div>
               <span className="text-xs font-bold text-slate-400 group-hover:text-emerald-600">→</span>
             </button>
          </CardContent>
        </Card>

        {/* COLUMN 2 */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <span className="w-1 h-4 bg-emerald-500 rounded"></span>
              <CardTitle>Modul Operasional & Statistik</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
             <button onClick={() => navigate('/admin/terms')} className="w-full flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition-colors group">
               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-md bg-white border border-slate-200 flex items-center justify-center text-slate-600 group-hover:text-emerald-600 group-hover:border-emerald-200">
                   <CalendarIcon className="w-4 h-4" />
                 </div>
                 <div className="text-left">
                   <p className="text-sm font-bold text-slate-800">Tahun Ajaran & Semester</p>
                   <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">Konfigurasi Periode Belajar</p>
                 </div>
               </div>
               <span className="text-xs font-bold text-slate-400 group-hover:text-emerald-600">→</span>
             </button>
             <button onClick={() => navigate('/admin/reports')} className="w-full flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition-colors group">
               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-md bg-white border border-slate-200 flex items-center justify-center text-slate-600 group-hover:text-emerald-600 group-hover:border-emerald-200">
                   <FileBarChart className="w-4 h-4" />
                 </div>
                 <div className="text-left">
                   <p className="text-sm font-bold text-slate-800">Laporan & Statistik</p>
                   <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">Perkembangan Akademik & Absensi</p>
                 </div>
               </div>
               <span className="text-xs font-bold text-slate-400 group-hover:text-emerald-600">→</span>
             </button>
             <button onClick={() => navigate('/admin/sarpras')} className="w-full flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition-colors group">
               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-md bg-white border border-slate-200 flex items-center justify-center text-slate-600 group-hover:text-emerald-600 group-hover:border-emerald-200">
                   <Building2 className="w-4 h-4" />
                 </div>
                 <div className="text-left">
                   <p className="text-sm font-bold text-slate-800">Sarpras Inventaris</p>
                   <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">Fasilitas & Kondisi Aset</p>
                 </div>
               </div>
               <span className="text-xs font-bold text-slate-400 group-hover:text-emerald-600">→</span>
             </button>
          </CardContent>
        </Card>

        {/* COLUMN 3 */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <span className="w-1 h-4 bg-emerald-500 rounded"></span>
              <CardTitle>Komunikasi & Pengaturan</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
             <button onClick={() => navigate('/admin/announcements')} className="w-full flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-white border border-slate-200 flex items-center justify-center text-slate-600 group-hover:text-emerald-600 group-hover:border-emerald-200">
                    <Megaphone className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-slate-800">Pengumuman</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">Informasi & Kegiatan Sekolah</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-400 group-hover:text-emerald-600">→</span>
              </button>
             <button onClick={() => navigate('/kalender-akademik')} className="w-full flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-white border border-slate-200 flex items-center justify-center text-slate-600 group-hover:text-emerald-600 group-hover:border-emerald-200">
                    <CalendarIcon className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-slate-800">Kalender Akademik</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">Tahun Ajaran, Jadwal Libur, Ujian</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-400 group-hover:text-emerald-600">→</span>
              </button>
              <button onClick={() => navigate('/settings')} className="w-full flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-white border border-slate-200 flex items-center justify-center text-slate-600 group-hover:text-emerald-600 group-hover:border-emerald-200">
                    <Settings className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-slate-800">Konfigurasi Sistem</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">Profil Sekolah, Template Notifikasi</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-400 group-hover:text-emerald-600">→</span>
              </button>
          </CardContent>
        </Card>
      </div>

      {/* DESKTOP DASHBOARD WIDGETS */}
      <div className="hidden lg:grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-1 h-4 bg-emerald-500 rounded"></span>
                  <CardTitle>Ringkasan Kehadiran Hari Ini</CardTitle>
                </div>
                <button className="text-xs font-bold text-emerald-600 hover:text-emerald-700">Lihat Detail</button>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-4 gap-4">
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 text-center">
                  <p className="text-3xl font-black text-slate-800">{persenHadir}%</p>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Hadir (Siswa)</p>
                </div>
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-100 text-center">
                  <p className="text-3xl font-black text-amber-600">{totalSakit}</p>
                  <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mt-1">Sakit</p>
                </div>
                <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100 text-center">
                  <p className="text-3xl font-black text-indigo-600">{totalIzin}</p>
                  <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider mt-1">Izin</p>
                </div>
                <div className="p-4 bg-rose-50 rounded-lg border border-rose-100 text-center">
                  <p className="text-3xl font-black text-rose-600">{totalAlpa}</p>
                  <p className="text-xs font-bold text-rose-600 uppercase tracking-wider mt-1">Alpa</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-1 h-4 bg-emerald-500 rounded"></span>
                  <CardTitle>Kehadiran Mingguan</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4 h-64 w-full">
              <ResponsiveContainer width="100%" height={256}>
                <BarChart data={[
                  { name: 'Senin', Hadir: 400, Sakit: 10, Izin: 5, Alpa: 2 },
                  { name: 'Selasa', Hadir: 390, Sakit: 15, Izin: 8, Alpa: 4 },
                  { name: 'Rabu', Hadir: 410, Sakit: 5, Izin: 2, Alpa: 0 },
                  { name: 'Kamis', Hadir: 395, Sakit: 12, Izin: 6, Alpa: 4 },
                  { name: 'Jumat', Hadir: 380, Sakit: 20, Izin: 10, Alpa: 7 },
                ]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <Tooltip cursor={{ fill: 'transparent' }} />
                  <Bar dataKey="Hadir" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Sakit" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Izin" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <span className="w-1 h-4 bg-emerald-500 rounded"></span>
                <CardTitle>Aktivitas Sistem Terakhir</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                {[
                  { user: 'Budi Santoso (Admin)', action: 'Menambahkan data siswa baru Kelas X MIPA 1', time: '10 menit yang lalu' },
                  { user: 'Ahmad Fauzi (Guru)', action: 'Mengunggah nilai UTS Pendidikan Agama Islam', time: '35 menit yang lalu' },
                  { user: 'Siti Aminah (Walas)', action: 'Menyetujui perizinan sakit siswa (Ahmad)', time: '1 jam yang lalu' },
                  { user: 'System', action: 'Backup otomatis database harian berhasil', time: 'Semalam, 00:00' },
                ].map((log, i) => (
                  <div key={i} className="flex gap-4 items-start pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                    <div className="w-2 h-2 mt-1.5 rounded-full bg-emerald-500 shrink-0"></div>
                    <div>
                      <p className="text-sm text-slate-700">{log.action}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-bold text-slate-500">{log.user}</span>
                        <span className="text-[10px] text-slate-400">• {log.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
           <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <span className="w-1 h-4 bg-emerald-500 rounded"></span>
                <CardTitle>Tugas Tertunda (Admin)</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg">
                  <p className="text-xs font-bold text-amber-800">Backup Data Mingguan</p>
                  <p className="text-[10px] text-amber-600 mt-0.5">Disarankan melakukan pencadangan data sistem (Siswa & Akademik).</p>
                  <button onClick={() => window.alert('Pencadangan data telah dimulai...')} className="mt-2 text-[10px] font-bold bg-amber-200 text-amber-800 px-3 py-1 rounded hover:bg-amber-300 transition-colors">Backup Sekarang</button>
                </div>
                <div className="p-3 bg-rose-50 border border-rose-100 rounded-lg">
                  <p className="text-xs font-bold text-rose-800">Laporan Sarpras Rusak</p>
                  <p className="text-[10px] text-rose-600 mt-0.5">2 laporan fasilitas rusak (Proyektor Kelas XI, Kursi Lab).</p>
                  <button onClick={() => navigate('/admin/sarpras')} className="mt-2 text-[10px] font-bold bg-rose-200 text-rose-800 px-3 py-1 rounded hover:bg-rose-300 transition-colors">Lihat Detail</button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
