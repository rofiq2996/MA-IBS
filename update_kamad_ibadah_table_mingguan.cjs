const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/pages/KamadPages.tsx');
let content = fs.readFileSync(file, 'utf8');

const regex = /<div className="divide-y divide-slate-100">\s*\{users\.map\(\(u, i\) => \{\s*const \{ start, end \} = getWeekRange\(weekFilter\);[\s\S]*?\}\)\}\s*<\/div>/;

const replacement = `<div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Guru</th>
                    <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Jml Jamaah</th>
                    <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Jml Tidak Jamaah</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((u, i) => {
                    const { start, end } = getWeekRange(weekFilter);
                    const startStr = start.toLocaleDateString('en-CA');
                    const endStr = end.toLocaleDateString('en-CA');
                    
                    const weekRecords = ibadahRecords.filter(r => 
                      String(r.user_id) === String(u.id) && 
                      (r.date >= startStr || (r.date && r.date.substring(0,10) >= startStr)) && 
                      (r.date <= endStr || (r.date && r.date.substring(0,10) <= endStr))
                    );
                    
                    const jamaahCount = weekRecords.filter(r => r.status === 'Jamaah').length;
                    const tidakJamaahCount = weekRecords.filter(r => r.status === 'Tidak Jamaah').length;
                    
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
                        <td className="py-3 px-4 text-center">
                          <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg font-bold border border-emerald-100">
                            {jamaahCount}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="inline-block px-3 py-1 bg-rose-50 text-rose-700 rounded-lg font-bold border border-rose-100">
                            {tidakJamaahCount}
                          </span>
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
    console.log('Replaced mingguan view with table');
} else {
    console.log('Regex did not match');
}
