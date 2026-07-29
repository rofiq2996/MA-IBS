const fs = require('fs');
let code = fs.readFileSync('src/pages/KamadPages.tsx', 'utf8');

const oldLayout = `                <div key={index} className="p-4 sm:p-6 hover:bg-slate-50 transition-colors">
                  <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold uppercase shrink-0">
                        {staf.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{staf.name}</p>
                        <p className="text-xs text-slate-500">{staf.role} • {staf.kelas}</p>
                      </div>
                    </div>
                    <div className={\`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border \${summary.color}\`}>
                      <SummaryIcon className="w-4 h-4" />
                      {summary.label}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4 sm:mt-0">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs font-bold gap-2 text-indigo-700 border-indigo-200 hover:bg-indigo-50 w-full sm:w-auto"
                      onClick={() => setSelectedStaf(staf)}
                    >
                      <Eye className="w-4 h-4" />
                      View Jobdesk
                    </Button>
                  </div>
                </div>`;

const newLayout = `                <div key={index} className="p-4 sm:p-6 hover:bg-slate-50 transition-colors">
                  <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold uppercase shrink-0">
                        {staf.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{staf.name}</p>
                        <p className="text-xs text-slate-500">{staf.role} {staf.kelas !== '-' ? \`• \${staf.kelas}\` : ''}</p>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                      <div className={\`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border \${summary.color}\`}>
                        <SummaryIcon className="w-4 h-4" />
                        {summary.label}
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-xs font-bold gap-2 text-indigo-700 border-indigo-200 hover:bg-indigo-50 w-full sm:w-auto"
                        onClick={() => setSelectedStaf(staf)}
                      >
                        <Eye className="w-4 h-4" />
                        View Jobdesk
                      </Button>
                    </div>
                  </div>
                </div>`;

code = code.replace(oldLayout, newLayout);
fs.writeFileSync('src/pages/KamadPages.tsx', code);
