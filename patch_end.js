const fs = require('fs');
let code = fs.readFileSync('src/pages/LMSTugas.tsx', 'utf8');

const toAdd = `
      {/* Submit Assignment Modal (Student) */}
      {submitModalAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-800">Kumpulkan Tugas</h2>
                <p className="text-xs text-slate-500 mt-1">{submitModalAssignment.title}</p>
              </div>
              <button onClick={() => setSubmitModalAssignment(null)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmitTugas} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Upload File (PDF/Doc/Zip)</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="file" 
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        setSubmitForm({...submitForm, file: e.target.files[0]});
                      }
                    }}
                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                  />
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-2 text-slate-500 font-bold uppercase">ATAU</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Lampirkan Tautan (Link Drive/Lainnya)</label>
                <input 
                  type="url" 
                  value={submitForm.link}
                  onChange={(e) => setSubmitForm({...submitForm, link: e.target.value})}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" 
                  placeholder="https://..."
                />
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setSubmitModalAssignment(null)} className="font-bold">Batal</Button>
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 font-bold">Kumpul Sekarang</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Results Modal (Teacher) */}
      {viewResultsAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-800">Hasil Pengumpulan Tugas</h2>
                <p className="text-xs text-slate-500 mt-1">{viewResultsAssignment.title}</p>
              </div>
              <button onClick={() => setViewResultsAssignment(null)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-0 overflow-y-auto flex-1">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase text-xs font-bold">
                  <tr>
                    <th className="px-5 py-3">Nama Siswa</th>
                    <th className="px-5 py-3">Waktu Kumpul</th>
                    <th className="px-5 py-3">Lampiran</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Nilai</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {submissions[viewResultsAssignment.id]?.length > 0 ? (
                    submissions[viewResultsAssignment.id].map(sub => (
                      <tr key={sub.id} className="hover:bg-slate-50">
                        <td className="px-5 py-3 font-bold text-slate-800">{sub.studentName}</td>
                        <td className="px-5 py-3 text-slate-500">{sub.submittedAt}</td>
                        <td className="px-5 py-3">
                          {sub.fileUrl && (
                            <a href="#" className="flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-bold hover:underline" onClick={(e) => e.preventDefault()}>
                              <FileText className="w-3.5 h-3.5" /> Buka
                            </a>
                          )}
                        </td>
                        <td className="px-5 py-3">
                          <span className={\`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider \${sub.status === 'dinilai' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}\`}>
                            {sub.status === 'dinilai' ? 'Dinilai' : 'Belum Dinilai'}
                          </span>
                        </td>
                        <td className="px-5 py-3 font-bold text-slate-800">
                          {sub.score || '-'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-5 py-8 text-center text-slate-500 font-medium">
                        Belum ada siswa yang mengumpulkan tugas ini.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <Button variant="outline" onClick={() => setViewResultsAssignment(null)} className="font-bold">Tutup</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
`;

code = code.replace(/    <\/div>\s*\}\s*\);\s*\}/, toAdd);
code = code.replace(/    <\/div>\s*\}\s*\)\s*\}\s*<\/\div>\s*\}\s*\)\s*\}\s*<\/\div>\s*\)\s*\;\s*\}/g, "    </div>\n  );\n}"); // clean up just in case
fs.writeFileSync('src/pages/LMSTugas.tsx', code);
