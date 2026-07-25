import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { FileText, Share2, Upload, Plus, Trash2, Link as LinkIcon, Download, QrCode } from 'lucide-react';
import { CustomSelect } from '../components/ui/CustomSelect';
import { useAuth } from '../context/AuthContext';

interface Assignment {
  id: string;
  title: string;
  type: 'materi' | 'tugas';
  className: string;
  subject: string;
  deadline?: string;
  link?: string;
  fileName?: string;
  createdAt: string;
}

export function LMSTugas() {
  const { user } = useAuth();
  const isSiswa = user?.role === 'siswa';

  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      id: '1',
      title: 'Materi Bab 1 - Logaritma Dasar',
      type: 'materi',
      className: 'X-IPA 1',
      subject: 'Matematika Peminatan',
      link: 'https://docs.google.com/presentation/d/1234',
      fileName: 'Materi_Logaritma.pdf',
      createdAt: '2026-07-01'
    },
    {
      id: '2',
      title: 'Tugas Latihan 1.1',
      type: 'tugas',
      className: 'X-IPA 1',
      subject: 'Matematika Peminatan',
      deadline: '2026-07-15 23:59',
      createdAt: '2026-07-10'
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedQRLink, setSelectedQRLink] = useState('');
  const [form, setForm] = useState<Partial<Assignment>>({ type: 'tugas', className: 'X-IPA 1', subject: 'Matematika Peminatan' });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) return;

    setAssignments([
      {
        id: Date.now().toString(),
        title: form.title,
        type: form.type as 'materi' | 'tugas',
        className: form.className || 'X-IPA 1',
        subject: form.subject || 'Matematika Peminatan',
        deadline: form.deadline,
        link: form.link,
        fileName: form.fileName,
        createdAt: new Date().toISOString().split('T')[0]
      },
      ...assignments
    ]);
    setShowModal(false);
    setForm({ type: 'tugas', className: 'X-IPA 1', subject: 'Matematika Peminatan' });
  };

  const handleDelete = (id: string) => {
    setAssignments(assignments.filter(a => a.id !== id));
  };

  const handleCopyLink = (link?: string) => {
    if (!link) return;
    navigator.clipboard.writeText(link);
    alert('Link berhasil disalin!');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-800">LMS - Materi & Tugas</h1>
          <p className="text-slate-500 mt-1 text-sm">{isSiswa ? 'Akses materi dan tugas yang diberikan.' : 'Bagikan link tugas, upload materi, dan kelola pembelajaran online.'}</p>
        </div>
        {!isSiswa && (
          <Button onClick={() => setShowModal(true)} className="shrink-0 gap-2">
            <Plus className="w-4 h-4" /> BUAT BARU
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          {assignments.map(item => (
            <Card key={item.id}>
              <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${item.type === 'tugas' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
                    {item.type === 'tugas' ? <Upload className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${item.type === 'tugas' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>
                        {item.type}
                      </span>
                      <span className="text-[10px] text-slate-500 uppercase font-semibold">{item.className} • {item.subject}</span>
                    </div>
                    <h3 className="font-bold text-slate-800 text-base mb-1">{item.title}</h3>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium">
                      <span>Dibuat: {item.createdAt}</span>
                      {item.deadline && <span className="text-red-500">Tenggat: {item.deadline}</span>}
                    </div>
                    
                    {/* Link & File info */}
                    {(item.link || item.fileName) && (
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        {item.link && (
                          <>
                            <button onClick={() => handleCopyLink(item.link)} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors">
                              <LinkIcon className="w-3.5 h-3.5" /> Salin Tautan
                            </button>
                            <button onClick={() => { setSelectedQRLink(item.link!); setShowQRModal(true); }} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors">
                              <QrCode className="w-3.5 h-3.5" /> Barcode
                            </button>
                          </>
                        )}
                        {item.fileName && (
                          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg text-xs font-bold">
                            <FileText className="w-3.5 h-3.5" /> {item.fileName}
                            <Download className="w-3.5 h-3.5 ml-1 cursor-pointer hover:text-emerald-900" />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 sm:self-center self-start mt-2 sm:mt-0 shrink-0">
                  {item.type === 'tugas' && (
                    <Button variant="outline" size="sm" className="gap-2 text-emerald-700 border-emerald-200 hover:bg-emerald-50">
                      {isSiswa ? 'KUMPUL TUGAS' : 'LIHAT HASIL'}
                    </Button>
                  )}
                  {!isSiswa && (
                    <button onClick={() => handleDelete(item.id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
          
          {assignments.length === 0 && (
            <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-300 rounded-xl">
              <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 font-medium">Belum ada materi atau tugas yang dibagikan.</p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ringkasan LMS</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 text-blue-800 rounded-lg border border-blue-100">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-blue-500" />
                  <span className="text-sm font-bold">Total Materi</span>
                </div>
                <span className="text-lg font-black">{assignments.filter(a => a.type === 'materi').length}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-amber-50 text-amber-800 rounded-lg border border-amber-100">
                <div className="flex items-center gap-3">
                  <Upload className="w-5 h-5 text-amber-500" />
                  <span className="text-sm font-bold">Total Tugas</span>
                </div>
                <span className="text-lg font-black">{assignments.filter(a => a.type === 'tugas').length}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-visible">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800">Buat Materi / Tugas Baru</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>
            <form onSubmit={handleSave} className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, type: 'materi' })}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 ${form.type === 'materi' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-slate-50 border-slate-200 text-slate-500'}`}
                >
                  <FileText className="w-4 h-4" /> Materi
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, type: 'tugas' })}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 ${form.type === 'tugas' ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-slate-50 border-slate-200 text-slate-500'}`}
                >
                  <Upload className="w-4 h-4" /> Tugas
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Judul</label>
                <input 
                  type="text" 
                  required 
                  value={form.title || ''}
                  onChange={(e) => setForm({...form, title: e.target.value})}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" 
                  placeholder="Misal: Tugas Akhir Semester"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Kelas</label>
                  <CustomSelect
                    value={form.className || 'X-IPA 1'}
                    onChange={(val) => setForm({...form, className: val})}
                    options={[{value: 'X-IPA 1', label: 'X-IPA 1'}, {value: 'X-IPS 1', label: 'X-IPS 1'}]}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Mata Pelajaran</label>
                  <CustomSelect
                    value={form.subject || 'Matematika Peminatan'}
                    onChange={(val) => setForm({...form, subject: val})}
                    options={[{value: 'Matematika Peminatan', label: 'Matematika'}, {value: 'Bahasa Indonesia', label: 'B. Indo'}]}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Lampirkan Tautan (Link)</label>
                <input 
                  type="url" 
                  value={form.link || ''}
                  onChange={(e) => setForm({...form, link: e.target.value})}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" 
                  placeholder="https://docs.google.com/..."
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Upload File (PDF/Doc/Excel)</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="file" 
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        setForm({...form, fileName: e.target.files[0].name});
                      }
                    }}
                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                  />
                </div>
              </div>

              {form.type === 'tugas' && (
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Batas Waktu (Deadline)</label>
                  <input 
                    type="datetime-local" 
                    value={form.deadline || ''}
                    onChange={(e) => setForm({...form, deadline: e.target.value})}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" 
                  />
                </div>
              )}

              <div className="pt-2">
                <Button type="submit" className="w-full py-3">SIMPAN & BAGIKAN</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showQRModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-visible text-center">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800">Barcode Tugas/Materi</h2>
              <button onClick={() => setShowQRModal(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>
            <div className="p-8 flex flex-col items-center justify-center">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm inline-block">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(selectedQRLink)}`} 
                  alt="QR Code" 
                  className="w-48 h-48"
                />
              </div>
              <p className="mt-4 text-xs font-medium text-slate-500 break-all px-4">
                {selectedQRLink}
              </p>
              <Button onClick={() => setShowQRModal(false)} className="w-full mt-6 py-2.5">Tutup</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
