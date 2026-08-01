const fs = require('fs');
const filePath = 'src/pages/KamadPages.tsx';
let content = fs.readFileSync(filePath, 'utf8');

const kamadApprovalContent = `
export function KamadApprovalIzin() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = () => {
    setLoading(true);
    apiClient('/query.php', {
      method: 'POST',
      body: JSON.stringify({
        query: \`
          SELECT lr.*, u.name as user_name, u.role as user_role 
          FROM leave_requests lr
          JOIN users u ON lr.user_id = u.id
          ORDER BY lr.created_at DESC
        \`
      })
    })
    .then(data => {
      if (Array.isArray(data)) setRequests(data);
    })
    .catch(console.error)
    .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleUpdateStatus = (id: string, status: string) => {
    if (!window.confirm(\`Yakin ingin update status menjadi \${status}?\`)) return;
    
    apiClient(\`/crud.php?table=leave_requests&id=\${id}\`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    })
    .then(() => {
      fetchRequests();
      window.alert('Status berhasil diupdate!');
    })
    .catch(err => {
      console.error(err);
      window.alert('Gagal mengupdate status');
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800"><CheckCircle className="w-3.5 h-3.5" /> Disetujui</span>;
      case 'rejected':
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider bg-red-100 text-red-800"><XCircle className="w-3.5 h-3.5" /> Ditolak</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-800"><Clock4 className="w-3.5 h-3.5" /> Menunggu</span>;
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight text-slate-800">Approval Perizinan Staf & Guru</h1>
      <Card>
        <CardContent className="p-6">
          {loading ? (
             <div className="text-center py-10">Memuat data...</div>
          ) : requests.length === 0 ? (
             <div className="text-center py-10 text-slate-500">Tidak ada data perizinan.</div>
          ) : (
             <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="py-3 px-4 text-xs font-bold text-slate-600 uppercase">Nama Pemohon</th>
                      <th className="py-3 px-4 text-xs font-bold text-slate-600 uppercase">Peran</th>
                      <th className="py-3 px-4 text-xs font-bold text-slate-600 uppercase">Jenis Izin</th>
                      <th className="py-3 px-4 text-xs font-bold text-slate-600 uppercase">Tanggal</th>
                      <th className="py-3 px-4 text-xs font-bold text-slate-600 uppercase">Keterangan</th>
                      <th className="py-3 px-4 text-xs font-bold text-slate-600 uppercase text-center">Status</th>
                      <th className="py-3 px-4 text-xs font-bold text-slate-600 uppercase text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((r, i) => (
                      <tr key={r.id || i} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-4 px-4 text-sm font-bold text-slate-800">{r.user_name}</td>
                        <td className="py-4 px-4 text-sm font-medium text-slate-600 capitalize">{r.user_role?.replace('_', ' ')}</td>
                        <td className="py-4 px-4 text-sm font-medium text-slate-600 capitalize">{r.type?.replace('_', ' ')}</td>
                        <td className="py-4 px-4 text-sm font-medium text-slate-600">
                           {format(new Date(r.start_date), 'dd MMM yyyy', {locale: id})} - <br/> {format(new Date(r.end_date), 'dd MMM yyyy', {locale: id})}
                        </td>
                        <td className="py-4 px-4 text-sm font-medium text-slate-600">{r.reason}</td>
                        <td className="py-4 px-4 text-center">{getStatusBadge(r.status)}</td>
                        <td className="py-4 px-4 text-center">
                          {r.status === 'pending' ? (
                            <div className="flex items-center justify-center gap-2">
                               <button onClick={() => handleUpdateStatus(r.id, 'approved')} className="bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white px-3 py-1.5 rounded text-xs font-bold transition-colors">Terima</button>
                               <button onClick={() => handleUpdateStatus(r.id, 'rejected')} className="bg-red-50 text-red-600 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded text-xs font-bold transition-colors">Tolak</button>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400 font-medium">Selesai</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
`;

content = content.replace(/export function KamadApprovalIzin\(\) \{[\s\S]*?\n\}/, kamadApprovalContent);
fs.writeFileSync(filePath, content, 'utf8');
console.log("Updated KamadApprovalIzin");
