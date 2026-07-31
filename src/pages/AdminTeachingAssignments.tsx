import React, { useState, useEffect, useRef } from 'react';
import { remoteStorage } from '../lib/remoteStorage';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Plus, Edit2, Trash2, X, Check, Search, UserCheck, Download, Upload } from 'lucide-react';
import { mockClasses, mockUsers, mockSubjects } from '../data/mock';
import { CustomSelect } from '../components/ui/CustomSelect';
import { dbClient } from '../lib/dbClient';
import * as XLSX from 'xlsx';

interface TeachingAssignment {
  id: string;
  rombel: string;
  mapel: string;
  guruId: string;
  guruName: string;
}

export function AdminTeachingAssignments() {
  const [classes, setClasses] = useState(mockClasses);

  const [users, setUsers] = useState<any[]>(() => {
    return mockUsers;
  });

  const [assignments, setAssignments] = useState<TeachingAssignment[]>(() => {
    const saved = remoteStorage.getItem('app_teaching_assignments');
    return [];
  });
  
  useEffect(() => {
    remoteStorage.setItem('app_teaching_assignments', JSON.stringify(assignments));
  }, [assignments]);
  
  const [subjects, setSubjects] = useState<any[]>([]);
  useEffect(() => {
    dbClient.get('subjects').then(data => {
      if (Array.isArray(data)) setSubjects(data);
    });
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [rombel, setRombel] = useState(classes[0]?.name || '');
  const [mapel, setMapel] = useState(subjects[0]?.name || '');
  const [guru, setGuru] = useState('');
  
  const teachers = users.filter(u => u.role === 'guru' || u.role === 'walas' || u.role === 'guru_quran');

  const [filterRombel, setFilterRombel] = useState('');
  const [filterMapel, setFilterMapel] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const downloadTemplate = () => {
    const ws = XLSX.utils.json_to_sheet([
      { Kelas: 'X-IPA 1', 'Mata Pelajaran': 'Matematika', 'Guru Pengajar': 'Budi Santoso' },
      { Kelas: 'X-IPA 1', 'Mata Pelajaran': 'Bahasa Indonesia', 'Guru Pengajar': 'Siti Aminah' }
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template Plotting");
    XLSX.writeFile(wb, "Template_Upload_Plotting.xlsx");
  };

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
        
        let newAssignments: TeachingAssignment[] = [];
        let errors = [];

        data.forEach((row: any) => {
          const kelas = row.Kelas || row.kelas || '';
          const mapel = row['Mata Pelajaran'] || row.mapel || '';
          const guruName = row['Guru Pengajar'] || row.guru || '';

          if (!kelas || !mapel || !guruName) return;

          // Find teacher by name
          const matchedGuru = teachers.find(t => 
            t.name.toLowerCase() === guruName.toLowerCase() || 
            t.name.toLowerCase().includes(guruName.toLowerCase())
          );

          if (!matchedGuru) {
            errors.push(`Guru "${guruName}" tidak ditemukan.`);
            return;
          }

          newAssignments.push({
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            rombel: kelas,
            mapel: mapel,
            guruId: matchedGuru.id,
            guruName: matchedGuru.name
          });
        });

        if (newAssignments.length > 0) {
          // Merge avoiding duplicates (same class & mapel)
          const merged = [...assignments];
          newAssignments.forEach(na => {
            const idx = merged.findIndex(a => a.rombel === na.rombel && a.mapel === na.mapel);
            if (idx >= 0) {
              merged[idx] = na; // Update existing
            } else {
              merged.push(na);
            }
          });
          setAssignments(merged);
          
          if (errors.length > 0) {
            window.alert(`Berhasil mengimpor ${newAssignments.length} plotting. Namun ada beberapa error:\n\n${errors.join('\n')}`);
          } else {
            window.alert(`Berhasil mengimpor ${newAssignments.length} plotting pengajar!`);
          }
        } else {
          window.alert("Tidak ada data plotting valid yang ditemukan pada file.");
        }
      } catch (err) {
        console.error(err);
        window.alert("Gagal membaca file Excel.");
      }
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsBinaryString(file);
  };

  const openAdd = () => {
    setEditingId(null);
    setRombel(filterRombel || classes[0]?.name || '');
    setMapel(filterMapel || subjects[0]?.name || '');
    setGuru(teachers[0]?.id || '');
    setIsModalOpen(true);
  };
  
  const openEdit = (a: TeachingAssignment) => {
    setEditingId(a.id);
    setRombel(a.rombel);
    setMapel(a.mapel);
    setGuru(a.guruId);
    setIsModalOpen(true);
  };
  
  const handleDelete = (id: string) => {
    if (window.confirm('Hapus plotting pengajar ini?')) {
      setAssignments(assignments.filter(a => a.id !== id));
    }
  };
  
  const handleSave = () => {
    if (!rombel || !mapel || !guru) {
      window.alert('Mohon lengkapi data (Kelas, Mata Pelajaran, dan Guru)!');
      return;
    }
    
    const guruData = teachers.find(t => t.id === guru);
    
    const newAssignment = {
      id: editingId || Date.now().toString(),
      rombel,
      mapel,
      guruId: guru,
      guruName: guruData?.name || ''
    };
    
    const exists = assignments.find(a => a.rombel === rombel && a.mapel === mapel && a.id !== editingId);
    if (exists) {
      window.alert('Mata pelajaran ini sudah memiliki guru untuk kelas tersebut!');
      return;
    }
    
    if (editingId) {
      setAssignments(assignments.map(a => a.id === editingId ? newAssignment : a));
    } else {
      setAssignments([...assignments, newAssignment]);
    }
    
    setIsModalOpen(false);
  };

  const filteredAssignments = assignments
    .filter(a => (filterRombel ? a.rombel === filterRombel : true) && (filterMapel ? a.mapel === filterMapel : true))
    .sort((a, b) => a.rombel.localeCompare(b.rombel) || a.mapel.localeCompare(b.mapel));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">Plotting Pengajar</h1>
          <p className="text-slate-500 mt-1 text-sm">Menentukan guru mata pelajaran per kelas</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <input 
            type="file" 
            accept=".xlsx, .xls" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleFileUpload}
          />
          <button
            onClick={downloadTemplate}
            className="px-4 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors shrink-0"
            title="Download Template Excel"
          >
            <Download className="w-4 h-4" /> Unduh Template
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors shrink-0"
            title="Upload Data Excel"
          >
            <Upload className="w-4 h-4" /> Import Excel
          </button>
          <button 
            onClick={openAdd}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-bold flex items-center gap-2 transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" /> Plotting Baru
          </button>
        </div>
      </div>

      <Card>
        <CardHeader className="border-b border-slate-100 bg-slate-50">
          <div className="flex gap-3 items-end">
            <div className="flex-1 w-full">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Filter Kelas</label>
              <CustomSelect 
                value={filterRombel}
                onChange={v => setFilterRombel(v)}
                options={[{ value: '', label: 'Semua Kelas' }, ...classes.map(c => ({ value: c.name, label: c.name }))]}
                searchable={true}
              />
            </div>
            <div className="flex-1 w-full">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Filter Mapel</label>
              <CustomSelect 
                value={filterMapel}
                onChange={v => setFilterMapel(v)}
                options={[{ value: '', label: 'Semua Mapel' }, ...subjects.map(s => ({ value: s.name, label: s.name }))]}
                searchable={true}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-white text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 w-32">Kelas</th>
                  <th className="py-3 px-4 min-w-[200px]">Mata Pelajaran</th>
                  <th className="py-3 px-4 min-w-[200px]">Guru Pengajar</th>
                  <th className="py-3 px-4 text-center w-24">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredAssignments.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center">
                        <UserCheck className="w-8 h-8 mb-2 text-slate-300" />
                        <p>Belum ada data plotting pengajar.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredAssignments.map(a => (
                    <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-800">{a.rombel}</td>
                      <td className="py-3 px-4 font-medium text-slate-700">{a.mapel}</td>
                      <td className="py-3 px-4 text-slate-600 flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-[10px] shrink-0">
                          {a.guruName.charAt(0)}
                        </div>
                        {a.guruName}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => openEdit(a)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(a.id)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors">
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
        </CardContent>
      </Card>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-2.5 sm:p-4 pb-20 sm:pb-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[82vh] sm:max-h-[90vh] my-auto">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h2 className="font-bold text-slate-800">{editingId ? 'Edit Plotting' : 'Plotting Pengajar Baru'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
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
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Mata Pelajaran</label>
                <CustomSelect 
                  value={mapel}
                  onChange={v => setMapel(v)}
                  options={subjects.map(s => ({ value: s.name, label: s.name }))}
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
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-colors text-sm flex items-center gap-2"
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
