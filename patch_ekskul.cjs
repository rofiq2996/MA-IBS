const fs = require('fs');
let code = fs.readFileSync('src/pages/KesiswaanPages.tsx', 'utf8');

const replacement = `
export function KesiswaanEkskul() {
  const [ekskulList, setEkskulList] = useState<any[]>(() => {
    const saved = localStorage.getItem('kesiswaan_ekskul_data');
    return saved ? JSON.parse(saved) : [
      { id: 1, nama: 'Pramuka', pembina: 'Ahmad Fauzi, S.Pd', jadwal: 'Jumat, 14:00 - 16:00', anggota: 45 },
      { id: 2, nama: 'PMR', pembina: 'Siti Aminah, S.Kep', jadwal: 'Rabu, 15:00 - 16:30', anggota: 30 },
      { id: 3, nama: 'Rohis', pembina: 'Ust. Abdul Somad', jadwal: 'Sabtu, 09:00 - 11:00', anggota: 50 },
      { id: 4, nama: 'Basket', pembina: 'Budi Santoso, S.Pd', jadwal: 'Selasa, 15:00 - 17:00', anggota: 25 },
    ];
  });

  useEffect(() => {
    localStorage.setItem('kesiswaan_ekskul_data', JSON.stringify(ekskulList));
  }, [ekskulList]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ id: 0, nama: '', pembina: '', jadwal: '', anggota: 0 });

  const handleOpen = (e?: any) => {
    if (e) {
      setForm(e);
    } else {
      setForm({ id: 0, nama: '', pembina: '', jadwal: '', anggota: 0 });
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (form.id) {
      setEkskulList(ekskulList.map(x => x.id === form.id ? form : x));
    } else {
      setEkskulList([...ekskulList, { ...form, id: Date.now() }]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: number) => {
    if (confirm('Yakin ingin menghapus ekskul ini?')) {
      setEkskulList(ekskulList.filter(x => x.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Manajemen Ekstrakurikuler</h1>
          <p className="text-slate-500 text-sm mt-1">Kelola data kegiatan ekstrakurikuler madrasah</p>
        </div>
        <button onClick={() => handleOpen()} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors">
          <Plus className="w-4 h-4" /> Tambah Ekskul
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {ekskulList.map((e) => (
          <Card key={e.id} className="border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
            <CardContent className="p-5 relative">
              <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 p-1 rounded-lg backdrop-blur-sm">
                <button onClick={() => handleOpen(e)} className="p-1.5 text-slate-400 hover:text-blue-600 rounded hover:bg-blue-50 transition-colors"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(e.id)} className="p-1.5 text-slate-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-bold text-lg shadow-inner">
                  {e.nama.charAt(0)}
                </div>
              </div>
              <h3 className="font-bold text-slate-800 text-lg">{e.nama}</h3>
              <p className="text-sm text-slate-500 mb-4">{e.pembina}</p>
              
              <div className="space-y-2 text-sm bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Jadwal</span>
                  <span className="font-bold text-slate-700 text-right">{e.jadwal}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Anggota</span>
                  <span className="font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full text-xs">{e.anggota} Siswa</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50">
              <h2 className="font-bold text-lg text-slate-800">{form.id ? 'Edit Ekskul' : 'Tambah Ekskul'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Nama Ekskul</label>
                <input type="text" value={form.nama} onChange={e => setForm({...form, nama: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:border-emerald-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Pembina</label>
                <input type="text" value={form.pembina} onChange={e => setForm({...form, pembina: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:border-emerald-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Jadwal (Contoh: Jumat, 14:00)</label>
                <input type="text" value={form.jadwal} onChange={e => setForm({...form, jadwal: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:border-emerald-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Jumlah Anggota</label>
                <input type="number" value={form.anggota} onChange={e => setForm({...form, anggota: parseInt(e.target.value) || 0})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:border-emerald-500 outline-none" />
              </div>
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-2">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-500 hover:text-slate-700 text-sm font-bold">Batal</button>
              <button onClick={handleSave} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold flex items-center gap-2">
                <Check className="w-4 h-4" /> Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
`;

const oldFunctionRegex = /export function KesiswaanEkskul\(\) \{[\s\S]*?\}\s*$/;
code = code.replace(oldFunctionRegex, replacement.trim());

fs.writeFileSync('src/pages/KesiswaanPages.tsx', code);
