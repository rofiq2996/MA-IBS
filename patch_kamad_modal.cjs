const fs = require('fs');
let code = fs.readFileSync('src/pages/KamadPages.tsx', 'utf8');

const modalUI = `
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
                  <p className="text-xs text-slate-500">{selectedStaf.role} {selectedStaf.kelas !== '-' ? \`• \${selectedStaf.kelas}\` : ''}</p>
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
                  let statusStyle = "";
                  let TaskIcon = CheckCircle2;
                  
                  if (task.status === 'selesai') {
                    statusStyle = "bg-emerald-50 border-emerald-100 text-emerald-700";
                    TaskIcon = CheckCircle2;
                  } else if (task.status === 'terlewat') {
                    statusStyle = "bg-rose-50 border-rose-100 text-rose-700";
                    TaskIcon = XCircle;
                  } else {
                    statusStyle = "bg-amber-50 border-amber-100 text-amber-700";
                    TaskIcon = Clock;
                  }
                  
                  return (
                    <div key={idx} className={\`p-4 rounded-xl border flex items-center justify-between gap-3 \${statusStyle}\`}>
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
`;

code = code.replace("return (", modalUI + "\n  return (");
fs.writeFileSync('src/pages/KamadPages.tsx', code);
