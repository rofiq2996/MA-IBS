const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/pages/KamadPages.tsx');
let content = fs.readFileSync(file, 'utf8');

const regex = /<div className="divide-y divide-slate-100">\s*\{users\.map\(\(u, i\) => \{\s*const record = ibadahRecords\.find\(r => String\(r\.user_id\) === String\(u\.id\) && \(r\.date === dateFilter \|\| \(r\.date && r\.date\.startsWith\(dateFilter\)\)\)\);\s*return \([\s\S]*?\}\)\}\s*<\/div>/;

const replacement = `<div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Guru</th>
                    <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Jamaah/Tidak</th>
                    <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Keterangan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((u, i) => {
                    const record = ibadahRecords.find(r => String(r.user_id) === String(u.id) && (r.date === dateFilter || (r.date && r.date.startsWith(dateFilter))));
                    return (
                      <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold uppercase shrink-0 text-xs">
                              {u.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-slate-800 text-sm">{u.name}</p>
                              <p className="text-xs text-slate-500">{u.role}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {record?.status === 'Jamaah' ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Jamaah
                            </span>
                          ) : record?.status === 'Tidak Jamaah' ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span> Tidak Jamaah
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold border border-slate-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span> Belum Mengisi
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-600">
                          {record?.status === 'Tidak Jamaah' && record?.keterangan ? (
                            <span className="italic">"{record.keterangan}"</span>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>`;

if (content.match(regex)) {
    content = content.replace(regex, replacement);
    fs.writeFileSync(file, content);
    console.log('Replaced harian view with table');
} else {
    console.log('Regex did not match');
}
