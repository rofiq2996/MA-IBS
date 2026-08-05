const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/pages/KamadPages.tsx');
let content = fs.readFileSync(file, 'utf8');

const regex = /<div className="flex flex-col sm:flex-row gap-4 sm:items-center shrink-0">([\s\S]*?)<\/div>\s*<\/div>\s*\);\s*\}\)\}/g;
const replacement = `<div className="flex flex-col sm:flex-row gap-4 sm:items-center shrink-0">
                      <div className="flex items-center gap-4 bg-white border border-slate-200 rounded-lg px-3 py-2 min-w-[200px]">
                        <div className="flex items-center gap-2">
                          <div className={\`w-3 h-3 rounded-full \${record?.status === 'Jamaah' ? 'bg-emerald-500' : record?.status === 'Tidak Jamaah' ? 'bg-rose-500' : 'bg-slate-300'}\`}></div>
                          <span className={\`text-sm font-semibold \${record?.status === 'Jamaah' ? 'text-emerald-700' : record?.status === 'Tidak Jamaah' ? 'text-rose-700' : 'text-slate-500'}\`}>
                            {record?.status || 'Belum Mengisi'}
                          </span>
                        </div>
                      </div>
                      
                      {record?.status === 'Tidak Jamaah' && record?.keterangan && (
                        <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg max-w-[200px] truncate" title={record.keterangan}>
                          <span className="text-sm text-slate-600 italic">"{record.keterangan}"</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}`;

content = content.replace(regex, replacement);

fs.writeFileSync(file, content);
