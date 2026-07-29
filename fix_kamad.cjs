const fs = require('fs');
let code = fs.readFileSync('src/pages/KamadPages.tsx', 'utf8');

const modalPattern = /\{selectedStaf && \([\s\S]*?<\/[dD]iv>\s*\)\}\s*/;
code = code.replace(modalPattern, "");

const funcIndex = code.indexOf('export function KamadKinerjaStaf');
if (funcIndex !== -1) {
  const returnIndex = code.indexOf('return (', funcIndex);
  if (returnIndex !== -1) {
    const modalUI = 
      "\n      {selectedStaf && (\n" +
      "        <div className=\"fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm\">\n" +
      "          <div className=\"bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]\">\n" +
      "            <div className=\"p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50\">\n" +
      "              <div className=\"flex items-center gap-3\">\n" +
      "                <div className=\"w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold uppercase shrink-0\">\n" +
      "                  {selectedStaf.name.charAt(0)}\n" +
      "                </div>\n" +
      "                <div>\n" +
      "                  <h3 className=\"font-bold text-slate-800\">{selectedStaf.name}</h3>\n" +
      "                  <p className=\"text-xs text-slate-500\">{selectedStaf.role} {selectedStaf.kelas !== '-' ? `• ${selectedStaf.kelas}` : ''}</p>\n" +
      "                </div>\n" +
      "              </div>\n" +
      "              <button \n" +
      "                onClick={() => setSelectedStaf(null)}\n" +
      "                className=\"w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-500 transition-colors\"\n" +
      "              >\n" +
      "                <X className=\"w-5 h-5\" />\n" +
      "              </button>\n" +
      "            </div>\n" +
      "            <div className=\"p-4 sm:p-6 overflow-y-auto\">\n" +
      "              <h4 className=\"text-xs font-black uppercase tracking-wider text-slate-400 mb-4\">Daftar Jobdesk Hari Ini</h4>\n" +
      "              <div className=\"space-y-3\">\n" +
      "                {selectedStaf.tasks.map((task: any, idx: number) => {\n" +
      "                  let statusStyle = '';\n" +
      "                  let TaskIcon = CheckCircle2;\n" +
      "                  \n" +
      "                  if (task.status === 'selesai') {\n" +
      "                    statusStyle = 'bg-emerald-50 border-emerald-100 text-emerald-700';\n" +
      "                    TaskIcon = CheckCircle2;\n" +
      "                  } else if (task.status === 'terlewat') {\n" +
      "                    statusStyle = 'bg-rose-50 border-rose-100 text-rose-700';\n" +
      "                    TaskIcon = XCircle;\n" +
      "                  } else {\n" +
      "                    statusStyle = 'bg-amber-50 border-amber-100 text-amber-700';\n" +
      "                    TaskIcon = Clock;\n" +
      "                  }\n" +
      "                  \n" +
      "                  return (\n" +
      "                    <div key={idx} className={`p-4 rounded-xl border flex items-center justify-between gap-3 ${statusStyle}`}>\n" +
      "                      <div className=\"flex items-center gap-3\">\n" +
      "                        <TaskIcon className=\"w-5 h-5 shrink-0\" />\n" +
      "                        <div>\n" +
      "                          <p className=\"text-sm font-bold\">{task.name}</p>\n" +
      "                          <p className=\"text-[10px] mt-0.5 opacity-80\">{task.time}</p>\n" +
      "                        </div>\n" +
      "                      </div>\n" +
      "                      <span className=\"text-[10px] font-black uppercase tracking-wider px-2 py-1 bg-white/50 rounded-md\">\n" +
      "                        {task.status}\n" +
      "                      </span>\n" +
      "                    </div>\n" +
      "                  );\n" +
      "                })}\n" +
      "              </div>\n" +
      "            </div>\n" +
      "            <div className=\"p-4 border-t border-slate-100 bg-slate-50 flex justify-end\">\n" +
      "              <Button variant=\"outline\" onClick={() => setSelectedStaf(null)}>Tutup</Button>\n" +
      "            </div>\n" +
      "          </div>\n" +
      "        </div>\n" +
      "      )}\n";

    const before = code.substring(0, returnIndex + 'return ('.length);
    const after = code.substring(returnIndex + 'return ('.length);
    code = before + modalUI + after;
  }
}

code = code.replace(/<div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">[\s\S]*?<\/div>\s*<Card/, '<Card');

fs.writeFileSync('src/pages/KamadPages.tsx', code);
