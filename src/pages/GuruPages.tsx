import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../lib/apiClient';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { mockStudents } from '../data/mock';
import { MapPin, Edit2, Trash2, Download, FileText, Check, AlertCircle, Search, Plus, X, Clock, BookOpen, Users, ExternalLink, Link2, CheckCircle2, Eye, Calendar } from 'lucide-react';
import { CustomSelect } from '../components/ui/CustomSelect';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface TeacherSubject {
  id: string;
  subjectName: string;
  className: string;
}

export function getTeacherSubjects(): TeacherSubject[] {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('guru_subjects');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {}
    }
  }
  return [];
}

export function saveTeacherSubjects(subjects: TeacherSubject[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('guru_subjects', JSON.stringify(subjects));
  }
}

export function DataSiswa() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  
  // Calculate allowed classes based on user role
  let allowedClasses: string[] = [];
  if (user?.role === 'guru' || user?.role === 'guru_quran' || user?.role === 'walas') {
    if (user.subjects) {
      allowedClasses = [...allowedClasses, ...user.subjects.map(s => s.className)];
    }
    if (user.role === 'walas' && user.className) {
      allowedClasses.push(user.className);
    }
    allowedClasses = Array.from(new Set(allowedClasses));
  }
  
  // If user is one of those roles, only show their allowed classes. If admin/others, maybe show all.
  const isRestrictedRole = user?.role === 'guru' || user?.role === 'guru_quran' || user?.role === 'walas';
  
  const availableClasses = isRestrictedRole 
    ? Array.from(new Set(mockStudents.filter(s => allowedClasses.includes(s.className)).map(s => s.className))).sort()
    : Array.from(new Set(mockStudents.map(s => s.className))).sort();

  const filteredStudents = mockStudents.filter(s => {
    // Check role restriction
    if (isRestrictedRole && !allowedClasses.includes(s.className)) {
      return false;
    }

    const matchSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        s.className.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        s.nis.includes(searchQuery);
    const matchClass = selectedClass ? s.className === selectedClass : true;
    
    return matchSearch && matchClass;
  });

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold tracking-tight text-slate-800">Data Siswa</h1>
      
      <Card>
        <CardHeader className="pb-4 border-b border-slate-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle>Daftar Siswa</CardTitle>
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              <div className="w-full sm:w-48">
                <CustomSelect
                  value={selectedClass}
                  onChange={setSelectedClass}
                  options={[
                    { value: '', label: 'Semua Kelas' },
                    ...availableClasses.map(c => ({ value: c, label: c }))
                  ]}
                  placeholder="Pilih Kelas"
                />
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari nama atau kelas..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-xs text-slate-500 uppercase">
                  <th className="pb-3 px-4 font-bold">Nama Siswa</th>
                  <th className="pb-3 px-4 font-bold">Kelas</th>
                  <th className="pb-3 px-4 font-bold">L/P</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map(s => (
                    <tr key={s.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors group">
                      <td className="py-3 px-4">
                        <p className="font-bold text-slate-800 text-sm">{s.name}</p>
                        <p className="text-xs text-slate-500">{s.nis}</p>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-2 py-1 bg-slate-100 text-slate-600 rounded text-[10px] font-bold uppercase tracking-wider">
                          {s.className}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-600 text-sm">
                          {s.gender || '-'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-slate-500 text-sm">
                      Tidak ada data siswa yang ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function JadwalMengajar() {
  const { user } = useAuth();
  const canEdit = user?.role === 'admin' || user?.role === 'wakakurikulum';
  const [filterHari, setFilterHari] = useState('Semua Hari');
  const [loading, setLoading] = useState(true);
  
  const [jadwal, setJadwal] = useState<any[]>([]);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        setLoading(true);
        // Fetch from API
        const data = await apiClient('/crud.php?table=schedules');
        if (Array.isArray(data)) {
          // Filter out schedules just for this teacher if not admin/wakakurikulum
          // Wait, if it's admin, they might want to see all. But the page is for 'Guru'.
          // Let's filter by user.id if not admin.
          const teacherSchedules = canEdit ? data : data.filter((d: any) => d.teacher_id === user?.id);
          
          const mapped = teacherSchedules.map((d: any) => ({
            id: d.id,
            hari: d.day || 'Senin',
            time: (d.start_time?.substring(0,5) || '') + ' - ' + (d.end_time?.substring(0,5) || ''),
            kelas: d.class_name,
            mapel: d.subject_name
          }));
          setJadwal(mapped);
        }
      } catch(err) {
        console.error('Failed to load schedules', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSchedules();
  }, [user, canEdit]);

  const hariOptions = ['Semua Hari', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

  const filteredJadwal = filterHari === 'Semua Hari' ? jadwal : jadwal.filter(j => j.hari === filterHari);

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-600">Filter Hari:</span>
              <div className="w-[150px]">
                <CustomSelect
                  value={filterHari}
                  onChange={setFilterHari}
                  options={hariOptions.map(h => ({ value: h, label: h }))}
                />
              </div>
            </div>
            {canEdit && (
              <button className="px-4 py-2 bg-[#0d7345] hover:bg-[#0a5c37] text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors">
                <Plus className="w-4 h-4" /> Tambah Jadwal
              </button>
            )}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-xs text-slate-500 uppercase">
                  <th className="pb-3 px-4 font-bold">Hari</th>
                  <th className="pb-3 px-4 font-bold">Waktu</th>
                  <th className="pb-3 px-4 font-bold">Kelas</th>
                  <th className="pb-3 px-4 font-bold">Mata Pelajaran</th>
                  {canEdit && <th className="pb-3 px-4 font-bold text-right">Aksi</th>}
                </tr>
              </thead>
              <tbody>
                {filteredJadwal.length > 0 ? (
                  filteredJadwal.map((j) => (
                    <tr key={j.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 text-sm font-bold text-slate-800">{j.hari}</td>
                      <td className="py-3 px-4 text-sm font-medium text-slate-600">{j.time}</td>
                      <td className="py-3 px-4 text-sm text-slate-700">{j.kelas}</td>
                      <td className="py-3 px-4">
                        <span className="text-sm font-bold text-slate-800">{j.mapel}</span>
                      </td>
                      {canEdit && (
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded" title="Edit">
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button className="p-1.5 text-red-600 hover:bg-red-50 rounded" title="Hapus">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={canEdit ? 5 : 4} className="py-8 text-center text-slate-500 text-sm">
                      Tidak ada jadwal ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card-List View */}
          <div className="md:hidden flex flex-col gap-3">
            {filteredJadwal.length > 0 ? (
              filteredJadwal.map((j) => (
                <div key={j.id} className="p-4 bg-white border border-slate-200 rounded-xl hover:border-emerald-500 hover:bg-emerald-50/20 transition-all shadow-sm flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md">
                      {j.hari}
                    </span>
                    <span className="text-xs font-mono font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" /> {j.time}
                    </span>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 leading-tight flex items-start gap-1.5">
                      <BookOpen className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{j.mapel}</span>
                    </h3>
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                    <span className="flex items-center gap-1 bg-slate-50 border border-slate-200/60 rounded px-2 py-0.5 font-bold">
                      <Users className="w-3.5 h-3.5 text-slate-400" /> {j.kelas}
                    </span>
                  </div>

                  {canEdit && (
                    <div className="flex justify-end gap-2 pt-2.5 border-t border-slate-100 mt-1">
                      <button className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors border border-emerald-100" title="Edit">
                        <Edit2 className="w-3.5 h-3.5" /> Edit
                      </button>
                      <button className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-100" title="Hapus">
                        <Trash2 className="w-3.5 h-3.5" /> Hapus
                      </button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-slate-400 text-sm">
                Tidak ada jadwal ditemukan.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function Absensi() {
  const { user } = useAuth();
  const [attendance, setAttendance] = useState<Record<string, { status: string; ket: string }>>({});
  
  const isWalas = user?.role === 'walas';
  const subjects = user?.subjects || [];
  const availableClasses = Array.from(new Set(subjects.map(s => s.className)));
  
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedMapel, setSelectedMapel] = useState('');

  const classSubjects = subjects.filter(s => s.className === selectedClass);
  const availableMapel = Array.from(new Set(classSubjects.map(s => s.subjectName)));

  useEffect(() => {
    if (availableMapel.length === 1) {
      setSelectedMapel(availableMapel[0]);
    } else if (!availableMapel.includes(selectedMapel)) {
      setSelectedMapel('');
    }
  }, [selectedClass, availableMapel, selectedMapel]);

  const limitAbsenSiswa = localStorage.getItem('limit_absen_siswa') || '15:00';
  const [limitHour, limitMinute] = limitAbsenSiswa.split(':').map(Number);
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const isLate = currentHour > limitHour || (currentHour === limitHour && currentMinute >= limitMinute);

  if (isLate) {
    return (
      <div className="space-y-6">
        <h1 className="text-xl font-bold tracking-tight text-slate-800">Presensi Kehadiran Siswa</h1>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-8 text-center">
            <div className="flex justify-center mb-4">
              <AlertCircle className="w-12 h-12 text-red-500" />
            </div>
            <h2 className="text-lg font-bold text-red-700 mb-2">Batas Waktu Pengisian Terlewat</h2>
            <p className="text-red-600">
              Anda tidak dapat mengisi absensi karena telah melewati pukul {limitAbsenSiswa}. 
              Kejadian ini telah dicatat sebagai pelanggaran disiplin pada sistem Kepala Madrasah.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSetStatus = (id: string, status: string) => {
    setAttendance(prev => ({ 
      ...prev, 
      [id]: { 
        ...prev[id], 
        status: prev[id]?.status === status ? '' : status 
      } 
    }));
  };
  
  const handleSetKet = (id: string, ket: string) => {
    setAttendance(prev => ({ ...prev, [id]: { ...prev[id], ket } }));
  };

  const handleSave = () => {
    if (!selectedClass) {
      window.alert("Pilih kelas terlebih dahulu!");
      return;
    }
    if (availableMapel.length > 0 && !selectedMapel) {
      window.alert("Pilih mata pelajaran terlebih dahulu!");
      return;
    }
    window.alert("Absensi berhasil disimpan!");
  };

  const showStudents = selectedClass !== '' && (availableMapel.length === 0 || selectedMapel !== '');

  return (
    <div className="space-y-4">
      {/* Top Bar */}
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Absensi Kehadiran</h2>
            <p className="text-sm text-slate-500 mt-0.5">Masukkan data kehadiran siswa</p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full md:w-auto">
            {/* Kelas & Mapel Side-by-Side on HP */}
            <div className="grid grid-cols-2 gap-2 w-full md:flex md:w-auto md:gap-3">
              <div className="w-full md:w-[150px]">
                <CustomSelect
                  value={selectedClass}
                  onChange={setSelectedClass}
                  options={[
                    { value: '', label: 'Pilih Kelas' },
                    ...availableClasses.map(c => ({ value: String(c), label: String(c) }))
                  ]}
                />
              </div>
              
              <div className="w-full md:w-[150px]">
                <CustomSelect
                  value={selectedMapel}
                  onChange={setSelectedMapel}
                  disabled={availableMapel.length <= 1}
                  options={[
                    { value: '', label: 'Pilih Mapel' },
                    ...availableMapel.map(m => ({ value: String(m), label: String(m) }))
                  ]}
                />
              </div>
            </div>

            {/* Simpan Button below them on HP */}
            <button 
              onClick={handleSave}
              className="w-full md:w-auto px-5 py-2.5 bg-[#1e7b55] hover:bg-[#166544] text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2 whitespace-nowrap transition-colors shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
              Simpan
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase w-16 text-center">No</th>
                <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase whitespace-nowrap">Nama Siswa</th>
                <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase text-center min-w-[240px]">Status Kehadiran</th>
                <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase">Keterangan</th>
              </tr>
            </thead>
            <tbody>
              {showStudents ? (
                mockStudents.map((s, i) => {
                  const stat = attendance[s.id]?.status || '';
                  const ket = attendance[s.id]?.ket || '';
                  return (
                    <tr key={s.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-4 text-sm font-medium text-slate-500 text-center">{i + 1}</td>
                      <td className="py-4 px-4 text-sm font-bold text-slate-800 whitespace-nowrap">{s.name}</td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {['Hadir', 'Izin', 'Sakit', 'Alpa', 'Cabut'].map(st => {
                            let bgActive = '';
                            let textActive = 'text-white';
                            let bgInactive = '';
                            let textInactive = '';
                            let hoverBg = '';
                            if (st === 'Hadir') { bgActive = 'bg-emerald-500'; bgInactive = 'bg-emerald-50'; textInactive = 'text-emerald-600'; hoverBg = 'hover:bg-emerald-100'; }
                            if (st === 'Izin') { bgActive = 'bg-amber-500'; bgInactive = 'bg-amber-50'; textInactive = 'text-amber-600'; hoverBg = 'hover:bg-amber-100'; }
                            if (st === 'Sakit') { bgActive = 'bg-blue-500'; bgInactive = 'bg-blue-50'; textInactive = 'text-blue-600'; hoverBg = 'hover:bg-blue-100'; }
                            if (st === 'Alpa') { bgActive = 'bg-red-500'; bgInactive = 'bg-red-50'; textInactive = 'text-red-600'; hoverBg = 'hover:bg-red-100'; }
                            if (st === 'Cabut') { bgActive = 'bg-purple-500'; bgInactive = 'bg-purple-50'; textInactive = 'text-purple-600'; hoverBg = 'hover:bg-purple-100'; }
                            
                            const stLabel = st === 'Hadir' ? 'H' : st === 'Izin' ? 'I' : st === 'Sakit' ? 'S' : st === 'Alpa' ? 'A' : 'C';

                            return (
                              <button
                                key={st}
                                onClick={() => handleSetStatus(s.id, st)}
                                className={"w-8 h-8 flex items-center justify-center rounded-md border text-xs font-bold transition-colors " + (stat === st ? (bgActive + " " + textActive + " border-transparent shadow-sm") : (bgInactive + " " + textInactive + " " + hoverBg + " border-slate-200/60"))}
                              >
                                {stLabel}
                              </button>
                            );
                          })}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <input
                          type="text"
                          placeholder="Tambahkan keterangan..."
                          value={ket}
                          onChange={(e) => handleSetKet(s.id, e.target.value)}
                          className="w-full px-3 py-1.5 border border-slate-200 rounded-md text-sm outline-none focus:border-emerald-500 transition-colors"
                        />
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-sm font-medium text-slate-500">
                    Pilih kelas dan mapel terlebih dahulu atau belum ada data siswa
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

export function InputNilai() {
  const { user } = useAuth();
  
  const subjects = user?.subjects || [];
  const availableClasses = Array.from(new Set(subjects.map(s => s.className)));
  
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedMapel, setSelectedMapel] = useState('');
  const [uhCount, setUhCount] = useState(1);
  
  // Read active semester from localStorage (set by admin)
  const [semester, setSemester] = useState('Ganjil');
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('mockAcademicTerms');
      if (stored) {
        try {
          const terms = JSON.parse(stored);
          const selectedTermId = localStorage.getItem('selectedAcademicTermId');
          let activeTerm = null;
          if (selectedTermId) {
            activeTerm = terms.find((t: any) => t.id === selectedTermId);
          }
          if (!activeTerm) {
            activeTerm = terms.find((t: any) => t.isActive);
          }
          if (activeTerm && activeTerm.semester) {
            setSemester(activeTerm.semester);
          }
        } catch (e) {}
      }
    }
  }, []);

  const classSubjects = subjects.filter(s => s.className === selectedClass);
  const availableMapel = Array.from(new Set(classSubjects.map(s => s.subjectName)));

  useEffect(() => {
    if (availableMapel.length === 1) {
      setSelectedMapel(availableMapel[0]);
    } else if (!availableMapel.includes(selectedMapel)) {
      setSelectedMapel('');
    }
  }, [selectedClass, availableMapel, selectedMapel]);

  const handleSave = () => {
    if (!selectedClass) {
      window.alert("Pilih kelas terlebih dahulu!");
      return;
    }
    if (availableMapel.length > 0 && !selectedMapel) {
      window.alert("Pilih mata pelajaran terlebih dahulu!");
      return;
    }
    window.alert("Nilai berhasil disimpan!");
  };

  const showStudents = selectedClass !== '' && (availableMapel.length === 0 || selectedMapel !== '');

  return (
    <div className="space-y-4">
      {/* Top Bar */}
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Input Penilaian</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Masukkan nilai siswa (Semester {semester})
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full md:w-auto">
            {/* Mapel & Kelas Side-by-Side on HP */}
            <div className="grid grid-cols-2 gap-2 w-full md:flex md:w-auto md:gap-3">
              <div className="w-full md:w-[150px]">
                <CustomSelect
                  value={selectedClass}
                  onChange={setSelectedClass}
                  options={[
                    { value: '', label: 'Pilih Kelas' },
                    ...availableClasses.map(c => ({ value: String(c), label: String(c) }))
                  ]}
                />
              </div>
              
              <div className="w-full md:w-[150px]">
                <CustomSelect
                  value={selectedMapel}
                  onChange={setSelectedMapel}
                  disabled={availableMapel.length <= 1}
                  options={[
                    { value: '', label: 'Pilih Mapel' },
                    ...availableMapel.map(m => ({ value: String(m), label: String(m) }))
                  ]}
                />
              </div>
            </div>

            {/* Simpan & Tambah UH Side-by-Side on HP */}
            <div className="grid grid-cols-2 gap-2 w-full md:flex md:w-auto md:gap-3">
              {/* UH Counter */}
              <div className="flex items-center justify-between border border-slate-200 rounded-lg bg-white shadow-sm overflow-hidden h-[42px] w-full md:w-auto">
                <span className="px-3 text-sm font-medium text-slate-600 border-r border-slate-200 bg-slate-50 h-full flex items-center shrink-0">UH:</span>
                <div className="flex items-center flex-1 justify-around h-full">
                  <button 
                    onClick={() => setUhCount(Math.max(1, uhCount - 1))}
                    className="w-full h-full flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors font-bold"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-sm font-bold text-slate-800 select-none">{uhCount}</span>
                  <button 
                    onClick={() => setUhCount(Math.min(5, uhCount + 1))}
                    className="w-full h-full flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors border-l border-slate-200 font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Simpan Button */}
              <button 
                onClick={handleSave}
                className="w-full md:w-auto px-5 py-2.5 bg-[#1e7b55] hover:bg-[#166544] text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2 whitespace-nowrap transition-colors shadow-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                Simpan
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-slate-200">
                <th className="py-4 px-4 text-xs font-bold text-slate-500 uppercase w-16 text-center">NO</th>
                <th className="py-4 px-4 text-xs font-bold text-slate-500 uppercase whitespace-nowrap">NAMA SISWA</th>
                {Array.from({ length: uhCount }).map((_, idx) => (
                  <th key={`uh-${idx}`} className="py-4 px-4 text-xs font-bold text-slate-500 uppercase text-center w-24">UH {idx + 1}</th>
                ))}
                <th className="py-4 px-4 text-xs font-bold text-slate-500 uppercase text-center w-24">{semester === 'Ganjil' ? 'STS 1' : 'STS 2'}</th>
                <th className="py-4 px-4 text-xs font-bold text-slate-500 uppercase text-center w-24">{semester === 'Ganjil' ? 'SAS' : 'SAT'}</th>
              </tr>
            </thead>
            <tbody>
              {showStudents ? (
                mockStudents.map((s, index) => (
                  <tr key={s.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors bg-white">
                    <td className="py-3 px-4 text-sm font-medium text-slate-500 text-center">{index + 1}</td>
                    <td className="py-3 px-4 text-sm font-bold text-slate-800 whitespace-nowrap">{s.name}</td>
                    {Array.from({ length: uhCount }).map((_, idx) => (
                      <td key={`uh-input-${idx}`} className="py-3 px-4">
                        <input type="number" placeholder="0" className="w-full min-w-[60px] p-2 border border-slate-200 rounded text-center text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all" />
                      </td>
                    ))}
                    <td className="py-3 px-4">
                      <input type="number" placeholder="0" className="w-full min-w-[60px] p-2 border border-slate-200 rounded text-center text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all" />
                    </td>
                    <td className="py-3 px-4">
                      <input type="number" placeholder="0" className="w-full min-w-[60px] p-2 border border-slate-200 rounded text-center text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all" />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3 + uhCount + 2} className="py-16 text-center text-sm font-medium text-slate-500 bg-slate-50">
                    Pilih kelas terlebih dahulu atau belum ada data siswa
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

export function JurnalMengajar() {
  const { user } = useAuth();
  const subjects = user?.subjects || [];
  
  const options = subjects.map(s => ({
    value: `${s.subjectName} - ${s.className}`,
    label: `${s.subjectName} - ${s.className}`
  }));
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selected, setSelected] = useState(options[0]?.value || '');
  const [tanggal, setTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [materi, setMateri] = useState('');
  const [catatan, setCatatan] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const [jurnals, setJurnals] = useState([
    {
      id: '1',
      tanggal: '18-07-2026',
      kelas: 'X-IPA 1',
      mataPelajaran: 'Matematika Peminatan',
      materi: 'Logaritma',
      catatan: 'Semua siswa hadir dan aktif'
    }
  ]);

  const [toastMessage, setToastMessage] = useState('');

  const handleSave = () => {
    if (!selected || !materi || !tanggal) {
      setToastMessage('Mohon lengkapi form jurnal!');
      setTimeout(() => setToastMessage(''), 3000);
      return;
    }
    
    const [mapel, kelas] = selected.split(' - ');
    const [year, month, day] = tanggal.split('-');
    const formattedTanggal = `${day}-${month}-${year}`;
    
    if (editingId) {
      setJurnals(jurnals.map(j => j.id === editingId ? {
        ...j,
        tanggal: formattedTanggal,
        kelas: kelas || '',
        mataPelajaran: mapel || '',
        materi,
        catatan
      } : j));
      setToastMessage("Jurnal mengajar berhasil diperbarui!");
    } else {
      const newJurnal = {
        id: Date.now().toString(),
        tanggal: formattedTanggal,
        kelas: kelas || '',
        mataPelajaran: mapel || '',
        materi,
        catatan
      };
      
      setJurnals([newJurnal, ...jurnals]);
      setToastMessage("Jurnal mengajar berhasil disimpan!");
    }
    
    setTimeout(() => setToastMessage(''), 3000);
    setMateri('');
    setCatatan('');
    setTanggal(new Date().toISOString().split('T')[0]);
    setEditingId(null);
    setIsModalOpen(false);
  };

  const handleEdit = (jurnal: any) => {
    setEditingId(jurnal.id);
    const [day, month, year] = jurnal.tanggal.split('-');
    if (day && month && year) {
      setTanggal(`${year}-${month}-${day}`);
    }
    setSelected(`${jurnal.mataPelajaran} - ${jurnal.kelas}`);
    setMateri(jurnal.materi);
    setCatatan(jurnal.catatan || '');
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setDeleteConfirm(id);
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      setJurnals(jurnals.filter(j => j.id !== deleteConfirm));
      setDeleteConfirm(null);
      setToastMessage("Jurnal berhasil dihapus!");
      setTimeout(() => setToastMessage(''), 3000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-800">Jurnal Kelas</h1>
          <p className="text-sm text-slate-500 mt-1">Rekap kegiatan belajar mengajar</p>
        </div>
        <button 
          onClick={() => {
            setEditingId(null);
            setMateri('');
            setCatatan('');
            setTanggal(new Date().toISOString().split('T')[0]);
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" /> Tambah
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Tanggal</th>
                <th className="py-3 px-4">Kelas</th>
                <th className="py-3 px-4">Mata Pelajaran</th>
                <th className="py-3 px-4">Materi / Topik</th>
                <th className="py-3 px-4">Kegiatan/Catatan</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {jurnals.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 italic">Belum ada catatan jurnal mengajar</td>
                </tr>
              ) : (
                jurnals.map(j => (
                  <tr key={j.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 whitespace-nowrap">{j.tanggal}</td>
                    <td className="py-3 px-4 whitespace-nowrap">{j.kelas}</td>
                    <td className="py-3 px-4 font-medium text-slate-700">{j.mataPelajaran}</td>
                    <td className="py-3 px-4">{j.materi}</td>
                    <td className="py-3 px-4 text-slate-500">{j.catatan || '-'}</td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => handleEdit(j)} className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors" title="Edit">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(j.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Hapus">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
              <h2 className="font-bold text-slate-800">{editingId ? 'Edit Jurnal Kelas' : 'Tambah Jurnal Kelas'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 space-y-4 overflow-y-auto scrollbar-hide">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tanggal</label>
                <input 
                  type="date" 
                  value={tanggal}
                  onChange={e => setTanggal(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg outline-none focus:border-emerald-500 bg-slate-50 text-sm mb-4" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Mata Pelajaran & Kelas</label>
                {options.length > 0 ? (
                  <CustomSelect
                    value={selected}
                    onChange={(val) => setSelected(val)}
                    options={options}
                  />
                ) : (
                  <div className="p-3 bg-amber-50 text-amber-800 rounded-lg text-xs font-bold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    Anda belum mengonfigurasi Mata Pelajaran & Kelas.
                  </div>
                )}
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Materi / Topik</label>
                <input 
                  type="text" 
                  value={materi}
                  onChange={e => setMateri(e.target.value)}
                  placeholder="Masukkan materi..." 
                  className="w-full p-2 border border-slate-200 rounded-lg outline-none focus:border-emerald-500 bg-slate-50 text-sm" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Kegiatan / Catatan Khusus</label>
                <textarea 
                  rows={3} 
                  value={catatan}
                  onChange={e => setCatatan(e.target.value)}
                  placeholder="Siswa aktif bertanya..." 
                  className="w-full p-2 border border-slate-200 rounded-lg outline-none focus:border-emerald-500 bg-slate-50 text-sm"
                ></textarea>
              </div>
            </div>
            
            <div className="px-4 py-3 border-t border-slate-100 bg-slate-50 flex justify-end gap-2">
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)} 
                className="px-4 py-2 text-slate-500 hover:text-slate-700 hover:bg-slate-200 font-bold rounded-lg transition-colors text-sm"
              >
                Batal
              </button>
              <button 
                type="button" 
                onClick={handleSave} 
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors text-sm flex items-center gap-2"
              >
                <Check className="w-4 h-4" /> Simpan Jurnal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col">
            <div className="p-5 text-center space-y-4">
              <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-800">Hapus Jurnal?</h3>
                <p className="text-sm text-slate-500 mt-1">Anda yakin ingin menghapus jurnal ini? Tindakan ini tidak dapat dibatalkan.</p>
              </div>
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3">
              <button 
                onClick={() => setDeleteConfirm(null)} 
                className="flex-1 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors text-sm"
              >
                Batal
              </button>
              <button 
                onClick={confirmDelete} 
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl transition-colors shadow-md shadow-rose-600/20 text-sm"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 z-50 bg-slate-800 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-in slide-in-from-bottom-5">
          <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-sm font-medium">{toastMessage}</p>
        </div>
      )}
    </div>
  );
}

export interface ModulAjarItem {
  id: string;
  teacherName: string;
  role: string;
  category: 'guru_mapel' | 'wali_kelas' | 'guru_quran';
  subject: string;
  className: string;
  title: string;
  date: string;
  status: 'Sudah Membuat' | 'Belum Membuat';
  driveUrl: string;
  description: string;
  objectives: string[];
}

export const DEFAULT_MODUL_AJAR: ModulAjarItem[] = [
  {
    id: 'm-1',
    teacherName: 'Ahmad Fazil, S.Pd',
    role: 'Guru Mapel',
    category: 'guru_mapel',
    subject: 'Matematika',
    className: 'X IPA 1',
    title: 'Modul Ajar 3: Fungsi Kuadrat & Grafik Parabola',
    date: '2026-07-22',
    status: 'Sudah Membuat',
    driveUrl: 'https://drive.google.com/file/d/1A2B3C4D5E6F7G8H9I0J/view?usp=sharing',
    description: 'Membahas konsep dasar fungsi kuadrat, sifat-sifat diskriminan, titik puncak parabola, serta cara menggambar grafik fungsi kuadrat secara sistematis.',
    objectives: ['Siswa dapat menentukan titik puncak parabola', 'Siswa dapat menggambar grafik fungsi kuadrat di milimeter blok']
  },
  {
    id: 'm-2',
    teacherName: 'Budi Santoso, S.Ag',
    role: 'Wali Kelas',
    category: 'wali_kelas',
    subject: 'Fikih / Bimbingan',
    className: 'XII IPS 2',
    title: 'Modul Ajar 2: Hukum Muamalah & Ekonomi Islam',
    date: '2026-07-21',
    status: 'Sudah Membuat',
    driveUrl: 'https://drive.google.com/file/d/2B3C4D5E6F7G8H9I0J1K/view?usp=sharing',
    description: 'Pengenalan prinsip-prinsip transaksi syariah, akad jual beli, serta larangan riba dalam ekonomi modern.',
    objectives: ['Siswa memahami rukun dan syarat sah jual beli', 'Siswa mengidentifikasi contoh riba dalam kehidupan sehari-hari']
  },
  {
    id: 'm-3',
    teacherName: 'Siti Rahma, M.Pd',
    role: 'Guru Mapel',
    category: 'guru_mapel',
    subject: 'Fisika',
    className: 'XI IPA 3',
    title: 'Modul Ajar 4: Hukum Newton Tentang Gravitasi',
    date: '2026-07-20',
    status: 'Belum Membuat',
    driveUrl: 'https://drive.google.com/file/d/3C4D5E6F7G8H9I0J1K2L/view?usp=sharing',
    description: 'Menganalisis gaya gravitasi antar benda, kuat medan gravitasi, serta penerapan hukum Kepler tentang gerak planet.',
    objectives: ['Siswa dapat menghitung besarnya gaya tarik gravitasi', 'Siswa dapat membuktikan Hukum III Kepler']
  },
  {
    id: 'm-4',
    teacherName: 'Ustadz Umar, S.Pd.I',
    role: 'Guru Qur\'an',
    category: 'guru_quran',
    subject: 'Tahfizh Al-Qur\'an',
    className: 'Halaqah Al-Mulk',
    title: 'Modul Ajar Tahfizh: Tajwid Idgham & Ikhfa',
    date: '2026-07-19',
    status: 'Sudah Membuat',
    driveUrl: 'https://drive.google.com/file/d/4D5E6F7G8H9I0J1K2L3M/view?usp=sharing',
    description: 'Modul panduan tajwid praktis pelafalan Idgham Bighunnah dan Bilaghunnah pada pembacaan Surat Al-Mulk.',
    objectives: ['Siswa melafalkan bacaan Idgham dengan dengung sempurna', 'Siswa melancarkan setoran ayat 1-10']
  }
];

export function PerangkatNgajar() {
  const { user } = useAuth();
  const teacherSubjects = getTeacherSubjects();
  
  const [modulList, setModulList] = useState<ModulAjarItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchModul = async () => {
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
        setModulList(mapped);
      }
    } catch (e) {
      console.error('Failed to load materi', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModul();
  }, []);

  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{id: string, title: string} | null>(null);

  // Form Fields
  const [formSubject, setFormSubject] = useState(teacherSubjects[0]?.subjectName || 'Matematika');
  const [formClass, setFormClass] = useState(teacherSubjects[0]?.className || 'X IPA 1');
  const [formTitle, setFormTitle] = useState('');
  const [formDate, setFormDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [formDriveUrl, setFormDriveUrl] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formObjectives, setFormObjectives] = useState('');

  const handleOpenAddModal = () => {
    setEditingId(null);
    setFormSubject(teacherSubjects[0]?.subjectName || 'Matematika');
    setFormClass(teacherSubjects[0]?.className || 'X IPA 1');
    setFormTitle('');
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormDriveUrl('');
    setFormDescription('');
    setFormObjectives('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: ModulAjarItem) => {
    setEditingId(item.id);
    setFormSubject(item.subject);
    setFormClass(item.className);
    setFormTitle(item.title);
    setFormDate(item.date);
    setFormDriveUrl(item.driveUrl);
    setFormDescription(item.description);
    setFormObjectives(item.objectives ? item.objectives.join('\n') : '');
    setIsModalOpen(true);
  };

  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formDriveUrl.trim()) {
      window.alert('Mohon lengkapi Judul Modul Ajar dan Link Google Drive!');
      return;
    }

    const objectivesArray = formObjectives
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const payload = {
      id: editingId,
      user_id: user?.id,
      subject: formSubject,
      class_name: formClass,
      title: formTitle,
      description: formDescription || 'Modul Ajar harian disematkan melalui Google Drive.',
      file_name: formDriveUrl,
      status: editingId ? (modulList.find(m => m.id === editingId)?.status || 'Sudah Membuat') : 'Sudah Membuat',
      date: formDate,
      objectives: objectivesArray.length > 0 ? objectivesArray : ['Siswa mengikuti pembelajaran sesuai materi harian']
    };

    try {
      await apiClient('/save_materi.php', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      window.alert(editingId ? 'Modul Ajar berhasil diperbarui!' : 'Modul Ajar berhasil disematkan dan siap dipantau Kepala Madrasah!');
      setIsModalOpen(false);
      fetchModul();
    } catch (err) {
      console.error(err);
      window.alert('Gagal menyimpan perangkat ngajar');
    }
  };

  const handleDelete = (id: string, title: string) => {
    setDeleteConfirm({ id, title });
  };

  const confirmDelete = async () => {
    if (deleteConfirm) {
      try {
        await apiClient('/delete_materi.php', {
          method: 'POST',
          body: JSON.stringify({ id: deleteConfirm.id })
        });
        setDeleteConfirm(null);
        fetchModul();
      } catch(err) {
        console.error(err);
        window.alert('Gagal menghapus perangkat ngajar');
      }
    }
  };

  // Filter logic
  const myName = user?.name || 'Ahmad Fazil, S.Pd';
  const filteredList = modulList.filter(item => {
    const isMine = item.teacherName.toLowerCase().includes(myName.toLowerCase()) || item.teacherName.includes('Ahmad');
    if (!isMine) return false;
    
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-800">Perangkat Ajar Harian (Modul Ajar)</h1>
          <p className="text-slate-500 text-xs sm:text-sm font-medium mt-0.5">
            Sematkan link Google Drive Modul Ajar harian Anda untuk dipantau langsung oleh Kepala Madrasah.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-sm transition-all shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Sematkan Modul Ajar Baru
        </button>
      </div>

      {/* Filter Header & Search */}
      <Card className="border-slate-200/80 shadow-xs">
        <CardContent className="p-4 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari mapel, judul, kelas..."
                className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 bg-slate-50/50"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* List of Modul Ajar */}
      <div className="space-y-4">
        {filteredList.length === 0 ? (
          <Card className="border-slate-200 shadow-2xs">
            <CardContent className="p-8 text-center space-y-3">
              <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                <BookOpen className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-slate-700">Belum Ada Modul Ajar Harian</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Anda belum menyematkan link Google Drive Modul Ajar. Klik tombol di atas untuk menambahkannya.
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredList.map((item) => (
            <Card key={item.id} className="border-slate-200/80 shadow-2xs hover:border-slate-300 transition-all overflow-hidden">
              <CardContent className="p-4 sm:p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {item.className}
                      </span>
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                        {item.subject}
                      </span>
                      <span className="text-xs text-slate-400 font-bold">• {item.teacherName}</span>
                    </div>

                    <h3 className="text-sm sm:text-base font-black text-slate-800 pt-1 leading-snug">
                      {item.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                      item.status === 'Sudah Membuat'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'Sudah Membuat' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                      {item.status === 'Sudah Membuat' ? 'Sudah Membuat' : 'Belum Membuat'}
                    </span>
                  </div>
                </div>

                {/* Description & Target */}
                <div className="space-y-2 text-xs text-slate-600">
                  <p className="line-clamp-2 leading-relaxed bg-slate-50/70 p-3 rounded-xl border border-slate-100/80 font-medium">
                    {item.description}
                  </p>

                  {item.objectives && item.objectives.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Target Belajar:</span>
                      {item.objectives.map((obj, idx) => (
                        <span key={idx} className="text-[11px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/50">
                          ✓ {obj}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Google Drive Link Box & Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-blue-50/50 border border-blue-100/80 p-3 rounded-xl">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 font-bold">
                      <Link2 className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-black uppercase tracking-wider text-blue-800">Tautan Modul Ajar (Google Drive)</p>
                      <p className="text-xs text-blue-600 font-medium truncate">{item.driveUrl}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={item.driveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 transition-all shadow-2xs"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Buka Drive
                    </a>

                    <>
                      <button
                        onClick={() => handleOpenEditModal(item)}
                        className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg border border-slate-200 transition-all cursor-pointer"
                        title="Edit Modul"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id, item.title)}
                        className="p-1.5 text-slate-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg border border-slate-200 transition-all cursor-pointer"
                        title="Hapus Modul"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Modal Add/Edit Modul Ajar */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-100 animate-in fade-in zoom-in duration-200">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h2 className="text-sm font-black uppercase tracking-wider text-slate-800">
                  {editingId ? 'Edit Modul Ajar' : 'Sematkan Modul Ajar (Google Drive)'}
                </h2>
                <p className="text-xs font-bold text-emerald-600 mt-0.5">Form Perangkat Ajar Harian Guru</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="p-4 space-y-3 max-h-[480px] overflow-y-auto text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mata Pelajaran</label>
                  <input
                    type="text"
                    value={formSubject}
                    onChange={(e) => setFormSubject(e.target.value)}
                    placeholder="Misal: Matematika"
                    className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:border-emerald-500 font-semibold"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kelas</label>
                  <input
                    type="text"
                    value={formClass}
                    onChange={(e) => setFormClass(e.target.value)}
                    placeholder="Misal: X IPA 1"
                    className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:border-emerald-500 font-semibold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Judul Modul Ajar / Topik Pertemuan</label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Misal: Modul Ajar 3: Fungsi Kuadrat & Grafik Parabola"
                  className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:border-emerald-500 font-bold"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Link Google Drive Modul Ajar</label>
                <div className="relative">
                  <input
                    type="url"
                    value={formDriveUrl}
                    onChange={(e) => setFormDriveUrl(e.target.value)}
                    placeholder="https://drive.google.com/file/d/..."
                    className="w-full p-2.5 pr-8 border border-slate-200 rounded-xl bg-blue-50/30 focus:bg-white focus:outline-none focus:border-blue-500 font-medium text-blue-700"
                    required
                  />
                  <ExternalLink className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-blue-400 pointer-events-none" />
                </div>
                <p className="text-[10px] text-slate-400 mt-1 font-medium">
                  Pastikan akses file di Google Drive sudah disetel ke "Siapa saja yang memiliki link" agar Kepala Madrasah bisa membuka.
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Deskripsi Ringkas Pembelajaran</label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Penjelasan singkat mengenai isi modul, metode pembelajaran, atau tugas..."
                  className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:border-emerald-500"
                  rows={3}
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Target / Capaian Pembelajaran (Pisahkan per baris)</label>
                <textarea
                  value={formObjectives}
                  onChange={(e) => setFormObjectives(e.target.value)}
                  placeholder="Siswa dapat menentukan titik puncak parabola&#10;Siswa dapat menggambar grafik fungsi kuadrat"
                  className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:border-emerald-500"
                  rows={2}
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="h-9 font-bold">
                  Batal
                </Button>
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-9">
                  Simpan & Sematkan
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden border border-slate-100 animate-in fade-in zoom-in duration-200">
            <div className="p-5 text-center space-y-4">
              <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-800">Hapus Modul Ajar?</h3>
                <p className="text-sm text-slate-500 mt-1">Anda yakin ingin menghapus <span className="font-bold text-slate-700">"{deleteConfirm.title}"</span>? Tindakan ini tidak dapat dibatalkan.</p>
              </div>
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3">
              <Button variant="outline" onClick={() => setDeleteConfirm(null)} className="flex-1 font-bold">
                Batal
              </Button>
              <Button onClick={confirmDelete} className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold">
                Ya, Hapus
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function AnalisisSiswa() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold tracking-tight text-slate-800">Analisis Siswa</h1>
      <Card>
        <CardHeader><CardTitle>Grafik Perkembangan Nilai</CardTitle></CardHeader>
        <CardContent>
          <div className="h-48 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center">
            <span className="text-slate-400 font-medium">Grafik akan ditampilkan di sini (Integrasi Recharts)</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function Laporan() {
  const { user } = useAuth();
  const subjects = user?.subjects || [];
  
  // State for form selection
  const [reportType, setReportType] = useState<'presensi' | 'nilai' | 'jurnal' | 'analisis'>('presensi');
  
  // Available classes based on teacher's subjects
  const availableClasses = Array.from(new Set(subjects.map(s => s.className)));
  const defaultClass = availableClasses[0] || 'X-IPA 1';
  const [selectedClass, setSelectedClass] = useState(defaultClass);

  // Filter available subjects based on selected class
  const classSubjects = subjects.filter(s => s.className === selectedClass);
  const defaultSubject = classSubjects[0]?.subjectName || 'Matematika Peminatan';
  const [selectedSubject, setSelectedSubject] = useState(defaultSubject);

  // When class changes, update the subject to the first one available for that class
  React.useEffect(() => {
    const classSubs = subjects.filter(s => s.className === selectedClass);
    if (classSubs.length > 0) {
      setSelectedSubject(classSubs[0].subjectName);
    }
  }, [selectedClass]);

  const [selectedMonth, setSelectedMonth] = useState('Juli');
  const [selectedSemester, setSelectedSemester] = useState('Ganjil 2026/2027');
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const months = [
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni'
  ];

  const semesters = [
    { value: 'Ganjil 2026/2027', label: 'Ganjil 2026/2027 (Aktif)' },
    { value: 'Genap 2025/2026', label: 'Genap 2025/2026' },
    { value: 'Ganjil 2025/2026', label: 'Ganjil 2025/2026' },
    { value: 'Genap 2024/2025', label: 'Genap 2024/2025' },
    { value: 'Ganjil 2024/2025', label: 'Ganjil 2024/2025' }
  ];

  // Live preview data generator
  const getPreviewData = () => {
    const classStudents = mockStudents.filter(s => s.className === selectedClass);
    const targetStudents = classStudents.length > 0 ? classStudents : mockStudents;

    if (reportType === 'presensi') {
      return targetStudents.map((s, idx) => ({
        no: idx + 1,
        nama: s.name,
        nis: s.nis,
        hadir: s.attendance?.present || 0,
        sakit: s.attendance?.sick || 0,
        izin: s.attendance?.permission || 0,
        alpa: s.attendance?.absent || 0,
        persentase: `${Math.round(((s.attendance?.present || 0) / ((s.attendance?.present || 0) + (s.attendance?.sick || 0) + (s.attendance?.permission || 0) + (s.attendance?.absent || 0) || 1)) * 100)}%`
      }));
    } else if (reportType === 'nilai') {
      // Use deterministic pseudo-random grades based on student ID so it doesn't flicker on every re-render
      return targetStudents.map((s, idx) => {
        const charCodeSum = s.name.split('').reduce((acc, curr) => acc + curr.charCodeAt(0), 0);
        const tugas = (charCodeSum % 20) + 75; // 75-95
        const uts = ((charCodeSum * 2) % 25) + 70; // 70-95
        const uas = ((charCodeSum * 3) % 25) + 70; // 70-95
        const akhir = Math.round((tugas * 0.4) + (uts * 0.3) + (uas * 0.3));
        const predikat = akhir >= 90 ? 'A' : akhir >= 80 ? 'B' : akhir >= 70 ? 'C' : 'D';
        return {
          no: idx + 1,
          nama: s.name,
          nis: s.nis,
          tugas,
          uts,
          uas,
          akhir,
          predikat,
          ket: akhir >= 75 ? "Lulus" : "Remedial"
        };
      });
    } else if (reportType === 'jurnal') {
  return [];
    } else {
      return targetStudents.map((s, idx) => {
        const charCodeSum = s.name.split('').reduce((acc, curr) => acc + curr.charCodeAt(0), 0);
        const awal = (charCodeSum % 10) + 65; // 65-75
        const akhir = ((charCodeSum * 3) % 15) + 80; // 80-95
        const peningkat = akhir - awal;
        return {
          no: idx + 1,
          nama: s.name,
          nis: s.nis,
          awal,
          akhir,
          peningkatan: `+${peningkat}`,
          status: peningkat > 10 ? "Sangat Baik" : "Baik"
        };
      });
    }
  };

  const previewRows = getPreviewData();

  const handleDownload = (format: 'excel' | 'pdf') => {
    const classStudents = mockStudents.filter(s => s.className === selectedClass);
    const targetStudents = classStudents.length > 0 ? classStudents : mockStudents;

    let dataToExport: any[] = [];
    let sheetName = "";

    if (reportType === 'presensi') {
      sheetName = "Rekap Presensi";
      dataToExport = targetStudents.map((s, idx) => ({
        "No": idx + 1,
        "Nama Siswa": s.name,
        "NIS": s.nis,
        "Kelas": s.className,
        "Mata Pelajaran": selectedSubject,
        "Hadir (Hari)": s.attendance?.present || 0,
        "Sakit (Hari)": s.attendance?.sick || 0,
        "Izin (Hari)": s.attendance?.permission || 0,
        "Alpa (Hari)": s.attendance?.absent || 0,
        "Persentase Kehadiran": `${Math.round(((s.attendance?.present || 0) / ((s.attendance?.present || 0) + (s.attendance?.sick || 0) + (s.attendance?.permission || 0) + (s.attendance?.absent || 0) || 1)) * 100)}%`
      }));
    } else if (reportType === 'nilai') {
      sheetName = "Leger Nilai";
      dataToExport = targetStudents.map((s, idx) => {
        const charCodeSum = s.name.split('').reduce((acc, curr) => acc + curr.charCodeAt(0), 0);
        const tugas = (charCodeSum % 20) + 75;
        const uts = ((charCodeSum * 2) % 25) + 70;
        const uas = ((charCodeSum * 3) % 25) + 70;
        const akhir = Math.round((tugas * 0.4) + (uts * 0.3) + (uas * 0.3));
        const predikat = akhir >= 90 ? 'A' : akhir >= 80 ? 'B' : akhir >= 70 ? 'C' : 'D';
        return {
          "No": idx + 1,
          "Nama Siswa": s.name,
          "NIS": s.nis,
          "Kelas": s.className,
          "Mata Pelajaran": selectedSubject,
          "Nilai Tugas (40%)": tugas,
          "Nilai UTS (30%)": uts,
          "Nilai UAS (30%)": uas,
          "Nilai Akhir": akhir,
          "Predikat": predikat,
          "Keterangan": akhir >= 75 ? "Lulus KKM" : "Remedial"
        };
      });
    } else if (reportType === 'jurnal') {
      sheetName = "Jurnal Mengajar";
      dataToExport = [
        {
          "No": 1,
          "Tanggal": "06-07-2026",
          "Kelas": selectedClass,
          "Mata Pelajaran": selectedSubject,
          "Materi Pokok": "Pengenalan Logaritma & Sifat-Sifatnya",
          "Kehadiran Siswa": `${targetStudents.length} / ${targetStudents.length}`,
          "Catatan KBM": "Siswa aktif dan memahami materi dasar logaritma dengan baik."
        },
        {
          "No": 2,
          "Tanggal": "08-07-2026",
          "Kelas": selectedClass,
          "Mata Pelajaran": selectedSubject,
          "Materi Pokok": "Penerapan Fungsi Logaritma",
          "Kehadiran Siswa": `${targetStudents.length - 1} / ${targetStudents.length}`,
          "Catatan KBM": "Satu siswa izin sakit. KBM berjalan lancar dengan latihan soal berkelompok."
        },
        {
          "No": 3,
          "Tanggal": "10-07-2026",
          "Kelas": selectedClass,
          "Mata Pelajaran": selectedSubject,
          "Materi Pokok": "Ulangan Harian Logaritma",
          "Kehadiran Siswa": `${targetStudents.length} / ${targetStudents.length}`,
          "Catatan KBM": "Ulangan harian menggunakan LMS CBT Madrasah Digital."
        }
      ];
    } else {
      sheetName = "Analisis Siswa";
      dataToExport = targetStudents.map((s, idx) => {
        const charCodeSum = s.name.split('').reduce((acc, curr) => acc + curr.charCodeAt(0), 0);
        const awal = (charCodeSum % 10) + 65;
        const akhir = ((charCodeSum * 3) % 15) + 80;
        const peningkat = akhir - awal;
        return {
          "No": idx + 1,
          "Nama Siswa": s.name,
          "NIS": s.nis,
          "Kelas": s.className,
          "Mata Pelajaran": selectedSubject,
          "Nilai Awal (Pre-test)": awal,
          "Nilai Akhir (Post-test)": akhir,
          "Peningkatan": `+${peningkat}`,
          "Status Perkembangan": peningkat > 10 ? "Sangat Baik" : "Baik"
        };
      });
    }

    if (format === 'excel') {
      // Generate Excel Workbook
      const worksheet = XLSX.utils.json_to_sheet(dataToExport);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
      
      // Write & trigger download
      const filename = `Laporan_${sheetName.replace(/\s+/g, '_')}_${selectedClass.replace(/\s+/g, '_')}_${selectedMonth}_2026.xlsx`;
      XLSX.writeFile(workbook, filename);
    } else if (format === 'pdf') {
      const doc = new jsPDF();
      doc.text(`Laporan ${sheetName}`, 14, 15);
      doc.setFontSize(10);
      doc.text(`Kelas: ${selectedClass}`, 14, 22);
      doc.text(`Mata Pelajaran: ${selectedSubject}`, 14, 28);
      doc.text(`Bulan: ${selectedMonth} 2026`, 14, 34);

      const headers = Object.keys(dataToExport[0]);
      const data = dataToExport.map(row => Object.values(row).map(val => String(val)));

      autoTable(doc, {
        head: [headers],
        body: data,
        startY: 40,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [5, 150, 105] },
      });

      const filename = `Laporan_${sheetName.replace(/\s+/g, '_')}_${selectedClass.replace(/\s+/g, '_')}_${selectedMonth}_2026.pdf`;
      doc.save(filename);
    }

    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 4000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-800">Laporan Akademik Guru</h1>
          <p className="text-slate-500 text-xs mt-0.5">Ekspor rekap kehadiran, nilai, dan jurnal KBM siswa secara praktis dalam format Excel (.xlsx).</p>
        </div>
      </div>

      {showSuccessToast && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2.5 animate-bounce">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Laporan berhasil diunduh! Silakan cek folder Downloads di perangkat Anda.</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* FORM CONFIGURATION */}
        <Card className="lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>Konfigurasi Cetak Laporan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Tipe Laporan</label>
              <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-lg">
                <button
                  type="button"
                  onClick={() => setReportType('presensi')}
                  className={`py-1.5 px-2 rounded-md text-[10px] font-bold uppercase tracking-tight transition-colors ${reportType === 'presensi' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  Presensi
                </button>
                <button
                  type="button"
                  onClick={() => setReportType('nilai')}
                  className={`py-1.5 px-2 rounded-md text-[10px] font-bold uppercase tracking-tight transition-colors ${reportType === 'nilai' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  Nilai
                </button>
                <button
                  type="button"
                  onClick={() => setReportType('jurnal')}
                  className={`py-1.5 px-2 rounded-md text-[10px] font-bold uppercase tracking-tight transition-colors ${reportType === 'jurnal' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  Jurnal
                </button>
                <button
                  type="button"
                  onClick={() => setReportType('analisis')}
                  className={`py-1.5 px-2 rounded-md text-[10px] font-bold uppercase tracking-tight transition-colors ${reportType === 'analisis' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  Analisis
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Pilih Kelas</label>
              {availableClasses.length > 0 ? (
                <CustomSelect
                  value={selectedClass}
                  onChange={(val) => setSelectedClass(val)}
                  options={availableClasses.map(c => ({ value: String(c), label: `Kelas ${c}` }))}
                />
              ) : (
                <CustomSelect
                  value={selectedClass}
                  onChange={(val) => setSelectedClass(val)}
                  options={[
                    { value: 'X-IPA 1', label: 'Kelas X-IPA 1' },
                    { value: 'XI-IPA 2', label: 'Kelas XI-IPA 2' },
                    { value: 'XII-IPA 1', label: 'Kelas XII-IPA 1' }
                  ]}
                />
              )}
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Mata Pelajaran</label>
              {classSubjects.length > 0 ? (
                <CustomSelect
                  value={selectedSubject}
                  onChange={(val) => setSelectedSubject(val)}
                  options={classSubjects.map(s => ({ value: s.subjectName, label: s.subjectName }))}
                />
              ) : (
                <input
                  type="text"
                  disabled
                  value={selectedSubject}
                  className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-400 outline-none"
                />
              )}
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Tahun Ajaran / Semester</label>
              <CustomSelect
                value={selectedSemester}
                onChange={(val) => setSelectedSemester(val)}
                options={semesters}
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Bulan / Periode</label>
              <CustomSelect
                value={selectedMonth}
                onChange={(val) => setSelectedMonth(val)}
                options={months.map(m => ({ value: m, label: m }))}
              />
            </div>

            <div className="flex gap-2 mt-2">
              <button
                onClick={() => handleDownload('pdf')}
                className="flex-1 py-3 px-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-[10px] sm:text-xs font-extrabold uppercase tracking-widest flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> PDF
              </button>
              <button
                onClick={() => handleDownload('excel')}
                className="flex-1 py-3 px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10px] sm:text-xs font-extrabold uppercase tracking-widest flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> Excel
              </button>
            </div>
          </CardContent>
        </Card>

        {/* DATA PREVIEW */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Pratinjau Data Laporan</CardTitle>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
                {reportType === 'presensi' && 'REKAP ABSENSI KEHADIRAN SISWA'}
                {reportType === 'nilai' && 'LEGER NILAI ULANGAN & TUGAS'}
                {reportType === 'jurnal' && 'JURNAL KEGIATAN MENGAJAR GURU'}
                {reportType === 'analisis' && 'ANALISIS PERKEMBANGAN BELAJAR SISWA'}
                {` • Kelas ${selectedClass} • ${selectedSubject}`}
              </p>
            </div>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              {reportType === 'presensi' && (
                <>
                  <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                    <tr>
                      <th className="py-3 px-4 w-12">No</th>
                      <th className="py-3 px-4">Nama Siswa</th>
                      <th className="py-3 px-4">NIS</th>
                      <th className="py-3 px-4 text-center">H</th>
                      <th className="py-3 px-4 text-center">S</th>
                      <th className="py-3 px-4 text-center">I</th>
                      <th className="py-3 px-4 text-center">A</th>
                      <th className="py-3 px-4 text-right">Persentase</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs font-semibold text-slate-700 divide-y divide-slate-100">
                    {previewRows.map((row: any) => (
                      <tr key={row.no} className="hover:bg-slate-50/50">
                        <td className="py-3 px-4 text-slate-400">{row.no}</td>
                        <td className="py-3 px-4 font-bold text-slate-800">{row.nama}</td>
                        <td className="py-3 px-4 text-slate-500 font-mono">{row.nis}</td>
                        <td className="py-3 px-4 text-center text-emerald-600 font-bold">{row.hadir}</td>
                        <td className="py-3 px-4 text-center text-blue-600">{row.sakit}</td>
                        <td className="py-3 px-4 text-center text-amber-600">{row.izin}</td>
                        <td className="py-3 px-4 text-center text-red-600">{row.alpa}</td>
                        <td className="py-3 px-4 text-right text-slate-800 font-bold font-mono">{row.persentase}</td>
                      </tr>
                    ))}
                  </tbody>
                </>
              )}

              {reportType === 'nilai' && (
                <>
                  <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                    <tr>
                      <th className="py-3 px-4 w-12">No</th>
                      <th className="py-3 px-4">Nama Siswa</th>
                      <th className="py-3 px-4">NIS</th>
                      <th className="py-3 px-4 text-center">Tugas</th>
                      <th className="py-3 px-4 text-center">UTS</th>
                      <th className="py-3 px-4 text-center">UAS</th>
                      <th className="py-3 px-4 text-center">Akhir</th>
                      <th className="py-3 px-4 text-center">Grade</th>
                      <th className="py-3 px-4 text-right">Ket.</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs font-semibold text-slate-700 divide-y divide-slate-100">
                    {previewRows.map((row: any) => (
                      <tr key={row.no} className="hover:bg-slate-50/50">
                        <td className="py-3 px-4 text-slate-400">{row.no}</td>
                        <td className="py-3 px-4 font-bold text-slate-800">{row.nama}</td>
                        <td className="py-3 px-4 text-slate-500 font-mono">{row.nis}</td>
                        <td className="py-3 px-4 text-center font-mono">{row.tugas}</td>
                        <td className="py-3 px-4 text-center font-mono">{row.uts}</td>
                        <td className="py-3 px-4 text-center font-mono">{row.uas}</td>
                        <td className="py-3 px-4 text-center font-bold font-mono text-emerald-700 bg-emerald-50/30">{row.akhir}</td>
                        <td className="py-3 px-4 text-center font-bold text-slate-800">{row.predikat}</td>
                        <td className="py-3 px-4 text-right font-bold text-slate-600">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${row.ket === 'Lulus' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                            {row.ket}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </>
              )}

              {reportType === 'jurnal' && (
                <>
                  <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                    <tr>
                      <th className="py-3 px-4 w-12">No</th>
                      <th className="py-3 px-4 w-24">Tanggal</th>
                      <th className="py-3 px-4">Materi Pokok</th>
                      <th className="py-3 px-4 text-center w-20">Siswa</th>
                      <th className="py-3 px-4">Catatan KBM</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs font-semibold text-slate-700 divide-y divide-slate-100">
                    {previewRows.map((row: any) => (
                      <tr key={row.no} className="hover:bg-slate-50/50">
                        <td className="py-3 px-4 text-slate-400">{row.no}</td>
                        <td className="py-3 px-4 text-slate-500 font-mono font-medium">{row.tanggal}</td>
                        <td className="py-3 px-4 font-bold text-emerald-800">{row.materi}</td>
                        <td className="py-3 px-4 text-center font-mono text-slate-600">{row.hadir}</td>
                        <td className="py-3 px-4 text-slate-500 font-normal italic leading-relaxed">{row.catatan}</td>
                      </tr>
                    ))}
                  </tbody>
                </>
              )}

              {reportType === 'analisis' && (
                <>
                  <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                    <tr>
                      <th className="py-3 px-4 w-12">No</th>
                      <th className="py-3 px-4">Nama Siswa</th>
                      <th className="py-3 px-4">NIS</th>
                      <th className="py-3 px-4 text-center">Nilai Awal</th>
                      <th className="py-3 px-4 text-center">Nilai Akhir</th>
                      <th className="py-3 px-4 text-center">Peningkatan</th>
                      <th className="py-3 px-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs font-semibold text-slate-700 divide-y divide-slate-100">
                    {previewRows.map((row: any) => (
                      <tr key={row.no} className="hover:bg-slate-50/50">
                        <td className="py-3 px-4 text-slate-400">{row.no}</td>
                        <td className="py-3 px-4 font-bold text-slate-800">{row.nama}</td>
                        <td className="py-3 px-4 text-slate-500 font-mono">{row.nis}</td>
                        <td className="py-3 px-4 text-center font-mono">{row.awal}</td>
                        <td className="py-3 px-4 text-center font-mono font-bold text-emerald-700">{row.akhir}</td>
                        <td className="py-3 px-4 text-center font-mono text-emerald-600 font-bold">{row.peningkatan}</td>
                        <td className="py-3 px-4 text-right font-bold text-slate-600">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${row.status === 'Sangat Baik' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}`}>
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </>
              )}
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


export function AbsensiZuhur() {
  const { user } = useAuth();
  const [status, setStatus] = useState<'hadir' | 'tidak' | null>(null);
  const [reason, setReason] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const today = new Date().toLocaleDateString('id-ID', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-');
  const absensiKey = `absenZuhur_${user?.id}_${today}`;
  const [hasAbsen, setHasAbsen] = useState(typeof window !== 'undefined' ? localStorage.getItem(absensiKey) === 'true' : false);
  
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const limitAbsenZuhur = localStorage.getItem('limit_absen_zuhur') || '13:00';
  const [limitHour, limitMinute] = limitAbsenZuhur.split(':').map(Number);
  const isPastLimit = currentTime.getHours() > limitHour || (currentTime.getHours() === limitHour && currentTime.getMinutes() >= limitMinute);
  
  useEffect(() => {
    if (isPastLimit && status === 'hadir') {
      setStatus(null);
    }
  }, [isPastLimit, status]);

  const handleSubmit = () => {
    if (status === 'tidak' && !reason) {
      window.alert('Mohon isi keterangan (misal: haid, dinas luar, dll).');
      return;
    }

    const saveAbsen = (msg: string) => {
        window.alert(msg);
        localStorage.setItem(absensiKey, 'true');
        setHasAbsen(true);
        setStatus(null);
        setReason('');
    };

    if (status === 'hadir') {
      if (isPastLimit) {
        window.alert(`Batas waktu sholat berjamaah di masjid (${limitAbsenZuhur}) telah lewat.`);
        return;
      }
      
      if (!navigator.geolocation) {
         setLocationError("Geolocation tidak didukung oleh browser Anda.");
         return;
      }
      
      setIsLocating(true);
      setLocationError(null);
      
      navigator.geolocation.getCurrentPosition(
         (position) => {
            setIsLocating(false);
            const { latitude, longitude } = position.coords;
            
            // Get saved school coordinates or use default
            const schoolLatL = parseFloat(localStorage.getItem('school_lat_l') || '-0.502');
            const schoolLngL = parseFloat(localStorage.getItem('school_lng_l') || '101.447');
            const maxRadiusL = parseInt(localStorage.getItem('school_radius_l') || '200', 10);
            
            const schoolLatP = parseFloat(localStorage.getItem('school_lat_p') || '-0.502');
            const schoolLngP = parseFloat(localStorage.getItem('school_lng_p') || '101.447');
            const maxRadiusP = parseInt(localStorage.getItem('school_radius_p') || '200', 10);
            
            const R = 6371e3; // metres
            const φ1 = latitude * Math.PI/180;
            
            // Calc distance to Masjid Laki-laki
            const φ2L = schoolLatL * Math.PI/180;
            const ΔφL = (schoolLatL-latitude) * Math.PI/180;
            const ΔλL = (schoolLngL-longitude) * Math.PI/180;
            const aL = Math.sin(ΔφL/2) * Math.sin(ΔφL/2) +
                      Math.cos(φ1) * Math.cos(φ2L) *
                      Math.sin(ΔλL/2) * Math.sin(ΔλL/2);
            const cL = 2 * Math.atan2(Math.sqrt(aL), Math.sqrt(1-aL));
            const distanceL = R * cL;
            
            // Calc distance to Masjid Perempuan
            const φ2P = schoolLatP * Math.PI/180;
            const ΔφP = (schoolLatP-latitude) * Math.PI/180;
            const ΔλP = (schoolLngP-longitude) * Math.PI/180;
            const aP = Math.sin(ΔφP/2) * Math.sin(ΔφP/2) +
                      Math.cos(φ1) * Math.cos(φ2P) *
                      Math.sin(ΔλP/2) * Math.sin(ΔλP/2);
            const cP = 2 * Math.atan2(Math.sqrt(aP), Math.sqrt(1-aP));
            const distanceP = R * cP;
            
            const isMale = user?.gender === 'L';
            const isFemale = user?.gender === 'P';
            
            if (isMale && distanceL <= maxRadiusL) {
                saveAbsen(`Absensi sholat zuhur berhasil disimpan. (Lokasi: Masjid Laki-laki, Jarak: ${Math.round(distanceL)}m)`);
            } else if (isFemale && distanceP <= maxRadiusP) {
                saveAbsen(`Absensi sholat zuhur berhasil disimpan. (Lokasi: Musholla Perempuan, Jarak: ${Math.round(distanceP)}m)`);
            } else if (!isMale && !isFemale && (distanceL <= maxRadiusL || distanceP <= maxRadiusP)) {
                // Fallback for users without gender set
                const isMasjidL = distanceL <= maxRadiusL;
                saveAbsen(`Absensi sholat zuhur berhasil disimpan. (Lokasi: ${isMasjidL ? 'Masjid Laki-laki' : 'Musholla Perempuan'})`);
            } else {
                let errorMsg = '';
                if (isMale) {
                    errorMsg = `PERINGATAN: Anda berada di luar area Masjid. Jarak Anda: ${Math.round(distanceL)}m (Maks: ${maxRadiusL}m).\n\nPastikan GPS Anda aktif dan Anda berada di lokasi yang tepat.`;
                } else if (isFemale) {
                    errorMsg = `PERINGATAN: Anda berada di luar area Musholla. Jarak Anda: ${Math.round(distanceP)}m (Maks: ${maxRadiusP}m).\n\nPastikan GPS Anda aktif dan Anda berada di lokasi yang tepat.`;
                } else {
                    errorMsg = `PERINGATAN: Anda berada di luar area madrasah. Jarak Anda: ${Math.round(distanceL)}m ke Masjid (L) dan ${Math.round(distanceP)}m ke Musholla (P).\n\nPastikan GPS Anda aktif dan Anda berada di lokasi yang tepat.`;
                }
                window.alert(errorMsg);
                setLocationError(errorMsg.replace(/\n\n/g, ' '));
            }
         },
         (error) => {
            setIsLocating(false);
            let msg = "Gagal mengambil lokasi.";
            if (error.code === 1) msg = "Izin lokasi ditolak. Harap izinkan akses lokasi di browser untuk absen hadir.";
            else if (error.code === 2) msg = "Lokasi tidak tersedia.";
            else if (error.code === 3) msg = "Waktu pencarian lokasi habis.";
            setLocationError(msg);
         },
         { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      // Jika tidak hadir, langsung simpan (mungkin lagi dinas luar)
      saveAbsen('Absensi sholat zuhur berhasil disimpan.');
    }
  };

  if (hasAbsen) {
    return (
      <div className="space-y-6">
        <h1 className="text-xl font-bold tracking-tight text-slate-800">Absensi Sholat Zuhur Pegawai</h1>
        <Card>
          <CardContent className="p-8 text-center flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-2">
              <Check className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Absensi Berhasil</h3>
            <p className="text-slate-500 text-sm max-w-sm">
              Anda sudah melakukan absensi sholat zuhur untuk hari ini. Absensi tercatat di semua peran akun Anda.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold tracking-tight text-slate-800">Absensi Sholat Zuhur Pegawai</h1>
      <Card>
        <CardHeader><CardTitle>Presensi Jamaah Zuhur</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600 mb-6">Silakan pilih status kehadiran sholat berjamaah zuhur Anda hari ini. <br/><span className="text-xs text-slate-400 font-bold">Catatan: Absen 'Hadir' memerlukan verifikasi lokasi.</span></p>
          
          <div className="space-y-4">
            <div className="flex gap-3 mt-4">
              {!isPastLimit && (
                  <button 
                    onClick={() => { setStatus('hadir'); setLocationError(null); }}
                    className={`flex-1 py-4 font-bold rounded-xl transition-all shadow-sm uppercase tracking-wider text-xs sm:text-sm flex items-center justify-center gap-2 ${
                      status === 'hadir' 
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200 ring-2 ring-emerald-600 ring-offset-1' 
                        : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                    }`}
                  >
                    <MapPin className="w-4 h-4" /> Berjamaah
                  </button>
              )}
              <button 
                onClick={() => { setStatus('tidak'); setLocationError(null); }}
                className={`flex-1 py-4 font-bold rounded-xl transition-all shadow-sm uppercase tracking-wider text-xs sm:text-sm ${
                  status === 'tidak' 
                    ? 'bg-amber-500 text-white shadow-md shadow-amber-200 ring-2 ring-amber-500 ring-offset-1' 
                    : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
                }`}
              >
                Tidak Berjamaah
              </button>
            </div>
            
            {isPastLimit && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-700 flex items-center gap-2 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                Batas waktu absensi hadir sholat berjamaah di masjid ({limitAbsenZuhur}) telah berakhir.
              </div>
            )}

            {status === 'tidak' && (
              <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl space-y-3 mt-4 animate-in fade-in slide-in-from-top-2">
                <label className="block text-sm font-bold text-slate-700">Keterangan / Udzur</label>
                <textarea 
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Misal: Sedang haid, dinas di luar sekolah, sakit, dll."
                  className="w-full p-3 rounded-lg border border-slate-300 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm"
                  rows={3}
                ></textarea>
              </div>
            )}

            {locationError && (
               <div className="p-3 rounded-lg bg-red-50 text-red-600 border border-red-200 text-sm flex items-start gap-2">
                 <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                 <span>{locationError}</span>
               </div>
            )}

            {status && (
              <button 
                onClick={handleSubmit}
                disabled={isLocating}
                className="w-full py-3.5 bg-[#1e7b55] hover:bg-[#166544] disabled:bg-slate-300 text-white font-bold rounded-xl shadow-sm uppercase tracking-wider text-sm transition-colors flex items-center justify-center gap-2"
              >
                {isLocating ? (
                   <>
                     <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                     </svg>
                     Menyimpan & Mencari Lokasi...
                   </>
                ) : (
                   <>Simpan Absensi Zuhur</>
                )}
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
