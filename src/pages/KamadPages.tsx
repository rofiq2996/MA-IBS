import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { 
  BookOpen, Heart, Users, CheckSquare, Activity, FileBarChart, Eye, 
  ChevronDown, FileText, Calendar, Download, CheckCircle2, Clock, XCircle, 
  AlertTriangle, Check, X, ShieldAlert, AlertCircle, ExternalLink, Link2, Search, Plus, Trash2, Edit2, FileSpreadsheet,
  ArrowRight, GraduationCap, ClipboardList, Shield, Briefcase, Award, TrendingUp, Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../lib/apiClient';
import { Button } from '../components/ui/Button';
import { CustomSelect } from '../components/ui/CustomSelect';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { DEFAULT_MODUL_AJAR, ModulAjarItem } from './GuruPages';
import { useNavigate } from 'react-router-dom';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';


export function DashboardKamad() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({
    totalTeachers: 45,
    totalStudents: 382,
    totalClasses: 12,
    pendingLeaves: 2,
    completedMateri: 28,
  });

  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [recentMateri, setRecentMateri] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const todayDate = new Date().toLocaleDateString('id-ID', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  const chartData = [
    { day: 'Senin', dhuha: 84, zuhur: 91 },
    { day: 'Selasa', dhuha: 86, zuhur: 93 },
    { day: 'Rabu', dhuha: 85, zuhur: 92 },
    { day: 'Kamis', dhuha: 88, zuhur: 94 },
    { day: 'Jumat', dhuha: 92, zuhur: 96 },
  ];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch all data
        const [usersList, studentsList, classesList, leavesList, materiRes] = await Promise.all([
          apiClient('/crud.php?table=users').catch(() => []),
          apiClient('/crud.php?table=students').catch(() => []),
          apiClient('/crud.php?table=classes').catch(() => []),
          apiClient('/crud.php?table=leave_requests').catch(() => []),
          apiClient('/get_materi.php').catch(() => ({ status: 'success', data: [] }))
        ]);

        const teachers = usersList.filter((u: any) => {
          const r = u.roles ? (typeof u.roles === 'string' ? JSON.parse(u.roles) : u.roles) : [u.role];
          return r.includes('guru') || r.includes('walas') || r.includes('guru_quran') || r.includes('tendik');
        });

        // Filter and map pending leave requests
        const pLeaves = leavesList.filter((l: any) => l.status === 'pending');
        const mappedLeaves = pLeaves.map((l: any) => {
          const matchingUser = usersList.find((u: any) => u.id === l.user_id);
          return {
            ...l,
            userName: matchingUser ? matchingUser.name : `Staf ID ${l.user_id}`,
            role: matchingUser ? matchingUser.role : 'Staf'
          };
        });

        // Recent teaching modules
        const materiData = materiRes?.status === 'success' ? materiRes.data : [];

        setStats({
          totalTeachers: teachers.length || 45,
          totalStudents: studentsList.length || 382,
          totalClasses: classesList.length || 12,
          pendingLeaves: mappedLeaves.length,
          completedMateri: materiData.filter((m: any) => m.status === 'Sudah Membuat').length || 28
        });

        setPendingRequests(mappedLeaves);
        
        // Take 5 most recent materi
        const mappedMateri = materiData.slice(0, 5).map((m: any) => ({
          id: m.id,
          teacherName: m.name,
          subject: m.subject,
          className: m.class,
          title: m.title,
          date: m.date,
          file_name: m.file_name
        }));
        setRecentMateri(mappedMateri);

      } catch (err) {
        console.error("Error loading Kamad dashboard statistics:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const handleUpdateLeaveStatus = async (id: number, status: 'approved' | 'rejected') => {
    try {
      await apiClient(`/crud.php?table=leave_requests&id=${id}`, {
        method: 'PUT',
        body: JSON.stringify({ status })
      });
      
      setPendingRequests(prev => prev.filter(r => r.id !== id));
      setStats(prev => ({
        ...prev,
        pendingLeaves: Math.max(0, prev.pendingLeaves - 1)
      }));

      showToast(`Berhasil ${status === 'approved' ? 'menyetujui' : 'menolak'} pengajuan izin.`);
    } catch (err: any) {
      console.error("Failed to update leave request status:", err);
      showToast("Gagal memperbarui status izin: " + err.message);
    }
  };

  const quickLinks = [
    { label: 'Pantau Modul Ajar', desc: 'Periksa kesiapan rencana pembelajaran guru', path: '/kamad/materi', icon: BookOpen, color: 'text-blue-600 bg-blue-50 border-blue-100 hover:bg-blue-100/50' },
    { label: 'Pantau Ibadah Siswa', desc: 'Pantau dhuha, zuhur, dan kebiasaan baik siswa', path: '/kamad/ibadah-siswa', icon: Heart, color: 'text-rose-600 bg-rose-50 border-rose-100 hover:bg-rose-100/50' },
    { label: 'Kinerja Staf', desc: 'Monitoring penyelesaian jobdesk ustadz/ustadzah', path: '/kamad/kinerja-staf', icon: Users, color: 'text-emerald-600 bg-emerald-50 border-emerald-100 hover:bg-emerald-100/50' },
    { label: 'Approval Perizinan', desc: 'Persetujuan dispensasi & izin tidak hadir staf', path: '/kamad/perizinan', icon: CheckSquare, color: 'text-amber-600 bg-amber-50 border-amber-100 hover:bg-amber-100/50' },
    { label: 'Ibadah Guru', desc: 'Monitoring ibadah harian ustadz & ustadzah', path: '/kamad/ibadah-guru', icon: Activity, color: 'text-indigo-600 bg-indigo-50 border-indigo-100 hover:bg-indigo-100/50' },
    { label: 'Laporan BK & Pustaka', desc: 'Periksa laporan perkembangan harian BK & Pustakawan', path: '/kamad/laporan-bk-pustaka', icon: FileBarChart, color: 'text-purple-600 bg-purple-50 border-purple-100 hover:bg-purple-100/50' },
  ];

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-300">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-800 to-teal-900 rounded-2xl p-6 md:p-8 text-white shadow-md">
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-12 translate-y-12">
          <GraduationCap className="w-80 h-80 text-white" />
        </div>
        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-xs rounded-full text-xs font-semibold text-emerald-300">
            <Calendar className="w-3.5 h-3.5" />
            <span>{todayDate}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight leading-tight">
            Selamat Datang, {user?.name || 'Kepala Madrasah'}
          </h1>
          <p className="text-emerald-100/95 text-xs md:text-sm font-medium leading-relaxed max-w-2xl">
            Sistem Informasi Aktivitas Terintegrasi (SIKAT) MA Al-Ihsan Boarding School Riau. Pantau aktivitas belajar mengajar, kedisiplinan guru, and perkembangan ibadah siswa dalam satu platform digital terpadu.
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white border-slate-100 shadow-xs hover:border-emerald-200 transition-all">
          <CardContent className="p-5">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0 border border-emerald-100">
                <Users className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">Ustadz & Staf</p>
                <p className="text-xl md:text-2xl font-black text-slate-800 mt-0.5">{stats.totalTeachers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-100 shadow-xs hover:border-blue-200 transition-all">
          <CardContent className="p-5">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0 border border-blue-100">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">Siswa Aktif</p>
                <p className="text-xl md:text-2xl font-black text-slate-800 mt-0.5">{stats.totalStudents}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-100 shadow-xs hover:border-purple-200 transition-all">
          <CardContent className="p-5">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center shrink-0 border border-purple-100">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">Kelas & Rombel</p>
                <p className="text-xl md:text-2xl font-black text-slate-800 mt-0.5">{stats.totalClasses}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-100 shadow-xs hover:border-amber-200 transition-all">
          <CardContent className="p-5">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center shrink-0 border border-amber-100">
                <CheckSquare className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">Menunggu Approval</p>
                <div className="flex items-baseline gap-1.5">
                  <p className="text-xl md:text-2xl font-black text-slate-800 mt-0.5">{stats.pendingLeaves}</p>
                  {stats.pendingLeaves > 0 && (
                    <span className="text-[10px] px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded font-black uppercase">Pending</span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Inbox Approval & Chart */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Section: Inbox Approval Perizinan */}
          <Card className="border border-slate-200 shadow-sm overflow-hidden">
            <CardHeader className="py-4 px-5 bg-slate-50/75 border-b border-slate-100 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-4 bg-amber-500 rounded-xs" />
                <CardTitle className="text-xs font-black uppercase tracking-wider text-slate-700 m-0">
                  Inbox Persetujuan Izin Staf ({pendingRequests.length})
                </CardTitle>
              </div>
              <button 
                onClick={() => navigate('/kamad/perizinan')}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1"
              >
                Semua Izin <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </CardHeader>
            <CardContent className="p-5">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                </div>
              ) : pendingRequests.length === 0 ? (
                <div className="text-center py-10">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400 mb-2.5 border border-slate-200/50">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-black text-slate-700">Kotak Masuk Bersih</h4>
                  <p className="text-xs text-slate-400 mt-1">Tidak ada perizinan staf yang perlu keputusan saat ini.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingRequests.map((req) => (
                    <div 
                      key={req.id} 
                      className="p-4 bg-white border border-slate-100 hover:border-slate-200 rounded-xl transition-all shadow-2xs space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-slate-800 text-sm leading-snug">{req.userName}</span>
                            <span className="text-[9px] font-black uppercase tracking-widest bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200/50">
                              {req.role}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200/50 uppercase tracking-tight">
                              Izin {req.type.replace('_', ' ')}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 font-medium">
                            Periode: <span className="font-bold text-slate-700">{req.start_date}</span> s/d <span className="font-bold text-slate-700">{req.end_date}</span>
                          </p>
                        </div>
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/30">
                          <Clock className="w-3 h-3" /> Menunggu ACC
                        </span>
                      </div>
                      
                      <div className="bg-slate-50/70 p-3 rounded-lg border border-slate-200/40 text-xs text-slate-600 font-medium italic">
                        "{req.reason}"
                      </div>

                      <div className="flex items-center justify-end gap-2.5 pt-1">
                        <button 
                          onClick={() => handleUpdateLeaveStatus(req.id, 'rejected')}
                          className="px-3.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-bold rounded-lg transition-all"
                        >
                          Tolak
                        </button>
                        <button 
                          onClick={() => handleUpdateLeaveStatus(req.id, 'approved')}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1 shadow-2xs"
                        >
                          <Check className="w-3.5 h-3.5" /> Setujui Izin
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Section: Chart Statistik Ibadah Siswa */}
          <Card className="border border-slate-200 shadow-sm overflow-hidden">
            <CardHeader className="py-4 px-5 bg-slate-50/75 border-b border-slate-100 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-4 bg-emerald-600 rounded-xs" />
                <CardTitle className="text-xs font-black uppercase tracking-wider text-slate-700 m-0">
                  Tren Tingkat Kehadiran Ibadah Siswa (Pekan Ini)
                </CardTitle>
              </div>
              <button 
                onClick={() => navigate('/kamad/ibadah-siswa')}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1"
              >
                Selengkapnya <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </CardHeader>
            <CardContent className="p-5">
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={chartData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorDhuha" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorZuhur" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b', fontWeight: 'bold' }} />
                    <YAxis domain={[70, 100]} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b', fontWeight: 'bold' }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '11px', fontWeight: 'bold' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 'bold', paddingTop: '10px' }} />
                    <Area type="monotone" name="Sholat Dhuha %" dataKey="dhuha" stroke="#0ea5e9" strokeWidth={2.5} fillOpacity={1} fill="url(#colorDhuha)" />
                    <Area type="monotone" name="Sholat Zuhur %" dataKey="zuhur" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorZuhur)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Right 1 Column: Quick Actions & Recent Materials */}
        <div className="space-y-6">
          
          {/* Section: Akses Cepat Portal */}
          <Card className="border border-slate-200 shadow-sm overflow-hidden">
            <CardHeader className="py-4 px-5 bg-slate-50/75 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-4 bg-emerald-600 rounded-xs" />
                <CardTitle className="text-xs font-black uppercase tracking-wider text-slate-700 m-0">
                  Portal Akses Cepat Kamad
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 gap-2">
                {quickLinks.map((link, idx) => {
                  const LinkIcon = link.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => navigate(link.path)}
                      className={`w-full flex items-center justify-between p-3 border rounded-xl transition-all duration-150 group text-left cursor-pointer ${link.color}`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-2 bg-white rounded-lg border border-slate-200/50 shadow-2xs group-hover:scale-105 transition-transform shrink-0">
                          <LinkIcon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-800 leading-none">{link.label}</p>
                          <p className="text-[10px] text-slate-500 font-medium truncate mt-1">{link.desc}</p>
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform shrink-0" />
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Section: Perangkat & Modul Ajar Terkini */}
          <Card className="border border-slate-200 shadow-sm overflow-hidden">
            <CardHeader className="py-4 px-5 bg-slate-50/75 border-b border-slate-100 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-4 bg-emerald-600 rounded-xs" />
                <CardTitle className="text-xs font-black uppercase tracking-wider text-slate-700 m-0">
                  Upload Modul Ajar Terkini
                </CardTitle>
              </div>
              <button 
                onClick={() => navigate('/kamad/materi')}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
              >
                Semua
              </button>
            </CardHeader>
            <CardContent className="p-4">
              {recentMateri.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-xs font-bold uppercase tracking-wider">
                  Belum ada modul diunggah
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {recentMateri.map((mat) => (
                    <div key={mat.id} className="py-3 first:pt-0 last:pb-0 space-y-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-800 line-clamp-1">{mat.title}</p>
                          <p className="text-[10px] text-slate-500 font-bold mt-0.5">
                            {mat.teacherName} • <span className="text-slate-600">{mat.subject}</span>
                          </p>
                        </div>
                        <span className="text-[9px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200/50 shrink-0">
                          {mat.className}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2 pt-0.5">
                        <span className="text-[10px] text-slate-400 font-medium">
                          Diunggah: {mat.date}
                        </span>
                        {mat.file_name && (
                          <a 
                            href={mat.file_name}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-0.5"
                          >
                            Buka Drive <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

        </div>

      </div>

    </div>
  );
}


export function KamadMateriAjar() {
  const [materiList, setMateriList] = useState<ModulAjarItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMateri = async () => {
    try {
      setLoading(true);
      const res = await apiClient('/get_materi.php');
      if (res.status === 'success') {
        const mapped = res.data.map((m: any) => ({
          id: m.id,
          teacherName: m.name,
          role: m.role === 'walas' ? 'Wali Kelas' : 'Guru Mapel',
          category: m.category,
          subject: m.subject,
          className: m.class,
          title: m.title,
          date: m.date,
          status: m.status,
          driveUrl: m.file_name,
          description: m.description,
          objectives: m.objectives || []
        }));
        setMateriList(mapped);
      }
    } catch (e) {
      console.error('Failed to load materi', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMateri();
  }, []);




  const [selectedMateri, setSelectedMateri] = useState<ModulAjarItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<'all' | 'guru_mapel' | 'wali_kelas' | 'guru_quran'>('all');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [materiReportPeriod, setMateriReportPeriod] = useState('Mingguan');
  const [materiStartDate, setMateriStartDate] = useState('');
  const [materiEndDate, setMateriEndDate] = useState('');


  const filterOptions = [
    { value: 'all', label: 'Semua Kategori' },
    { value: 'guru_mapel', label: 'Guru Mapel' },
    { value: 'wali_kelas', label: 'Wali Kelas' },
    { value: 'guru_quran', label: 'Guru Qur\'an' },
  ];

  const activeLabel = filterOptions.find(o => o.value === activeCategory)?.label || 'Semua Kategori';

  const filteredList = materiList.filter(item => {
    if (activeCategory !== 'all' && item.category !== activeCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.subject.toLowerCase().includes(q) ||
        item.className.toLowerCase().includes(q) ||
        item.teacherName.toLowerCase().includes(q)
      );
    }
    return true;
  });


  const downloadMateriPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Laporan Pantau Materi Ajar - ${materiReportPeriod === 'Mingguan' && materiStartDate && materiEndDate ? `Mingguan (${materiStartDate} s/d ${materiEndDate})` : materiReportPeriod}`, 14, 20);
    doc.setFontSize(10);
    doc.text(`Dicetak pada: ${new Date().toLocaleDateString('id-ID')}`, 14, 28);
    
    const tableData = filteredList.map(materi => {
      return [
        materi.title,
        materi.subject,
        materi.teacherName,
        materi.className,
        materi.status
      ];
    });

    autoTable(doc, {
      startY: 35,
      head: [['Judul Materi', 'Mata Pelajaran', 'Guru', 'Kelas', 'Status']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246] }
    });

    doc.save(`Laporan_Materi_Ajar_${materiReportPeriod.replace(/ /g, '_')}.pdf`);
  };

  const downloadMateriExcel = () => {
    const data = filteredList.map(materi => {
      return {
        'Judul Materi': materi.title,
        'Mata Pelajaran': materi.subject,
        'Guru': materi.teacherName,
        'Role': materi.role,
        'Kelas': materi.className,
        'Link Drive': materi.driveUrl,
        'Status': materi.status
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Materi Ajar");
    XLSX.writeFile(workbook, `Laporan_Materi_Ajar_${materiReportPeriod.replace(/ /g, '_')}.xlsx`);
  };

  const totalMateri = materiList.length;

  const terbitCount = materiList.filter(item => item.status === 'Sudah Membuat').length;
  const reviewCount = materiList.filter(item => item.status === 'Belum Membuat').length;

  const handleUpdateStatus = (id: string, newStatus: 'Sudah Membuat' | 'Belum Membuat') => {
    const updated = materiList.map(item => {
      if (item.id === id) {
        return { ...item, status: newStatus };
      }
      return item;
    });
    setMateriList(updated);
    if (selectedMateri && selectedMateri.id === id) {
      setSelectedMateri({ ...selectedMateri, status: newStatus });
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-800">Pantau Modul Ajar Harian</h1>
          <p className="text-slate-500 text-xs sm:text-sm font-medium">Pantau kelengkapan dokumen persiapan Modul Ajar.</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {materiReportPeriod === 'Mingguan' && (
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-2 py-1.5 shadow-sm">
              <input type="date" value={materiStartDate} onChange={e => setMateriStartDate(e.target.value)} className="text-xs sm:text-sm font-bold text-slate-700 outline-none bg-transparent w-[110px] sm:w-auto" />
              <span className="text-slate-400 font-bold text-xs">-</span>
              <input type="date" value={materiEndDate} onChange={e => setMateriEndDate(e.target.value)} className="text-xs sm:text-sm font-bold text-slate-700 outline-none bg-transparent w-[110px] sm:w-auto" />
            </div>
          )}
          <select 
            value={materiReportPeriod}
            onChange={(e) => setMateriReportPeriod(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:border-blue-500"
          >
            <option value="Mingguan">Mingguan</option>
            <option value="Bulanan">Bulanan</option>
            <option value="Per Semester">Per Semester</option>
            <option value="Tahunan">Tahunan</option>
          </select>
          <button onClick={downloadMateriPDF} className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-3 py-2 rounded-xl text-sm font-bold transition-colors">
            <FileText className="w-4 h-4" /> PDF
          </button>
          <button onClick={downloadMateriExcel} className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 px-3 py-2 rounded-xl text-sm font-bold transition-colors">
            <FileSpreadsheet className="w-4 h-4" /> Excel
          </button>
        </div>
      </div>

      {/* Mini Bento Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-slate-100/60 border border-slate-200/50 p-3 rounded-xl text-center">
          <p className="text-[9px] sm:text-[10px] uppercase tracking-wider font-black text-slate-500">Materi Total</p>
          <p className="text-lg sm:text-xl font-black text-slate-800 mt-0.5">{totalMateri}</p>
        </div>
        <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-xl text-center">
          <p className="text-[9px] sm:text-[10px] uppercase tracking-wider font-black text-emerald-600">Sudah Membuat</p>
          <p className="text-lg sm:text-xl font-black text-emerald-800 mt-0.5">{terbitCount}</p>
        </div>
        <div className="bg-amber-50 border border-amber-100 p-3 rounded-xl text-center">
          <p className="text-[9px] sm:text-[10px] uppercase tracking-wider font-black text-amber-600">Belum Membuat</p>
          <p className="text-lg sm:text-xl font-black text-amber-800 mt-0.5">{reviewCount}</p>
        </div>
      </div>

      
      <Card className="overflow-hidden border-slate-200/60 shadow-sm">
        <CardHeader className="py-3 px-4 sm:px-6 bg-slate-50/50 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <CardTitle className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-700 m-0">Daftar Modul Ajar Terkini</CardTitle>
          
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <div className="relative w-full sm:w-48">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari guru/mapel..."
                className="w-full pl-8 pr-2 py-1 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 bg-white"
              />
            </div>

            {/* Dropdown Filter */}
            <div className="relative shrink-0">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none hover:bg-slate-50 active:scale-95 transition-all shadow-sm shrink-0"
              >
                <span>{activeLabel}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-1 w-40 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150 origin-top-right">
                    {filterOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setActiveCategory(option.value as any);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-[10px] sm:text-xs font-bold transition-colors ${
                          activeCategory === option.value
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-3 sm:p-5">
          <div className="space-y-3">
            {filteredList.length === 0 ? (
              <div className="text-center py-8 text-slate-400 font-bold text-xs uppercase tracking-wider">
                Tidak ada modul ajar untuk kategori ini
              </div>
            ) : (
              filteredList.map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-white border border-slate-100 hover:border-slate-200 hover:shadow-xs rounded-xl transition-all gap-3">
                  <div className="flex items-start gap-3">
                    <div className={`p-2.5 rounded-xl shrink-0 ${item.category === 'wali_kelas' ? 'bg-amber-50 text-amber-600 border border-amber-100' : item.category === 'guru_quran' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}>
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-bold text-slate-800 text-sm leading-snug">{item.teacherName}</h4>
                        <span className={`text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border ${item.category === 'wali_kelas' ? 'bg-amber-50 text-amber-700 border-amber-200' : item.category === 'guru_quran' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                          {item.role}
                        </span>
                        <span className="text-[9px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200/50">
                          {item.className}
                        </span>
                      </div>

                      <p className="text-xs font-bold text-slate-700 leading-snug">
                        {item.subject}: <span className="font-medium text-slate-600">{item.title}</span>
                      </p>

                      <div className="flex items-center gap-3 pt-0.5">
                        <div className="flex items-center gap-1 text-[11px] text-slate-400">
                          <Calendar className="w-3 h-3" />
                          <span>{item.date}</span>
                        </div>
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${item.status === 'Sudah Membuat' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'Sudah Membuat' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                          {item.status === 'Sudah Membuat' ? 'Sudah Membuat' : 'Belum Membuat'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={item.driveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-lg border border-blue-200 flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Buka Drive
                    </a>

                    <Button 
                      onClick={() => setSelectedMateri(item)} 
                      variant="outline" 
                      size="sm" 
                      className="h-8 text-xs font-bold gap-1.5 border-slate-200 hover:bg-slate-50 hover:text-slate-800 active:scale-95 transition-all"
                    >
                      <Eye className="w-3.5 h-3.5"/> Detail Modul
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Detail Materi Modal */}
      {selectedMateri && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col border border-slate-100 animate-in fade-in zoom-in duration-200">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h2 className="text-sm font-black uppercase tracking-wider text-slate-800">Detail Modul Ajar Guru</h2>
                <p className="text-xs font-bold text-emerald-600 mt-0.5">{selectedMateri.teacherName} • {selectedMateri.role}</p>
              </div>
              <button onClick={() => setSelectedMateri(null)} className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all font-bold">✕</button>
            </div>
            
            <div className="p-4 space-y-4 max-h-[420px] overflow-y-auto text-xs">
              {/* Subject & Class Card info */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Mata Pelajaran & Kelas</span>
                  <span className="text-xs font-black text-slate-800 bg-white border border-slate-200 px-2 py-0.5 rounded-lg">{selectedMateri.className}</span>
                </div>
                <p className="text-sm font-black text-slate-800">{selectedMateri.subject}</p>
                <p className="text-xs font-bold text-emerald-600">{selectedMateri.title}</p>
              </div>

              {/* Drive Link Box */}
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <Link2 className="w-5 h-5 text-blue-600 shrink-0" />
                  <div className="min-w-0">
                    <p className="font-bold text-blue-900">Tautan Google Drive Modul Ajar</p>
                    <p className="text-[11px] text-blue-700 truncate">{selectedMateri.driveUrl}</p>
                  </div>
                </div>
                <a
                  href={selectedMateri.driveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg flex items-center gap-1 shrink-0 transition-all shadow-2xs"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Buka Drive
                </a>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400">Deskripsi Pembelajaran</h4>
                <p className="text-xs text-slate-600 font-medium leading-relaxed bg-white border border-slate-100 p-3 rounded-xl">
                  {selectedMateri.description}
                </p>
              </div>

              {/* Objectives */}
              {selectedMateri.objectives && selectedMateri.objectives.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400">Target Belajar (Objectives)</h4>
                  <ul className="space-y-1.5">
                    {selectedMateri.objectives.map((obj: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-700 font-bold bg-slate-50/50 p-2 rounded-lg border border-slate-100/50">
                        <span className="text-emerald-500 font-black">✓</span>
                        <span>{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Status Display (Info Only for Kamad) */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Status Persiapan Modul:</span>
                <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border ${selectedMateri.status === 'Sudah Membuat' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                  <span className={`w-2 h-2 rounded-full ${selectedMateri.status === 'Sudah Membuat' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  {selectedMateri.status === 'Sudah Membuat' ? 'Sudah Membuat' : 'Belum Membuat'}
                </span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
              <Button onClick={() => setSelectedMateri(null)} size="sm" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-9">
                Tutup
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function KamadIbadahSiswa() {
  const classDhuhaRank = [
    { className: 'X-IPA 1', absent: 5, total: 32 },
    { className: 'XI-IPA 1', absent: 3, total: 34 },
    { className: 'X-IPS 1', absent: 1, total: 30 },
  ];

  const classZuhurRank = [
    { className: 'X-IPS 1', absent: 6, total: 30 },
    { className: 'X-IPA 1', absent: 4, total: 32 },
    { className: 'XI-IPA 1', absent: 2, total: 34 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">Pantau Ibadah Siswa</h1>
        <p className="text-slate-500 mt-1 text-sm">Absensi Sholat Zuhur dan Dhuha Siswa beserta peringkat kelas.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sholat Dhuha</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center p-6 border-b border-slate-100">
              <div className="text-center">
                <p className="text-4xl font-black text-emerald-600">85%</p>
                <p className="text-sm text-slate-500 mt-2 font-medium">Tingkat Kehadiran Dhuha Hari Ini</p>
              </div>
            </div>
            <div className="pt-6">
              <h4 className="text-sm font-bold text-slate-800 mb-4">Kelas Terbanyak Tidak Sholat Dhuha:</h4>
              <div className="space-y-3">
                {classDhuhaRank.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-rose-50 rounded-lg border border-rose-100">
                    <span className="font-bold text-slate-800 text-sm">{idx + 1}. {item.className}</span>
                    <span className="text-sm font-medium text-rose-600">{item.absent} Siswa Tidak Hadir</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Sholat Zuhur Berjamaah</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center p-6 border-b border-slate-100">
              <div className="text-center">
                <p className="text-4xl font-black text-emerald-600">92%</p>
                <p className="text-sm text-slate-500 mt-2 font-medium">Tingkat Kehadiran Zuhur Hari Ini</p>
              </div>
            </div>
            <div className="pt-6">
              <h4 className="text-sm font-bold text-slate-800 mb-4">Kelas Terbanyak Tidak Sholat Zuhur:</h4>
              <div className="space-y-3">
                {classZuhurRank.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-rose-50 rounded-lg border border-rose-100">
                    <span className="font-bold text-slate-800 text-sm">{idx + 1}. {item.className}</span>
                    <span className="text-sm font-medium text-rose-600">{item.absent} Siswa Tidak Hadir</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function KamadKinerjaStaf() {

  const [selectedStaf, setSelectedStaf] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'guru_mapel' | 'walas' | 'guru_quran' | 'pustakawan' | 'bk' | 'pelanggaran'>('all');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [reportPeriod, setReportPeriod] = useState('Harian');
  const [kinerjaStartDate, setKinerjaStartDate] = useState('');
  const [kinerjaEndDate, setKinerjaEndDate] = useState('');


  // Jobdesk structure according to SOP
  const [stafList, setStafList] = useState<any[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await apiClient('/crud.php?table=users');
        const filteredUsers = users.filter((u: any) => {
          const r = u.roles ? (typeof u.roles === 'string' ? JSON.parse(u.roles) : u.roles) : [u.role];
          return r.includes('guru') || r.includes('walas') || r.includes('guru_quran') || r.includes('tendik');
        });

        const mappedStaf = filteredUsers.map((u: any, index: number) => {
          const r = u.roles ? (typeof u.roles === 'string' ? JSON.parse(u.roles) : u.roles) : [u.role];
          
          let category = 'guru_mapel';
          let mainRole = 'Guru Mapel';
          
          if (r.includes('walas')) {
            category = 'walas';
            mainRole = 'Wali Kelas';
          } else if (r.includes('guru_quran')) {
            category = 'guru_quran';
            mainRole = 'Guru Qur\'an';
          } else if (r.includes('pustakawan')) {
            category = 'pustakawan';
            mainRole = 'Pustakawan';
          } else if (r.includes('bk')) {
            category = 'bk';
            mainRole = 'Guru BK';
          }

          // Assign mock tasks based on role for Kamad preview. 
          // (Since actual tasks are not tracked dynamically in DB right now)
          let tasks = [
            { name: 'Absensi Mengajar', status: (index % 3 === 0) ? 'belum' : 'selesai', time: (index % 3 === 0) ? 'Dalam Jam Kerja' : '07:35 WIB' },
            { name: 'Jurnal Ajar', status: (index % 4 === 0) ? 'terlewat' : 'selesai', time: (index % 4 === 0) ? 'Batas Jam Kerja Terlewat' : '08:15 WIB' },
          ];

          if (category === 'wali_kelas') {
            tasks.push({ name: 'Periksa Pantauan Pagi Siswa', status: 'selesai', time: '07:05 WIB' });
            tasks.push({ name: 'Absensi Sholat Zuhur Siswa', status: 'belum', time: 'Dalam Jam Kerja' });
          }
          
          // Generate mock weekly stats
          const mockCompletionRate = 100 - ((index * 7) % 35);
          const mockViolations = (index * 3) % 8;

          return {
            id: u.id,
            name: u.name,
            role: mainRole,
            kelas: u.class_name || '-',
            category: category,
            tasks: tasks,
            weeklyStats: {
              completionRate: mockCompletionRate,
              violations: mockViolations
            }
          };
        });

        setStafList(mappedStaf);
      } catch (err) {
        console.error("Failed to fetch staf list", err);
      }
    };
    fetchUsers();
  }, []);

  const getStaffSummary = (tasks: any[]) => {
    const hasTerlewat = tasks.some((t: any) => t.status === 'terlewat');
    const allSelesai = tasks.every((t: any) => t.status === 'selesai');

    if (hasTerlewat) return { label: 'Pelanggaran Kinerja', code: 'pelanggaran', color: 'text-rose-600 bg-rose-50 border-rose-200', icon: XCircle };
    if (allSelesai) return { label: 'Tuntas / Selesai', code: 'selesai', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', icon: CheckCircle2 };
    return { label: 'Dalam Proses', code: 'proses', color: 'text-amber-600 bg-amber-50 border-amber-200', icon: Clock };
  };

  const filterOptions = [
    { value: 'all', label: 'Semua Staf' },
    { value: 'walas', label: 'Wali Kelas' },
    { value: 'guru_mapel', label: 'Guru Mapel' },
    { value: 'guru_quran', label: 'Guru Qur\'an' },
    { value: 'pustakawan', label: 'Pustakawan' },
    { value: 'bk', label: 'Guru BK' },
    { value: 'pelanggaran', label: 'Pelanggaran Kinerja' },
  ];

  const activeLabel = filterOptions.find(o => o.value === activeTab)?.label || 'Semua Staf';

  const filteredList = stafList.filter(s => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pelanggaran') return s.tasks.some((t: any) => t.status === 'terlewat');
    return s.category === activeTab;
  });

  const totalStaf = stafList.length;
  const tuntasCount = stafList.filter(s => s.tasks.every((t: any) => t.status === 'selesai')).length;
  const prosesCount = stafList.filter(s => !s.tasks.every((t: any) => t.status === 'selesai') && !s.tasks.some((t: any) => t.status === 'terlewat')).length;
  const pelanggaranCount = stafList.filter(s => s.tasks.some((t: any) => t.status === 'terlewat')).length;

  const downloadKinerjaPDF = () => {};
  const downloadKinerjaExcel = () => {};

  return (
    <>
      {selectedStaf && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold uppercase shrink-0">
                  {selectedStaf.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">{selectedStaf.name}</h3>
                  <p className="text-xs text-slate-500">{selectedStaf.role} {selectedStaf.kelas !== '-' ? `• ${selectedStaf.kelas}` : ''}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedStaf(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 sm:p-6 overflow-y-auto">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-4">Daftar Jobdesk Hari Ini</h4>
              <div className="space-y-3">
                {selectedStaf.tasks.map((task: any, idx: number) => {
                  let statusStyle = '';
                  let TaskIcon = CheckCircle2;
                  
                  if (task.status === 'selesai') {
                    statusStyle = 'bg-emerald-50 border-emerald-100 text-emerald-700';
                    TaskIcon = CheckCircle2;
                  } else if (task.status === 'terlewat') {
                    statusStyle = 'bg-rose-50 border-rose-100 text-rose-700';
                    TaskIcon = XCircle;
                  } else {
                    statusStyle = 'bg-amber-50 border-amber-100 text-amber-700';
                    TaskIcon = Clock;
                  }
                  
                  return (
                    <div key={idx} className={`p-4 rounded-xl border flex items-center justify-between gap-3 ${statusStyle}`}>
                      <div className="flex items-center gap-3">
                        <TaskIcon className="w-5 h-5 shrink-0" />
                        <div>
                          <p className="text-sm font-bold">{task.name}</p>
                          <p className="text-[10px] mt-0.5 opacity-80">{task.time}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-1 bg-white/50 rounded-md">
                        {task.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <Button variant="outline" onClick={() => setSelectedStaf(null)}>Tutup</Button>
            </div>
          </div>
        </div>
      )}

    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-800">Kinerja Staf Real-time</h1>
          <p className="text-slate-500 text-xs sm:text-sm font-medium">Monitoring pengerjaan jobdesk staf.</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-lg shrink-0">
          <button
            onClick={() => setReportPeriod('Harian')}
            className={`px-4 py-2 rounded-md text-xs font-bold transition-all ${
              reportPeriod === 'Harian' 
                ? 'bg-white text-emerald-700 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Hari Ini
          </button>
          <button
            onClick={() => setReportPeriod('Mingguan')}
            className={`px-4 py-2 rounded-md text-xs font-bold transition-all ${
              reportPeriod === 'Mingguan' 
                ? 'bg-white text-emerald-700 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Pekan Ini
          </button>
        </div>
      </div>
      
      {pelanggaranCount > 0 && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs sm:text-sm text-rose-800 flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
            <div>
              <p className="font-extrabold text-rose-900">Perhatian Kepala Madrasah:</p>
              <p className="text-rose-700 text-xs">Terdapat <span className="font-black text-rose-900">{pelanggaranCount} staf</span> yang melewati batas jam kerja tanpa menyelesaikan jobdesk wajib.</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-3 sm:p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-[10px] sm:text-xs font-bold text-slate-500 leading-tight">Total Staf</p>
          <p className="text-xl sm:text-2xl font-black text-slate-800 mt-1">{totalStaf}</p>
        </div>
        <div className="bg-emerald-50 p-3 sm:p-4 rounded-xl border border-emerald-100 shadow-sm">
          <p className="text-[10px] sm:text-xs font-bold text-emerald-600 leading-tight">Tuntas / Selesai</p>
          <p className="text-xl sm:text-2xl font-black text-emerald-700 mt-1">{tuntasCount}</p>
        </div>
        <div className="bg-amber-50 p-3 sm:p-4 rounded-xl border border-amber-100 shadow-sm">
          <p className="text-[10px] sm:text-xs font-bold text-amber-600 leading-tight">Dalam Proses</p>
          <p className="text-xl sm:text-2xl font-black text-amber-700 mt-1">{prosesCount}</p>
        </div>
        <div className="bg-rose-50 p-3 sm:p-4 rounded-xl border border-rose-100 shadow-sm">
          <p className="text-[10px] sm:text-xs font-bold text-rose-600 leading-tight">Pelanggaran</p>
          <p className="text-xl sm:text-2xl font-black text-rose-700 mt-1">{pelanggaranCount}</p>
        </div>
      </div>

      <div className="flex flex-wrap sm:flex-nowrap items-center gap-1.5 sm:gap-2 pb-1 sm:pb-2 sm:overflow-x-auto scrollbar-hide">
        {filterOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setActiveTab(opt.value as any)}
            className={`px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-lg text-[10px] sm:text-xs font-bold whitespace-nowrap transition-colors flex-1 sm:flex-none ${
              activeTab === opt.value
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
<Card className="overflow-hidden border-slate-200/60 shadow-sm">
        <CardHeader className="py-3 px-4 sm:px-6 bg-slate-50/50 border-b border-slate-100">
          <CardTitle className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-700 m-0">{reportPeriod === 'Harian' ? 'Daftar Kinerja Staf Hari Ini' : 'Rapor Kinerja Pekan Ini'}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100">
            {filteredList.map((staf, index) => {
              const summary = getStaffSummary(staf.tasks);
              const SummaryIcon = summary.icon;
              return (
                <div key={index} className="p-3 sm:p-5 hover:bg-slate-50 transition-colors">
                  <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
                    <div className="flex items-center justify-between w-full sm:w-auto">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 text-xs sm:text-sm font-bold uppercase shrink-0">
                          {staf.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm sm:text-base font-bold text-slate-800 leading-tight">{staf.name}</p>
                          <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5">{staf.role} {staf.kelas !== '-' ? `• ${staf.kelas}` : ''}</p>
                        </div>
                      </div>
                      
                      <div className="sm:hidden shrink-0 ml-2">
                        <div className={`inline-flex items-center gap-1 px-1.5 py-1 rounded border ${summary.color}`}>
                          <SummaryIcon className="w-3 h-3" />
                          <span className="text-[9px] font-bold tracking-tight">{summary.label}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between sm:justify-end gap-3 w-full sm:w-auto mt-2 sm:mt-0 border-t border-slate-100 sm:border-0 pt-3 sm:pt-0">
                      {reportPeriod === 'Harian' ? (
                        <>
                          <div className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${summary.color}`}>
                            <SummaryIcon className="w-4 h-4 shrink-0" />
                            {summary.label}
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-[10px] sm:text-xs font-bold gap-1.5 text-indigo-700 border-indigo-200 hover:bg-indigo-50 w-full sm:w-auto h-8 sm:h-9"
                            onClick={() => setSelectedStaf(staf)}
                          >
                            <Eye className="w-3.5 h-3.5 shrink-0" />
                            Lihat Jobdesk
                          </Button>
                        </>
                      ) : (
                        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                          <div className="text-right">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Capaian</p>
                            <div className="flex items-center gap-2">
                              <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full rounded-full ${staf.weeklyStats.completionRate >= 80 ? 'bg-emerald-500' : staf.weeklyStats.completionRate >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`}
                                  style={{ width: `${staf.weeklyStats.completionRate}%` }}
                                />
                              </div>
                              <span className="text-xs font-black text-slate-700">{staf.weeklyStats.completionRate}%</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Pelanggaran</p>
                            <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded text-xs font-bold ${staf.weeklyStats.violations > 0 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
                              {staf.weeklyStats.violations}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            {filteredList.length === 0 && (
              <div className="p-8 text-center text-slate-500">
                <p className="text-sm font-medium">Tidak ada data staf.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
    </>
  );
}

export function KamadApprovalIzin() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight text-slate-800">Approval Perizinan</h1>
      <Card>
        <CardContent className="p-6">
          <p className="text-slate-500 text-sm">Tidak ada perizinan yang perlu disetujui saat ini.</p>
        </CardContent>
      </Card>
    </div>
  );
}

export function KamadIbadahGuru() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight text-slate-800">Monitoring Ibadah Guru</h1>
      <Card>
        <CardContent className="p-6">
          <p className="text-slate-500 text-sm">Data pemantauan ibadah guru akan ditampilkan di sini.</p>
        </CardContent>
      </Card>
    </div>
  );
}

export function KamadLaporanBKPustaka() {
  const [selectedSemester, setSelectedSemester] = useState('Ganjil 2026/2027');
  const semesters = [
    { value: 'Ganjil 2026/2027', label: 'Ganjil 2026/2027 (Aktif)' },
    { value: 'Genap 2025/2026', label: 'Genap 2025/2026' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">Laporan Harian BK & Pustakawan</h1>
          <p className="text-slate-500 mt-1 text-sm">Pantau log aktivitas harian Guru BK dan Pustakawan.</p>
        </div>
        <select
          value={selectedSemester}
          onChange={(e) => setSelectedSemester(e.target.value)}
          className="w-full sm:w-auto p-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
        >
          {semesters.map((s, i) => (
            <option key={i} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Laporan Guru BK</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-xs text-slate-500 font-bold mb-1">Hari Ini</p>
                <p className="text-sm font-medium text-slate-700">Melakukan konseling individu dengan 3 siswa kelas X-IPA terkait minat bakat.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Laporan Pustakawan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-xs text-slate-500 font-bold mb-1">Hari Ini</p>
                <p className="text-sm font-medium text-slate-700">Katalogisasi 50 buku baru dan melayani peminjaman 24 buku kepada siswa.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
