import React, { useState, useEffect } from 'react';
import { remoteStorage } from '../lib/remoteStorage';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { mockStudents } from '../data/mock';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../lib/apiClient';
import { CustomSelect } from '../components/ui/CustomSelect';
import { Plus, Edit2, X, Check } from 'lucide-react';


function useWalasStudents() {
  const { user } = useAuth();
  const [students, setStudents] = useState<any[]>([]);
  useEffect(() => {
    if (!user) return;
    apiClient('/crud.php?table=students').then(data => {
       // Find students belonging to this walas
       const myClass = user.className || user.class_name;
       const filtered = data.filter((s:any) => s.class_name === myClass);
       setStudents(filtered.map((s:any) => ({ id: String(s.id), name: s.name, nis: s.nis, className: s.class_name })));
    }).catch(console.error);
  }, [user]);
  return students;
}

export function PemantauanPagi() {
  const students = useWalasStudents();
  const [monitoring, setMonitoring] = useState<Record<string, { kebersihan: string; seragam: string; ketSeragam: string }>>({});
  
  useEffect(() => {
    setMonitoring(prev => {
      const initial = { ...prev };
      students.forEach(s => {
        if (!initial[s.id]) {
          initial[s.id] = { kebersihan: 'Piket', seragam: 'Lengkap', ketSeragam: '' };
        }
      });
      return initial;
    });
  }, [students]);

  const [motivasiPagi, setMotivasiPagi] = useState('');

  const handleUpdate = (id: string, key: 'kebersihan' | 'seragam' | 'ketSeragam', value: string) => {
    setMonitoring(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [key]: value
      }
    }));
  };

  const handleSave = () => {
    window.alert("Pemantauan pagi berhasil disimpan!");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold tracking-tight text-slate-800">Pemantauan Pagi</h1>
      
      <Card>
        <CardHeader><CardTitle>Motivasi Pagi</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-700">Jelaskan motivasi pagi apa yang Anda berikan kepada kelas hari ini:</label>
            <textarea
              value={motivasiPagi}
              onChange={(e) => setMotivasiPagi(e.target.value)}
              placeholder="Misal: Memberikan motivasi tentang pentingnya disiplin waktu..."
              className="w-full p-3 rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Piket & Seragam Siswa</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="divide-y divide-slate-200 border border-slate-200 rounded-lg overflow-visible">
              {students.map((s, index) => (
                <div key={s.id} className={`flex flex-col lg:flex-row lg:items-center justify-between p-3 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}>
                  <div className="flex items-center gap-3 lg:w-1/3 mb-3 lg:mb-0">
                    <span className="text-slate-400 font-medium text-sm w-5">{index + 1}.</span>
                    <span className="font-medium text-slate-800">{s.name}</span>
                  </div>
                  <div className="flex gap-3 lg:w-2/3">
                    <div className="flex-1">
                      <CustomSelect
                        value={monitoring[s.id]?.kebersihan || 'Piket'}
                        onChange={(val) => handleUpdate(s.id, 'kebersihan', val)}
                        options={[
                          { value: 'Piket', label: 'Piket' },
                          { value: 'Tidak Piket', label: 'Tidak Piket' },
                        ]}
                      />
                    </div>
                    <div className="flex-1">
                      <CustomSelect
                        value={monitoring[s.id]?.seragam || 'Lengkap'}
                        onChange={(val) => {
                          handleUpdate(s.id, 'seragam', val);
                          if (val === 'Lengkap') {
                            handleUpdate(s.id, 'ketSeragam', '');
                          }
                        }}
                        options={[
                          { value: 'Lengkap', label: 'Lengkap' },
                          { value: 'Tidak Lengkap', label: 'Tidak Lengkap' },
                        ]}
                      />
                    </div>
                    {monitoring[s.id]?.seragam === 'Tidak Lengkap' && (
                      <div className="flex-1">
                        <input
                          type="text"
                          value={monitoring[s.id]?.ketSeragam || ''}
                          onChange={(e) => handleUpdate(s.id, 'ketSeragam', e.target.value)}
                          placeholder="Alasan tidak lengkap..."
                          className="w-full p-2 text-sm border border-slate-300 rounded focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <button onClick={handleSave} className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors">SIMPAN PEMANTAUAN</button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function NilaiSikap() {
  const students = useWalasStudents();
  const [grades, setGrades] = useState<Record<string, string>>({});
  useEffect(() => {
    setGrades(prev => {
      const initial = { ...prev };
      students.forEach(s => {
        if (!initial[s.id]) initial[s.id] = 'B';
      });
      return initial;
    });
  }, [students]);

  const handleUpdate = (id: string, val: string) => {
    setGrades(prev => ({ ...prev, [id]: val }));
  };

  const handleSave = () => {
    window.alert("Nilai sikap berhasil disimpan!");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold tracking-tight text-slate-800">Nilai Sikap & Karakter</h1>
      <Card>
        <CardHeader><CardTitle>Penilaian Sikap Spiritual & Sosial</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="divide-y divide-slate-200 border border-slate-200 rounded-lg overflow-visible">
              {students.map((s, index) => (
                <div key={s.id} className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400 font-medium text-sm w-5">{index + 1}.</span>
                    <span className="font-medium text-slate-800">{s.name}</span>
                  </div>
                  <div className="w-full sm:w-48 mt-3 sm:mt-0 ml-8 sm:ml-0">
                    <CustomSelect
                      value={grades[s.id] || 'B'}
                      onChange={(val) => handleUpdate(s.id, val)}
                      options={[
                        { value: 'A', label: 'Sangat Baik (A)' },
                        { value: 'B', label: 'Baik (B)' },
                        { value: 'C', label: 'Cukup (C)' },
                        { value: 'D', label: 'Kurang (D)' },
                      ]}
                    />
                  </div>
                </div>
              ))}
            </div>
            <button onClick={handleSave} className="w-full mt-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors">SIMPAN NILAI SIKAP</button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function SholatZuhurWalas() {
  const students = useWalasStudents();
  const [attendance, setAttendance] = useState<Record<string, { status: string; ket: string }>>({});
  const { user } = useAuth();
  
  const selectedClass = user?.className || user?.class_name || '';
  const availableClasses = [selectedClass];

  const today = new Date().toLocaleDateString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

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
    window.alert("Absensi Sholat Zuhur berhasil disimpan!");
  };

  const showStudents = selectedClass !== '';

  return (
    <div className="space-y-4">
      {/* Top Bar */}
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3 bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100/50">
            <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>
            </div>
            <div className="pr-4">
              <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Tanggal Absensi</p>
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-slate-800">{today}</p>
                <svg className="w-3.5 h-3.5 text-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="w-[200px]">
              <CustomSelect
                value={selectedClass}
                onChange={setSelectedClass}
                options={[
                  { value: '', label: 'Pilih Kelas' },
                  ...availableClasses.map(c => ({ value: c, label: c }))
                ]}
              />
            </div>
            <button 
              onClick={handleSave}
              className="px-5 py-2.5 bg-[#8db6a3] hover:bg-[#7aa08f] text-white rounded-lg text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-colors shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
              Simpan
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Card className="border-slate-200 shadow-sm overflow-visible">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="py-3 px-4 text-xs font-bold text-slate-600 uppercase w-16 text-center">No</th>
                <th className="py-3 px-4 text-xs font-bold text-slate-600 uppercase">Nama Siswa</th>
                <th className="py-3 px-4 text-xs font-bold text-slate-600 uppercase text-center min-w-[140px]">Status Kehadiran</th>
                <th className="py-3 px-4 text-xs font-bold text-slate-600 uppercase">Keterangan</th>
              </tr>
            </thead>
            <tbody>
              {showStudents ? (
                students.map((s, i) => {
                  const stat = attendance[s.id]?.status || '';
                  const ket = attendance[s.id]?.ket || '';
                  return (
                    <tr key={s.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-4 text-sm font-medium text-slate-500 text-center">{i + 1}</td>
                      <td className="py-4 px-4 text-sm font-bold text-slate-800">{s.name}</td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {['Jamaah', 'Tidak'].map(st => {
                            let bgActive = '';
                            let textActive = 'text-white';
                            let bgInactive = '';
                            let textInactive = '';
                            let hoverBg = '';
                            if (st === 'Jamaah') { bgActive = 'bg-emerald-500'; bgInactive = 'bg-emerald-50'; textInactive = 'text-emerald-600'; hoverBg = 'hover:bg-emerald-100'; }
                            if (st === 'Tidak') { bgActive = 'bg-amber-500'; bgInactive = 'bg-amber-50'; textInactive = 'text-amber-600'; hoverBg = 'hover:bg-amber-100'; }
                            
                            const stLabel = st === 'Jamaah' ? 'J' : 'T';

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
                    Pilih kelas terlebih dahulu
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

export function PrestasiWalas() {
  const students = useWalasStudents();
  const [studentId, setStudentId] = useState('');
  useEffect(() => {
    if (students.length > 0 && !studentId) {
       setStudentId(students[0].id);
    }
  }, [students]);
  const [jenis, setJenis] = useState('');
  const [keterangan, setKeterangan] = useState('');

  const handleSave = () => {
    if (!jenis || !keterangan) {
      window.alert("Mohon lengkapi jenis prestasi dan keterangan.");
      return;
    }
    window.alert("Data prestasi berhasil disimpan.");
    setJenis('');
    setKeterangan('');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold tracking-tight text-slate-800">Input Prestasi Siswa</h1>
      <Card>
        <CardHeader><CardTitle>Tambah Prestasi Baru</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <label className="block text-sm font-bold text-slate-700">Pilih Siswa</label>
            <CustomSelect
              value={studentId}
              onChange={setStudentId}
              options={students.map(s => ({ value: String(s.id), label: s.name }))}
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-bold text-slate-700">Tingkat / Jenis Prestasi</label>
            <CustomSelect
              value={jenis}
              onChange={setJenis}
              options={[
                { value: '', label: '-- Pilih Tingkat --' },
                { value: 'Sekolah', label: 'Tingkat Sekolah' },
                { value: 'Kabupaten/Kota', label: 'Tingkat Kabupaten/Kota' },
                { value: 'Provinsi', label: 'Tingkat Provinsi' },
                { value: 'Nasional', label: 'Tingkat Nasional' },
                { value: 'Internasional', label: 'Tingkat Internasional' },
              ]}
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-bold text-slate-700">Keterangan / Nama Lomba</label>
            <input 
              type="text" 
              value={keterangan}
              onChange={(e) => setKeterangan(e.target.value)}
              placeholder="Contoh: Juara 1 OSN Matematika"
              className="w-full p-3 rounded-lg border border-slate-300 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>
          <button onClick={handleSave} className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors shadow-sm">
            Simpan Prestasi
          </button>
        </CardContent>
      </Card>
    </div>
  );
}

export function BkWalas() {
  const [cases, setCases] = useState(() => {
    const saved = remoteStorage.getItem('walas_cases_data');
    return saved ? JSON.parse(saved) : [
    { 
      id: 1, 
      tanggal: '18-07-2026', 
      namaSiswa: 'Budi (XI-IPS 2)', 
      kasus: 'Sering terlambat dan tidur di kelas',
      tindakLanjut: 'Sudah ditegur dan dinasihati, perlu panggilan orang tua.',
      status: 'Dalam Proses'
    }
  ];
  });

  useEffect(() => {
    remoteStorage.setItem('walas_cases_data', JSON.stringify(cases));
  }, [cases]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tanggal, setTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [studentId, setStudentId] = useState('');
  useEffect(() => {
    if (students.length > 0 && !studentId) {
      setStudentId(students[0].id);
    }
  }, [students]);
  const [kasus, setKasus] = useState('');
  const [penanganan, setPenanganan] = useState('');
  const [status, setStatus] = useState('Dalam Proses');

  const handleSave = () => {
    if (!tanggal || !studentId || !kasus) {
      window.alert('Mohon lengkapi data wajib (Tanggal, Siswa, Kasus)!');
      return;
    }
    
    const student = students.find(s => s.id === studentId);
    
    const newCase = {
      id: Date.now(),
      tanggal: new Date(tanggal).toLocaleDateString('id-ID'),
      namaSiswa: student ? student.name : '',
      kasus,
      tindakLanjut: penanganan,
      status,
      source: 'Walas'
    };


    // Jika dialihkan ke Kesiswaan, tambahkan ke storage Kesiswaan
    if (status === 'Alihkan ke Kesiswaan') {
      const kesiswaanSaved = remoteStorage.getItem('bk_rekomendasi_sp'); // We can reuse the same sync queue
      const kesiswaanCases = kesiswaanSaved ? JSON.parse(kesiswaanSaved) : [];
      
      kesiswaanCases.push({
        idKasusWalas: newCase.id,
        tanggal: newCase.tanggal,
        namaSiswa: newCase.namaSiswa,
        kasus: newCase.kasus,
        usulanSP: 'Belum Ditentukan'
      });
      remoteStorage.setItem('bk_rekomendasi_sp', JSON.stringify(kesiswaanCases));
    }

    // Jika dialihkan ke BK, tambahkan juga ke storage BK
    if (status === 'Alihkan ke BK') {
      const bkSaved = remoteStorage.getItem('bk_cases_data');
      const bkCases = bkSaved ? JSON.parse(bkSaved) : [];
      
      // Cek apakah sudah ada untuk menghindari duplikasi jika diedit (untuk saat ini create new)
      bkCases.push({
        ...newCase,
        tindakLanjutBK: 'Menunggu penanganan BK'
      });
      remoteStorage.setItem('bk_cases_data', JSON.stringify(bkCases));
    }
    
    setCases([newCase, ...cases]);
    setTanggal(new Date().toISOString().split('T')[0]);
    setStudentId(students[0]?.id || '');
    setKasus('');
    setPenanganan('');
    setStatus('Dalam Proses');
    setIsModalOpen(false);
    window.alert("Laporan BK berhasil disimpan dan akan diteruskan ke guru BK.");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-800">Catatan Siswa</h1>
          <p className="text-sm text-slate-500 mt-1">Rekap kasus dan tindak lanjut siswa (Wali Kelas)</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-sm font-bold flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" /> Tambah
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 whitespace-nowrap">Tanggal</th>
                <th className="py-3 px-4">Nama Siswa</th>
                <th className="py-3 px-4 min-w-[200px]">Kasus</th>
                <th className="py-3 px-4 min-w-[200px]">Tindak Lanjut</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {cases.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 italic">Belum ada catatan siswa</td>
                </tr>
              ) : (
                cases.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 whitespace-nowrap">{c.tanggal}</td>
                    <td className="py-3 px-4 font-medium text-slate-700">{c.namaSiswa}</td>
                    <td className="py-3 px-4">{c.kasus}</td>
                    <td className="py-3 px-4 text-slate-500">{c.tindakLanjut || '-'}</td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${c.status === 'Selesai' ? 'bg-emerald-100 text-emerald-700' : c.status === 'Alihkan ke BK' ? 'bg-indigo-100 text-indigo-700' : 'bg-amber-100 text-amber-700'}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-2.5 sm:p-4 pb-20 sm:pb-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[82vh] sm:max-h-[90vh] my-auto">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
              <h2 className="font-bold text-slate-800">Tambah Catatan Siswa</h2>
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
                  className="w-full p-2 border border-slate-200 rounded-lg outline-none focus:border-rose-500 bg-slate-50 text-sm" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Pilih Siswa</label>
                <CustomSelect
                  value={studentId}
                  onChange={setStudentId}
                  options={students.map(s => ({ value: String(s.id), label: s.name }))}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Deskripsi Kasus / Masalah</label>
                <textarea 
                  rows={3} 
                  value={kasus}
                  onChange={e => setKasus(e.target.value)}
                  placeholder="Contoh: Siswa sering terlambat dan tidur di kelas..." 
                  className="w-full p-2 border border-slate-200 rounded-lg outline-none focus:border-rose-500 bg-slate-50 text-sm"
                ></textarea>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tindak Lanjut Walas</label>
                <textarea 
                  rows={2} 
                  value={penanganan}
                  onChange={e => setPenanganan(e.target.value)}
                  placeholder="Contoh: Sudah ditegur dan dinasihati, perlu panggilan orang tua..." 
                  className="w-full p-2 border border-slate-200 rounded-lg outline-none focus:border-rose-500 bg-slate-50 text-sm"
                ></textarea>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Status</label>
                <CustomSelect
                  value={status}
                  onChange={v => setStatus(v)}
                  options={[
                    { value: 'Dalam Proses', label: 'Dalam Proses' },
                    { value: 'Selesai', label: 'Selesai' },
                    { value: 'Alihkan ke BK', label: 'Alihkan ke BK' },
                    { value: 'Alihkan ke Kesiswaan', label: 'Alihkan ke Kesiswaan' }
                  ]}
                />
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
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg transition-colors text-sm flex items-center gap-2"
              >
                <Check className="w-4 h-4" /> Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
