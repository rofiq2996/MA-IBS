const fs = require('fs');
let file = fs.readFileSync('src/pages/GuruPages.tsx', 'utf8');

const regexPreview = /akhir: akhir \|\| '-'/g;
const newPreview = `akhir: akhir || '-',\n          uhCount: uhs.length`;
file = file.replace(regexPreview, newPreview);

const regexTableRender = /\{isWalas \? \(\s*<>\s*<th className="py-3 px-4 text-center">Jamaah<\/th>\s*<th className="py-3 px-4 text-center">Tidak Jamaah<\/th>\s*<th className="py-3 px-4 text-right">Persentase<\/th>\s*<\/>\s*\) : \(\s*<>\s*<th className="py-3 px-4 text-center">UH 1<\/th>\s*<th className="py-3 px-4 text-center">UH 2<\/th>\s*<th className="py-3 px-4 text-center">UH 3<\/th>\s*<th className="py-3 px-4 text-center">UH 4<\/th>\s*<th className="py-3 px-4 text-center">UH 5<\/th>\s*<th className="py-3 px-4 text-center">STS<\/th>\s*<th className="py-3 px-4 text-center">SAS<\/th>\s*<th className="py-3 px-4 text-center">Akhir<\/th>\s*<\/>\s*\)/g;

const newTableRender = `{isWalas ? (
                        <>
                          <th className="py-3 px-4 text-center">Jamaah</th>
                          <th className="py-3 px-4 text-center">Tidak Jamaah</th>
                          <th className="py-3 px-4 text-right">Persentase</th>
                        </>
                      ) : (
                        <>
                          {Array.from({ length: Math.max(1, ...previewRows.map((r: any) => r.uhCount || 0)) }).map((_, i) => (
                            <th key={i} className="py-3 px-4 text-center">UH {i + 1}</th>
                          ))}
                          <th className="py-3 px-4 text-center">STS</th>
                          <th className="py-3 px-4 text-center">SAS</th>
                          <th className="py-3 px-4 text-center">Akhir</th>
                        </>
                      )}`;

file = file.replace(regexTableRender, newTableRender);

const regexTableCellRender = /\{isWalas \? \(\s*<>\s*<td className="py-3 px-4 text-center text-emerald-600 font-bold">\{row\.jamaah\}<\/td>\s*<td className="py-3 px-4 text-center text-red-600 font-bold">\{row\.tidak\}<\/td>\s*<td className="py-3 px-4 text-right font-bold text-slate-800 font-mono">\{row\.persentase\}<\/td>\s*<\/>\s*\) : \(\s*<>\s*<td className="py-3 px-4 text-center font-mono">\{row\.uh1\}<\/td>\s*<td className="py-3 px-4 text-center font-mono">\{row\.uh2\}<\/td>\s*<td className="py-3 px-4 text-center font-mono">\{row\.uh3\}<\/td>\s*<td className="py-3 px-4 text-center font-mono">\{row\.uh4\}<\/td>\s*<td className="py-3 px-4 text-center font-mono">\{row\.uh5\}<\/td>\s*<td className="py-3 px-4 text-center font-mono">\{row\.uts\}<\/td>\s*<td className="py-3 px-4 text-center font-mono">\{row\.uas\}<\/td>\s*<td className="py-3 px-4 text-center font-bold font-mono text-emerald-700 bg-emerald-50\/30">\{row\.akhir\}<\/td>\s*<\/>\s*\)/g;

const newTableCellRender = `{isWalas ? (
                          <>
                            <td className="py-3 px-4 text-center text-emerald-600 font-bold">{row.jamaah}</td>
                            <td className="py-3 px-4 text-center text-red-600 font-bold">{row.tidak}</td>
                            <td className="py-3 px-4 text-right font-bold text-slate-800 font-mono">{row.persentase}</td>
                          </>
                        ) : (
                          <>
                            {Array.from({ length: Math.max(1, ...previewRows.map((r: any) => r.uhCount || 0)) }).map((_, i) => (
                              <td key={i} className="py-3 px-4 text-center font-mono">{row[\`uh\${i+1}\`]}</td>
                            ))}
                            <td className="py-3 px-4 text-center font-mono">{row.uts}</td>
                            <td className="py-3 px-4 text-center font-mono">{row.uas}</td>
                            <td className="py-3 px-4 text-center font-bold font-mono text-emerald-700 bg-emerald-50/30">{row.akhir}</td>
                          </>
                        )}`;

file = file.replace(regexTableCellRender, newTableCellRender);

const regexDownloadData = /sheetName = "Leger Nilai";\s*dataToExport = previewRows\.map\(row => \(\{\s*"No": row\.no,\s*"Nama Siswa": row\.nama,\s*"NIS": row\.nis,\s*"UH 1": row\.uh1,\s*"UH 2": row\.uh2,\s*"UH 3": row\.uh3,\s*"UH 4": row\.uh4,\s*"UH 5": row\.uh5,\s*"Nilai STS": row\.uts,\s*"Nilai SAS": row\.uas,\s*"Nilai Akhir": row\.akhir\s*\}\)\);/g;

const newDownloadData = `sheetName = "Leger Nilai";
        const maxUh = Math.max(1, ...previewRows.map((r: any) => r.uhCount || 0));
        dataToExport = previewRows.map(row => {
          const base: any = {
            "No": row.no,
            "Nama Siswa": row.nama,
            "NIS": row.nis
          };
          for (let i = 1; i <= maxUh; i++) {
            base[\`UH \${i}\`] = row[\`uh\${i}\`];
          }
          base["Nilai STS"] = row.uts;
          base["Nilai SAS"] = row.uas;
          base["Nilai Akhir"] = row.akhir;
          return base;
        });`;

file = file.replace(regexDownloadData, newDownloadData);

fs.writeFileSync('src/pages/GuruPages.tsx', file);
