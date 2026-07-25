import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { 
  BookOpen, Heart, Users, CheckSquare, Activity, FileBarChart, Eye, 
  ChevronDown, FileText, Calendar, Download, CheckCircle2, Clock, XCircle, 
  AlertTriangle, Check, X, ShieldAlert, AlertCircle, ExternalLink, Link2, Search, Plus, Trash2, Edit2, FileSpreadsheet 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { CustomSelect } from '../components/ui/CustomSelect';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { DEFAULT_MODUL_AJAR, ModulAjarItem } from './GuruPages';

export function DashboardKamad() {
  const { user } = useAuth();
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">Dashboard Kepala Madrasah</h1>
        <p className="text-slate-500 mt-1 text-sm">Selamat datang, {user?.name}.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-emerald-50 border-emerald-100">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-emerald-800">Kinerja Staf Terpantau</p>
                <p className="text-2xl font-black text-emerald-900 mt-1">45</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                <CheckSquare className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-blue-800">Perizinan Menunggu ACC</p>
                <p className="text-2xl font-black text-blue-900 mt-1">2</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-amber-50 border-amber-100">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-amber-800">Absensi Ibadah Guru</p>
                <p className="text-2xl font-black text-amber-900 mt-1">92%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function KamadMateriAjar() {
  const STORAGE_KEY = 'modul_ajar_guru_data';

  const [materiList, setMateriList] = useState<ModulAjarItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
      }
    }
    return DEFAULT_MODUL_AJAR;
  });

  // Reload from localStorage when window regains focus or state changes
  useEffect(() => {
    const handleStorage = () => {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try { setMateriList(JSON.parse(saved)); } catch (e) {}
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const saveMateriList = (newList: ModulAjarItem[]) => {
    setMateriList(newList);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
    }
  };


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
    saveMateriList(updated);
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
  const [activeTab, setActiveTab] = useState<'all' | 'guru_mapel' | 'wali_kelas' | 'pelanggaran'>('all');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [reportPeriod, setReportPeriod] = useState('Mingguan');
  const [kinerjaStartDate, setKinerjaStartDate] = useState('');
  const [kinerjaEndDate, setKinerjaEndDate] = useState('');


  // Jobdesk structure according to SOP
  const stafList = [
    { 
      id: 1, 
      name: 'Ahmad Fazil, S.Pd', 
      role: 'Wali Kelas', 
      kelas: 'XI IPA 1',
      category: 'wali_kelas', 
      tasks: [
        { name: 'Absensi Siswa (Per Mapel/Hari)', status: 'selesai', time: '07:35 WIB' },
        { name: 'Jurnal Ajar Hari Ini', status: 'selesai', time: '08:15 WIB' },
        { name: 'Periksa Pantauan Pagi Siswa', status: 'selesai', time: '07:05 WIB' },
        { name: 'Absensi Sholat Zuhur Siswa', status: 'terlewat', time: 'Batas 13:00 Lewat' },
      ]
    },
    { 
      id: 2, 
      name: 'Siti Rahma, M.Pd', 
      role: 'Guru Mapel', 
      kelas: 'Fisika (X & XI)',
      category: 'guru_mapel', 
      tasks: [
        { name: 'Absensi Siswa (Per Mapel/Hari)', status: 'selesai', time: '08:45 WIB' },
        { name: 'Jurnal Ajar Hari Ini', status: 'belum', time: 'Dalam Jam Kerja' },
      ]
    },
    { 
      id: 3, 
      name: 'Budi Santoso, S.Ag', 
      role: 'Wali Kelas', 
      kelas: 'XII IPS 2',
      category: 'wali_kelas', 
      tasks: [
        { name: 'Absensi Siswa (Per Mapel/Hari)', status: 'selesai', time: '07:30 WIB' },
        { name: 'Jurnal Ajar Hari Ini', status: 'selesai', time: '09:00 WIB' },
        { name: 'Periksa Pantauan Pagi Siswa', status: 'selesai', time: '07:10 WIB' },
        { name: 'Absensi Sholat Zuhur Siswa', status: 'selesai', time: '12:45 WIB' },
      ]
    },
    { 
      id: 4, 
      name: 'Dra. Endang Sulastri', 
      role: 'Wali Kelas', 
      kelas: 'X IPA 2',
      category: 'wali_kelas', 
      tasks: [
        { name: 'Absensi Siswa (Per Mapel/Hari)', status: 'terlewat', time: 'Batas Jam Kerja Terlewat' },
        { name: 'Jurnal Ajar Hari Ini', status: 'terlewat', time: 'Batas Jam Kerja Terlewat' },
        { name: 'Periksa Pantauan Pagi Siswa', status: 'terlewat', time: 'Batas Jam Kerja Terlewat' },
        { name: 'Absensi Sholat Zuhur Siswa', status: 'terlewat', time: 'Batas Jam Kerja Terlewat' },
      ]
    },
    { 
      id: 5, 
      name: 'Drs. Hendra Pratama', 
      role: 'Guru Mapel', 
      kelas: 'Matematika (XII)',
      category: 'guru_mapel', 
      tasks: [
        { name: 'Absensi Siswa (Per Mapel/Hari)', status: 'selesai', time: '08:00 WIB' },
        { name: 'Jurnal Ajar Hari Ini', status: 'selesai', time: '08:30 WIB' },
      ]
    },
    { 
      id: 6, 
      name: 'Ustadz Umar, S.Pd.I', 
      role: 'Guru Mapel', 
      kelas: "PAI / Qur'an",
      category: 'guru_mapel', 
      tasks: [
        { name: 'Absensi Siswa (Per Mapel/Hari)', status: 'selesai', time: '07:40 WIB' },
        { name: 'Jurnal Ajar Hari Ini', status: 'belum', time: 'Dalam Jam Kerja' },
      ]
    },
  ];

  // Helper to compute overall status of a staff member
  const getStaffSummary = (tasks: any[]) => {
    const hasTerlewat = tasks.some(t => t.status === 'terlewat');
    const allSelesai = tasks.every(t => t.status === 'selesai');

    if (hasTerlewat) return { label: 'Pelanggaran Kinerja', code: 'pelanggaran', color: 'text-rose-600 bg-rose-50 border-rose-200', icon: XCircle };
    if (allSelesai) return { label: 'Tuntas / Selesai', code: 'selesai', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', icon: CheckCircle2 };
    return { label: 'Dalam Proses', code: 'proses', color: 'text-amber-600 bg-amber-50 border-amber-200', icon: Clock };
  };

  const filterOptions = [
    { value: 'all', label: 'Semua Staf' },
    { value: 'guru_mapel', label: 'Guru Mapel' },
    { value: 'wali_kelas', label: 'Wali Kelas' },
    { value: 'pelanggaran', label: 'Pelanggaran Kinerja' },
  ];

  const activeLabel = filterOptions.find(o => o.value === activeTab)?.label || 'Semua Staf';

  const filteredList = stafList.filter(s => {
    if (activeTab === 'all') return true;
    if (activeTab === 'guru_mapel') return s.category === 'guru_mapel';
    if (activeTab === 'wali_kelas') return s.category === 'wali_kelas';
    if (activeTab === 'pelanggaran') return s.tasks.some(t => t.status === 'terlewat');
    return true;
  });

  const totalStaf = stafList.length;
  const tuntasCount = stafList.filter(s => s.tasks.every(t => t.status === 'selesai')).length;
  const prosesCount = stafList.filter(s => !s.tasks.every(t => t.status === 'selesai') && !s.tasks.some(t => t.status === 'terlewat')).length;

  const downloadKinerjaPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Laporan Kinerja Staf - ${reportPeriod === 'Mingguan' && kinerjaStartDate && kinerjaEndDate ? `Mingguan (${kinerjaStartDate} s/d ${kinerjaEndDate})` : reportPeriod}`, 14, 20);
    doc.setFontSize(10);
    doc.text(`Dicetak pada: ${new Date().toLocaleDateString('id-ID')}`, 14, 28);
    
    const tableData = stafList.map(staf => {
      const selesai = staf.tasks.filter(t => t.status === 'selesai').length;
      const total = staf.tasks.length;
      const persentase = total > 0 ? Math.round((selesai / total) * 100) : 0;
      const pelanggaranTasks = staf.tasks.filter(t => t.status === 'terlewat').map(t => t.name);
      const statusText = pelanggaranTasks.length > 0 ? `Pelanggaran: ${pelanggaranTasks.join(', ')}` : 'Baik';

      return [
        staf.name,
        staf.role,
        staf.kelas || '-',
        `${persentase}% (${selesai}/${total})`,
        statusText
      ];
    });

    autoTable(doc, {
      startY: 35,
      head: [['Nama Staf', 'Role', 'Kelas', 'Persentase', 'Status / Pelanggaran']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [16, 185, 129] },
      columnStyles: {
        4: { cellWidth: 50 }
      }
    });

    doc.save(`Laporan_Kinerja_Staf_${reportPeriod.replace(/ /g, '_')}.pdf`);
  };

  const downloadKinerjaExcel = () => {
    const data = stafList.map(staf => {
      const selesai = staf.tasks.filter(t => t.status === 'selesai').length;
      const total = staf.tasks.length;
      const persentase = total > 0 ? Math.round((selesai / total) * 100) : 0;
      const pelanggaranTasks = staf.tasks.filter(t => t.status === 'terlewat').map(t => t.name);
      
      return {
        'Nama Staf': staf.name,
        'Role': staf.role,
        'Kelas': staf.kelas || '-',
        'Persentase': `${persentase}% (${selesai} dari ${total})`,
        'Status / Pelanggaran': pelanggaranTasks.length > 0 ? `Pelanggaran: ${pelanggaranTasks.join(', ')}` : 'Baik'
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Kinerja Staf");
    XLSX.writeFile(workbook, `Laporan_Kinerja_Staf_${reportPeriod.replace(/ /g, '_')}.xlsx`);
  };

  const pelanggaranCount = stafList.filter(s => s.tasks.some(t => t.status === 'terlewat')).length;


  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-800">Kinerja Staf Real-time</h1>
          <p className="text-slate-500 text-xs sm:text-sm font-medium">Monitoring pengerjaan jobdesk Guru & Wali Kelas.</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {reportPeriod === 'Mingguan' && (
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-2 py-1.5 shadow-sm">
              <input type="date" value={kinerjaStartDate} onChange={e => setKinerjaStartDate(e.target.value)} className="text-xs sm:text-sm font-bold text-slate-700 outline-none bg-transparent w-[110px] sm:w-auto" />
              <span className="text-slate-400 font-bold text-xs">-</span>
              <input type="date" value={kinerjaEndDate} onChange={e => setKinerjaEndDate(e.target.value)} className="text-xs sm:text-sm font-bold text-slate-700 outline-none bg-transparent w-[110px] sm:w-auto" />
            </div>
          )}
          <select 
            value={reportPeriod}
            onChange={(e) => setReportPeriod(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:border-emerald-500"
          >
            <option value="Mingguan">Mingguan</option>
            <option value="Bulanan">Bulanan</option>
            <option value="Per Semester">Per Semester</option>
            <option value="Tahunan">Tahunan</option>
          </select>
          <button onClick={downloadKinerjaPDF} className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-3 py-2 rounded-xl text-sm font-bold transition-colors">
            <FileText className="w-4 h-4" /> PDF
          </button>
          <button onClick={downloadKinerjaExcel} className="flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-200 px-3 py-2 rounded-xl text-sm font-bold transition-colors">
            <FileSpreadsheet className="w-4 h-4" /> Excel
          </button>
        </div>
      </div>

      {/* Warning Banner if Pelanggaran Kinerja exists */}
      {pelanggaranCount > 0 && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs sm:text-sm text-rose-800 flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
            <div>
              <p className="font-extrabold text-rose-900">Perhatian Kepala Madrasah:</p>
              <p className="text-rose-700 text-xs">Terdapat <span className="font-black text-rose-900">{pelanggaranCount} staf</span> yang melewati batas jam kerja tanpa menyelesaikan jobdesk wajib (Terdaftar dalam Pelanggaran Kinerja).</p>
            </div>
          </div>
          <button 
            onClick={() => setActiveTab('pelanggaran')}
            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-lg transition-colors shrink-0 cursor-pointer"
          >
            Lihat Staf
          </button>
        </div>
      )}

      {/* Bento Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-100/70 border border-slate-200/60 p-3 rounded-xl text-center">
          <p className="text-[9px] sm:text-[10px] uppercase tracking-wider font-black text-slate-500">Total Staf</p>
          <p className="text-lg sm:text-xl font-black text-slate-800 mt-0.5">{totalStaf}</p>
        </div>
        <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-xl text-center">
          <p className="text-[9px] sm:text-[10px] uppercase tracking-wider font-black text-emerald-600">Tuntas (Hijau)</p>
          <p className="text-lg sm:text-xl font-black text-emerald-800 mt-0.5">{tuntasCount}</p>
        </div>
        <div className="bg-amber-50 border border-amber-100 p-3 rounded-xl text-center">
          <p className="text-[9px] sm:text-[10px] uppercase tracking-wider font-black text-amber-600">Proses (Orange)</p>
          <p className="text-lg sm:text-xl font-black text-amber-800 mt-0.5">{prosesCount}</p>
        </div>
        <div className="bg-rose-50 border border-rose-100 p-3 rounded-xl text-center">
          <p className="text-[9px] sm:text-[10px] uppercase tracking-wider font-black text-rose-600">Pelanggaran (Merah)</p>
          <p className="text-lg sm:text-xl font-black text-rose-800 mt-0.5">{pelanggaranCount}</p>
        </div>
      </div>

      {/* Legend Information Box */}
      <div className="bg-white border border-slate-200/80 p-3.5 rounded-xl shadow-2xs">
        <p className="text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">Keterangan Indikator SOP Kinerja:</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
          <div className="flex items-center gap-2 bg-emerald-50/60 p-2 rounded-lg border border-emerald-100">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <span className="font-bold text-emerald-800">Ceklis Hijau</span>
              <p className="text-[10px] text-emerald-600">Sudah dikerjakan tepat waktu</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-amber-50/60 p-2 rounded-lg border border-amber-100">
            <Clock className="w-4 h-4 text-amber-500 shrink-0" />
            <div>
              <span className="font-bold text-amber-800">Jam Orange</span>
              <p className="text-[10px] text-amber-600">Belum dikerjakan (masih jam kerja)</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-rose-50/60 p-2 rounded-lg border border-rose-100">
            <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <div>
              <span className="font-bold text-rose-800">Silang Merah</span>
              <p className="text-[10px] text-rose-600">Lewat batas jam kerja (Pelanggaran)</p>
            </div>
          </div>
        </div>
      </div>

      <Card className="overflow-hidden border-slate-200/60 shadow-sm">
        <CardHeader className="py-3 px-4 sm:px-6 bg-slate-50/50 border-b border-slate-100 flex flex-row items-center justify-between gap-2">
          <CardTitle className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-700 m-0">Daftar Kinerja Staf Hari Ini</CardTitle>
          <div className="relative">
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
                <div className="absolute right-0 mt-1 w-44 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150 origin-top-right">
                  {filterOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setActiveTab(option.value as any);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-[10px] sm:text-xs font-bold transition-colors ${
                        activeTab === option.value
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
        </CardHeader>
        <CardContent className="p-3 sm:p-5">
          <div className="space-y-3">
            {filteredList.length === 0 ? (
              <div className="text-center py-8 text-slate-400 font-bold text-xs uppercase tracking-wider">
                Tidak ada data staf untuk kategori ini
              </div>
            ) : (
              filteredList.map((staf) => {
                const summary = getStaffSummary(staf.tasks);
                const SummaryIcon = summary.icon;
                const completedTasks = staf.tasks.filter(t => t.status === 'selesai').length;

                return (
                  <div key={staf.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-white border border-slate-100 hover:border-slate-200 hover:shadow-xs rounded-xl transition-all gap-3">
                    <div className="flex items-start gap-3">
                      <div className={`p-2.5 rounded-xl shrink-0 ${staf.role === 'Wali Kelas' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}>
                        <Users className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-bold text-slate-800 text-sm">{staf.name}</h4>
                          <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${staf.role === 'Wali Kelas' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                            {staf.role} ({staf.kelas})
                          </span>
                        </div>
                        
                        {/* Task Completion Progress & Status */}
                        <div className="flex items-center gap-3 pt-0.5">
                          <span className="text-[11px] text-slate-500 font-medium">
                            Jobdesk: <strong className="text-slate-800">{completedTasks}/{staf.tasks.length} Selesai</strong>
                          </span>
                          <span className={`inline-flex items-center gap-1 text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${summary.color}`}>
                            <SummaryIcon className="w-3 h-3" />
                            {summary.label}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Button 
                      onClick={() => setSelectedStaf(staf)} 
                      variant="outline" 
                      size="sm" 
                      className="w-full sm:w-auto h-8 text-xs font-bold gap-1.5 border-slate-200 hover:bg-slate-50 hover:text-slate-800 active:scale-95 transition-all"
                    >
                      <Eye className="w-3.5 h-3.5"/> Cek Jobdesk
                    </Button>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Detail Jobdesk Modal */}
      {selectedStaf && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col border border-slate-100 animate-in fade-in zoom-in duration-200">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h2 className="text-sm font-black uppercase tracking-wider text-slate-800">Detail Jobdesk Harian</h2>
                <p className="text-xs font-bold text-emerald-600 mt-0.5">{selectedStaf.name} • {selectedStaf.role} ({selectedStaf.kelas})</p>
              </div>
              <button onClick={() => setSelectedStaf(null)} className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all font-bold">✕</button>
            </div>

            <div className="p-4 space-y-3 max-h-[420px] overflow-y-auto">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Daftar Kewajiban Jobdesk Hari Ini:</p>
              
              <div className="space-y-2">
                {selectedStaf.tasks.map((task: any, i: number) => {
                  let badgeStyle = "bg-amber-50 border-amber-200 text-amber-800";
                  let TaskIcon = Clock;
                  let iconBg = "bg-amber-100 text-amber-600";
                  let statusText = "Belum Dikerjakan (Jam Kerja)";

                  if (task.status === 'selesai') {
                    badgeStyle = "bg-emerald-50 border-emerald-200 text-emerald-800";
                    TaskIcon = CheckCircle2;
                    iconBg = "bg-emerald-100 text-emerald-600";
                    statusText = "Selesai";
                  } else if (task.status === 'terlewat') {
                    badgeStyle = "bg-rose-50 border-rose-200 text-rose-800";
                    TaskIcon = XCircle;
                    iconBg = "bg-rose-100 text-rose-600";
                    statusText = "Pelanggaran Kinerja (Terlewat)";
                  }

                  return (
                    <div key={i} className={`p-3 rounded-xl border flex items-start justify-between gap-3 ${badgeStyle}`}>
                      <div className="flex items-start gap-2.5">
                        <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${iconBg}`}>
                          <TaskIcon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-black text-slate-800">{task.name}</p>
                          <p className="text-[10px] font-medium text-slate-500 mt-0.5">Waktu / Catatan: {task.time}</p>
                        </div>
                      </div>

                      <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-md shrink-0 border ${
                        task.status === 'selesai' 
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
                          : task.status === 'terlewat' 
                          ? 'bg-rose-100 text-rose-800 border-rose-300' 
                          : 'bg-amber-100 text-amber-800 border-amber-300'
                      }`}>
                        {statusText}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
              <Button onClick={() => setSelectedStaf(null)} size="sm" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-9">
                Tutup
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function KamadApprovalIzin() {
  const { user } = useAuth();
  const canApprove = user?.role === 'kamad' || user?.role === 'admin';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">{canApprove ? 'Approval Perizinan Guru & Walas' : 'Pantau Perizinan Guru & Walas'}</h1>
        <p className="text-slate-500 mt-1 text-sm">{canApprove ? 'Acc perizinan yang diajukan.' : 'Daftar perizinan guru.'}</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Guru</span>
                  <h4 className="font-bold text-slate-800 text-sm">Fulan, S.Pd</h4>
                </div>
                <p className="text-sm font-medium text-slate-700">Izin Sakit (Lampiran Surat Dokter)</p>
                <p className="text-xs text-slate-500 mt-1">Tanggal: 12 Juli 2026</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {canApprove ? (
                  <>
                    <Button variant="outline" className="text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200">Tolak</Button>
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">ACC Izin</Button>
                  </>
                ) : (
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700 px-3 py-1.5 rounded-full">Menunggu ACC Kamad</span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function KamadIbadahGuru() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">Laporan Ibadah Guru</h1>
        <p className="text-slate-500 mt-1 text-sm">Pantau pelaksanaan sholat zuhur berjamaah bagi guru.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Rekap Sholat Zuhur Berjamaah Hari Ini</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: 'Ahmad, S.Pd', status: 'Berjamaah' },
              { name: 'Budi, S.Ag', status: 'Berjamaah' },
              { name: 'Dini, S.Kom', status: 'Tidak Berjamaah (Udzur)' },
            ].map((guru, i) => (
              <div key={i} className="flex items-center justify-between p-3 border-b border-slate-100 last:border-0 last:pb-0">
                <span className="text-sm font-medium text-slate-800">{guru.name}</span>
                <span className={`text-xs font-bold px-2 py-1 rounded ${guru.status.includes('Tidak') ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                  {guru.status}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function KamadLaporanBKPustaka() {
  const [selectedSemester, setSelectedSemester] = React.useState('Ganjil 2026/2027');
  const semesters = [
    { value: 'Ganjil 2026/2027', label: 'Ganjil 2026/2027 (Aktif)' },
    { value: 'Genap 2025/2026', label: 'Genap 2025/2026' },
    { value: 'Ganjil 2025/2026', label: 'Ganjil 2025/2026' },
    { value: 'Genap 2024/2025', label: 'Genap 2024/2025' },
    { value: 'Ganjil 2024/2025', label: 'Ganjil 2024/2025' }
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
