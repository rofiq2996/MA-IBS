const fs = require('fs');
let code = fs.readFileSync('src/pages/AdminReports.tsx', 'utf8');

const modalRegex = /<div className="space-y-4">[\s\S]*?<div className="mt-8 overflow-hidden rounded border border-slate-200">[\s\S]*?<\/div>\s*<\/div>/;

const newModalTable = `{(() => {
                  const { headers, rows } = getReportData();
                  return (
                    <div className="mt-8 overflow-hidden rounded border border-slate-200">
                       <table className="w-full text-sm text-left">
                          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                             <tr>
                                {headers.map((h, i) => (
                                  <th key={i} className="p-3 font-bold">{h}</th>
                                ))}
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-slate-700">
                             {rows.length === 0 ? (
                               <tr>
                                 <td colSpan={headers.length} className="p-4 text-center text-slate-500">Tidak ada data</td>
                               </tr>
                             ) : rows.map((r, i) => (
                               <tr key={i}>
                                  {r.map((c: any, j: number) => (
                                    <td key={j} className="p-3">{c}</td>
                                  ))}
                               </tr>
                             ))}
                          </tbody>
                       </table>
                    </div>
                  );
                })()}`;

code = code.replace(modalRegex, newModalTable);
fs.writeFileSync('src/pages/AdminReports.tsx', code);
