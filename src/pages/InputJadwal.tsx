import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Plus, Edit2, Trash2, X, Check, Search, FileUp, Download, Clock, BookOpen, User } from 'lucide-react';
import { mockClasses, mockUsers } from '../data/mock';
import { dbClient } from '../lib/dbClient';
import { apiClient } from '../lib/apiClient';
import { CustomSelect } from '../components/ui/CustomSelect';
import * as XLSX from 'xlsx';

export function InputJadwal() {
  const [classes, setClasses] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  useEffect(() => {
     apiClient('/sync').then(data => {
        if(data.classes) setClasses(data.classes);
        if(data.users) setUsers(data.users);
        if(data.classes && data.classes.length > 0) {
           setRombel(data.classes[0].name);
           setFilterRombel(data.classes[0].name);
        }
     });
  }, []);


  const [subjects, setSubjects] = useState<any[]>([]);
  useEffect(() => {
    dbClient.get('subjects').then(data => {
      if (Array.isArray(data)) setSubjects(data);
    });
  }, []);

  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const data = await apiClient('/crud.php?table=schedules');
      if (Array.isArray(data)) {
        const mapped = data.map((d: any) => ({
          id: d.id,
          rombel: d.class_name,
          hari: d.day,
          jamMulai: d.start_time?.substring(0,5),
          jamSelesai: d.end_time?.substring(0,5),
          mapel: d.subject_name,
          guruId: String(d.teacher_id),
          guruName: users.find((u:any) => String(u.id) === String(d.teacher_id))?.name || 'Guru'
        }));
        setSchedules(mapped);
      }
    } catch(err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if(users.length > 0) {
      fetchSchedules();
    }
  }, [users]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  const [rombel, setRombel] = useState(classes[0]?.name || '');
  const [hari, setHari] = useState('Senin');
  const [jamMulai, setJamMulai] = useState('07:15');
  const [jamSelesai, setJamSelesai] = useState('08:00');
  const [mapel, setMapel] = useState('');
  const [guru, setGuru] = useState('');
  
  const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const teachers = users.filter((u:any) => u.role === 'guru' || u.role === 'walas' || u.role === 'guru_quran');

  const [filterRombel, setFilterRombel] = useState(classes[0]?.name || '');
  const [filterHari, setFilterHari] = useState('Senin');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        
        const newSchedules = data.map((row: any) => ({
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          rombel: row.Kelas || row.Rombel || filterRombel,
          hari: row.Hari || filterHari,
          jamMulai: row.JamMulai || '07:00',
          jamSelesai: row.JamSelesai || '08:00',
          mapel: row.Mapel || row.MataPelajaran || '',
          guruId: row.GuruId || '', // Bisa dikembangkan untuk mencari ID berdasarkan nama
          guruName: row.Guru || row.GuruName || ''
        }));

        if (newSchedules.length > 0) {
          Promise.all(newSchedules.map((s: any) => apiClient('/crud.php?table=schedules', {
            method: 'POST',
            body: JSON.stringify({
              class_name: s.rombel,
              day: s.hari,
              start_time: s.jamMulai,
              end_time: s.jamSelesai,
              subject_name: s.mapel,
              teacher_id: s.guruId
            })
          }))).then(() => {
            fetchSchedules();
            window.alert(`Berhasil mengimpor ${newSchedules.length} jadwal`);
          }).catch(err => {
            console.error(err);
            window.alert('Terjadi kesalahan saat menyimpan sebagian jadwal');
            fetchSchedules();
          });
        }
      } catch (error) {
        console.error(error);
        window.alert('Gagal membaca file Excel. Pastikan format sesuai.');
      }
    };
    reader.readAsBinaryString(file);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDownloadTemplate = () => {
    const ws = XLSX.utils.json_to_sheet([
      {
        Kelas: 'X-IPA 1',
        Hari: 'Senin',
        JamMulai: '07:15',
        JamSelesai: '08:00',
        Mapel: 'Matematika',
        Guru: 'Budi Santoso, S.Pd',
        GuruId: '1'
      }
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template');
    XLSX.writeFile(wb, 'Template_Jadwal.xlsx');
  };

  const openAdd = () => {
    setEditingId(null);
    setHari(filterHari);
    setRombel(filterRombel);
    setJamMulai('07:15');
    setJamSelesai('08:00');
    setMapel('');
    setGuru(teachers[0]?.id || '');
    setIsModalOpen(true);
  };
  
  const openEdit = (s: any) => {
    setEditingId(s.id);
    setRombel(s.rombel);
    setHari(s.hari);
    setJamMulai(s.jamMulai);
    setJamSelesai(s.jamSelesai);
    setMapel(s.mapel);
    setGuru(s.guruId);
    setIsModalOpen(true);
  };
  
  const handleDeleteClick = (id: string) => {
    setDeletingId(id);
  };
  
  const handleSave = () => {
    if (!rombel || !hari || !jamMulai || !jamSelesai || !mapel || !guru) {
      window.alert('Mohon lengkapi semua data jadwal!');
      return;
    }
    
    const guruData = teachers.find(t => t.id === guru);
    
    const newSchedule = {
      id: editingId || Date.now().toString(),
      rombel,
      hari,
      jamMulai,
      jamSelesai,
      mapel,
      guruId: guru,
      guruName: guruData?.name || ''
    };
    
    if (editingId) {
      setSchedules(schedules.map(s => s.id === editingId ? newSchedule : s));
    } else {
      setSchedules([...schedules, newSchedule]);
    }
    
    setIsModalOpen(false);
  };

  const filteredSchedules = schedules
    .filter(s => s.rombel === filterRombel && s.hari === filterHari)
    .sort((a, b) => a.jamMulai.localeCompare(b.jamMulai));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">Kelola Jadwal Pelajaran</h1>
          <p className="text-slate-500 mt-1 text-sm">Atur jadwal mengajar guru dan kelas</p>
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            accept=".xlsx, .xls" 
            className="hidden" 
          />
          <button 
            onClick={handleDownloadTemplate}
            className="flex-1 sm:flex-none px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" /> Template
          </button>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 sm:flex-none px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <FileUp className="w-4 h-4" /> Import Excel
          </button>
          <button 
            onClick={openAdd}
            className="flex-1 sm:flex-none px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" /> Tambah Jadwal
          </button>
        </div>
      </div>

      <Card>
        <CardHeader className="border-b border-slate-100 bg-slate-50">
          <div className="flex gap-3 items-end">
            <div className="flex-1 w-full">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Pilih Kelas</label>
              <CustomSelect 
                value={filterRombel}
                onChange={v => setFilterRombel(v)}
                options={classes.map(c => ({ value: c.name, label: c.name }))}
                searchable={true}
              />
            </div>
            <div className="flex-1 w-full">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Pilih Hari</label>
              <CustomSelect 
                value={filterHari}
                onChange={v => setFilterHari(v)}
                options={days.map(d => ({ value: d, label: d }))}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-white text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 w-32">Waktu</th>
                  <th className="py-3 px-4">Mata Pelajaran</th>
                  <th className="py-3 px-4">Guru Pengajar</th>
                  <th className="py-3 px-4 text-center w-24">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredSchedules.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center">
                        <Search className="w-8 h-8 mb-2 text-slate-300" />
                        <p>Belum ada jadwal untuk kelas dan hari ini.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredSchedules.map(s => (
                    <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-mono text-xs text-slate-600">
                        {s.jamMulai} - {s.jamSelesai}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-800">{s.mapel}</td>
                      <td className="py-3 px-4 text-slate-600">{s.guruName}</td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => openEdit(s)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors" title="Edit">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDeleteClick(s.id)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors" title="Hapus">
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

          {/* Mobile Card-List View */}
          <div className="md:hidden flex flex-col divide-y divide-slate-100">
            {filteredSchedules.length === 0 ? (
              <div className="py-12 text-center text-slate-400 px-4">
                <div className="flex flex-col items-center justify-center">
                  <Search className="w-8 h-8 mb-2 text-slate-300" />
                  <p className="text-sm font-medium">Belum ada jadwal untuk kelas dan hari ini.</p>
                </div>
              </div>
            ) : (
              filteredSchedules.map(s => (
                <div key={s.id} className="p-4 flex flex-col gap-2 bg-white hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" /> {s.jamMulai} - {s.jamSelesai}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => openEdit(s)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors" title="Edit">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteClick(s.id)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors" title="Hapus">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-800 leading-tight flex items-start gap-1.5">
                      <BookOpen className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                      <span>{s.mapel}</span>
                    </h3>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                    <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{s.guruName}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-2.5 sm:p-4 pb-20 sm:pb-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[82vh] sm:max-h-[90vh] my-auto">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
              <h2 className="font-bold text-slate-800">{editingId ? 'Edit Jadwal' : 'Tambah Jadwal Baru'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 space-y-4 overflow-y-auto scrollbar-hide">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Kelas</label>
                  <CustomSelect 
                    value={rombel}
                    onChange={v => setRombel(v)}
                    options={classes.map(c => ({ value: c.name, label: c.name }))}
                    searchable={true}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Hari</label>
                  <CustomSelect 
                    value={hari}
                    onChange={v => setHari(v)}
                    options={days.map(d => ({ value: d, label: d }))}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Jam Mulai</label>
                  <input 
                    type="time" 
                    value={jamMulai}
                    onChange={e => setJamMulai(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg outline-none focus:border-indigo-500 bg-slate-50 text-sm font-mono" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Jam Selesai</label>
                  <input 
                    type="time" 
                    value={jamSelesai}
                    onChange={e => setJamSelesai(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg outline-none focus:border-indigo-500 bg-slate-50 text-sm font-mono" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Mata Pelajaran</label>
                <CustomSelect 
                  value={mapel}
                  onChange={v => setMapel(v)}
                  options={subjects.map(s => ({ value: s.name, label: s.name }))}
                  placeholder="Pilih Mata Pelajaran"
                  searchable={true}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Guru Pengajar</label>
                <CustomSelect 
                  value={guru}
                  onChange={v => setGuru(v)}
                  options={teachers.map(t => ({ value: String(t.id), label: t.name }))}
                  placeholder="Pilih Guru"
                  searchable={true}
                />
              </div>
            </div>
            
            <div className="px-4 py-3 border-t border-slate-100 bg-slate-50 flex justify-end gap-2 shrink-0">
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
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-colors text-sm flex items-center gap-2"
              >
                <Check className="w-4 h-4" /> Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {deletingId && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-2.5 sm:p-4 pb-20 sm:pb-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col my-auto">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-rose-500" />
              </div>
              <h2 className="text-lg font-bold text-slate-800 mb-2">Hapus Jadwal?</h2>
              <p className="text-sm text-slate-500">
                Apakah Anda yakin ingin menghapus jadwal ini? Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex gap-3">
              <button
                onClick={() => setDeletingId(null)}
                className="flex-1 px-4 py-2 text-slate-600 hover:bg-slate-200 font-bold rounded-lg transition-colors text-sm"
              >
                Batal
              </button>
              <button
                onClick={async () => {
                  try {
                    await apiClient(`/crud.php?table=schedules&id=${deletingId}`, { method: 'DELETE' });
                    setSchedules(schedules.filter(s => s.id !== deletingId));
                  } catch (err) {
                    console.error(err);
                    window.alert('Gagal menghapus jadwal');
                  } finally {
                    setDeletingId(null);
                  }
                }}
                className="flex-1 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg transition-colors text-sm"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
