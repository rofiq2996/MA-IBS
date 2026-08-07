const fs = require('fs');
let file = fs.readFileSync('src/pages/GuruPages.tsx', 'utf8');

// 1. Fix getPreviewData for nilai
const regexPreview = /const predikat = akhir >= 90 \? 'A' : akhir >= 80 \? 'B' : akhir >= 70 \? 'C' : 'D';\s*return \{\s*no: idx \+ 1,\s*nama: s\.name,\s*nis: s\.nis,\s*tugas: tugas \|\| '-',\s*uts: uts \|\| '-',\s*uas: uas \|\| '-',\s*akhir: akhir \|\| '-',\s*predikat: akhir \? predikat : '-',\s*ket: akhir >= 75 \? "Lulus" : \(akhir > 0 \? "Remedial" : "-"\)\s*\};/g;

const newPreview = `        return {
          no: idx + 1,
          nama: s.name,
          nis: s.nis,
          tugas: tugas || '-',
          uts: uts || '-',
          uas: uas || '-',
          akhir: akhir || '-'
        };`;

file = file.replace(regexPreview, newPreview);

// 2. Fix the table headers and cells
const regexTable = /<th className="py-3 px-4 text-center">Akhir<\/th>\s*<th className="py-3 px-4 text-center">Grade<\/th>\s*<th className="py-3 px-4 text-right">Ket\.<\/th>\s*<\/>\s*\)\}\s*<\/tr>\s*<\/thead>\s*<tbody className="text-xs font-semibold text-slate-700 divide-y divide-slate-100">\s*\{previewRows\.map\(\(row: any\) => \(\s*<tr key=\{row\.no\} className="hover:bg-slate-50\/50">\s*<td className="py-3 px-4 text-slate-400">\{row\.no\}<\/td>\s*<td className="py-3 px-4 font-bold text-slate-800">\{row\.nama\}<\/td>\s*<td className="py-3 px-4 text-slate-500 font-mono">\{row\.nis\}<\/td>\s*\{isWalas \? \(\s*<>\s*<td className="py-3 px-4 text-center text-emerald-600 font-bold">\{row\.jamaah\}<\/td>\s*<td className="py-3 px-4 text-center text-red-600 font-bold">\{row\.tidak\}<\/td>\s*<td className="py-3 px-4 text-right font-bold text-slate-800 font-mono">\{row\.persentase\}<\/td>\s*<\/>\s*\) : \(\s*<>\s*<td className="py-3 px-4 text-center font-mono">\{row\.tugas\}<\/td>\s*<td className="py-3 px-4 text-center font-mono">\{row\.uts\}<\/td>\s*<td className="py-3 px-4 text-center font-mono">\{row\.uas\}<\/td>\s*<td className="py-3 px-4 text-center font-bold font-mono text-emerald-700 bg-emerald-50\/30">\{row\.akhir\}<\/td>\s*<td className="py-3 px-4 text-center font-bold text-slate-800">\{row\.predikat\}<\/td>\s*<td className="py-3 px-4 text-right font-bold text-slate-600">\s*<span className=\{\`px-2 py-0\.5 rounded text-\[10px\] font-bold uppercase \$\{row\.ket === 'Lulus' \? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'\}\`\}>\s*\{row\.ket\}\s*<\/span>\s*<\/td>\s*<\/>/g;

const newTable = `<th className="py-3 px-4 text-center">Akhir</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody className="text-xs font-semibold text-slate-700 divide-y divide-slate-100">
                    {previewRows.map((row: any) => (
                      <tr key={row.no} className="hover:bg-slate-50/50">
                        <td className="py-3 px-4 text-slate-400">{row.no}</td>
                        <td className="py-3 px-4 font-bold text-slate-800">{row.nama}</td>
                        <td className="py-3 px-4 text-slate-500 font-mono">{row.nis}</td>
                        {isWalas ? (
                          <>
                            <td className="py-3 px-4 text-center text-emerald-600 font-bold">{row.jamaah}</td>
                            <td className="py-3 px-4 text-center text-red-600 font-bold">{row.tidak}</td>
                            <td className="py-3 px-4 text-right font-bold text-slate-800 font-mono">{row.persentase}</td>
                          </>
                        ) : (
                          <>
                            <td className="py-3 px-4 text-center font-mono">{row.tugas}</td>
                            <td className="py-3 px-4 text-center font-mono">{row.uts}</td>
                            <td className="py-3 px-4 text-center font-mono">{row.uas}</td>
                            <td className="py-3 px-4 text-center font-bold font-mono text-emerald-700 bg-emerald-50/30">{row.akhir}</td>
                          </>`;

file = file.replace(regexTable, newTable);

// 3. Fix the download data array
const regexDownload = /sheetName = "Leger Nilai";\s*dataToExport = previewRows\.map\(row => \(\{\s*"No": row\.no,\s*"Nama Siswa": row\.nama,\s*"NIS": row\.nis,\s*"Kelas": selectedClass,\s*"Mata Pelajaran": selectedSubject,\s*"Nilai Tugas \(40%\)": row\.tugas,\s*"Nilai UTS \(30%\)": row\.uts,\s*"Nilai UAS \(30%\)": row\.uas,\s*"Nilai Akhir": row\.akhir,\s*"Predikat": row\.predikat,\s*"Keterangan": row\.ket\s*\}\)\);/g;

const newDownload = `sheetName = "Leger Nilai";
        dataToExport = previewRows.map(row => ({
          "No": row.no,
          "Nama Siswa": row.nama,
          "NIS": row.nis,
          "Nilai Tugas (40%)": row.tugas,
          "Nilai UTS (30%)": row.uts,
          "Nilai UAS (30%)": row.uas,
          "Nilai Akhir": row.akhir
        }));`;

file = file.replace(regexDownload, newDownload);

fs.writeFileSync('src/pages/GuruPages.tsx', file);
