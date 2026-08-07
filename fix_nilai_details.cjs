const fs = require('fs');
let file = fs.readFileSync('src/pages/GuruPages.tsx', 'utf8');

const regexPreview = /let uhSum = 0;\s*let uhCount = 0;\s*let uts = 0;\s*let uas = 0;\s*studentGrades\.forEach\(g => \{\s*if \(g\.type === 'UH'\) \{\s*uhSum \+= Number\(g\.score\);\s*uhCount\+\+;\s*\} else if \(g\.type === 'UTS'\) \{\s*uts = Number\(g\.score\);\s*\} else if \(g\.type === 'UAS'\) \{\s*uas = Number\(g\.score\);\s*\}\s*\}\);\s*const tugas = uhCount > 0 \? Math\.round\(uhSum \/ uhCount\) : 0;\s*let akhir = 0;\s*if \(tugas \|\| uts \|\| uas\) \{\s*akhir = Math\.round\(\(tugas \* 0\.4\) \+ \(uts \* 0\.3\) \+ \(uas \* 0\.3\)\);\s*\}\s*return \{\s*no: idx \+ 1,\s*nama: s\.name,\s*nis: s\.nis,\s*tugas: tugas \|\| '-',\s*uts: uts \|\| '-',\s*uas: uas \|\| '-',\s*akhir: akhir \|\| '-'\s*\};/g;

const newPreview = `        const uhs = studentGrades.filter(g => g.type === 'UH').map(g => Number(g.score));
        let uts = 0;
        let uas = 0;
        studentGrades.forEach(g => {
          if (g.type === 'UTS') {
             uts = Number(g.score);
          } else if (g.type === 'UAS') {
             uas = Number(g.score);
          }
        });
        
        const tugas = uhs.length > 0 ? Math.round(uhs.reduce((a,b) => a+b, 0) / uhs.length) : 0;
        
        let akhir = 0;
        if (tugas || uts || uas) {
           akhir = Math.round((tugas * 0.4) + (uts * 0.3) + (uas * 0.3));
        }
        
        return {
          no: idx + 1,
          nama: s.name,
          nis: s.nis,
          uh1: uhs[0] || '-',
          uh2: uhs[1] || '-',
          uh3: uhs[2] || '-',
          uh4: uhs[3] || '-',
          uh5: uhs[4] || '-',
          uts: uts || '-',
          uas: uas || '-',
          akhir: akhir || '-'
        };`;

file = file.replace(regexPreview, newPreview);

const regexTableHeader = /<th className="py-3 px-4 text-center">Tugas<\/th>\s*<th className="py-3 px-4 text-center">UTS<\/th>\s*<th className="py-3 px-4 text-center">UAS<\/th>\s*<th className="py-3 px-4 text-center">Akhir<\/th>/g;

const newTableHeader = `<th className="py-3 px-4 text-center">UH 1</th>
                          <th className="py-3 px-4 text-center">UH 2</th>
                          <th className="py-3 px-4 text-center">UH 3</th>
                          <th className="py-3 px-4 text-center">UH 4</th>
                          <th className="py-3 px-4 text-center">UH 5</th>
                          <th className="py-3 px-4 text-center">STS</th>
                          <th className="py-3 px-4 text-center">SAS</th>
                          <th className="py-3 px-4 text-center">Akhir</th>`;

file = file.replace(regexTableHeader, newTableHeader);

const regexTableCells = /<td className="py-3 px-4 text-center font-mono">\{row\.tugas\}<\/td>\s*<td className="py-3 px-4 text-center font-mono">\{row\.uts\}<\/td>\s*<td className="py-3 px-4 text-center font-mono">\{row\.uas\}<\/td>\s*<td className="py-3 px-4 text-center font-bold font-mono text-emerald-700 bg-emerald-50\/30">\{row\.akhir\}<\/td>/g;

const newTableCells = `<td className="py-3 px-4 text-center font-mono">{row.uh1}</td>
                            <td className="py-3 px-4 text-center font-mono">{row.uh2}</td>
                            <td className="py-3 px-4 text-center font-mono">{row.uh3}</td>
                            <td className="py-3 px-4 text-center font-mono">{row.uh4}</td>
                            <td className="py-3 px-4 text-center font-mono">{row.uh5}</td>
                            <td className="py-3 px-4 text-center font-mono">{row.uts}</td>
                            <td className="py-3 px-4 text-center font-mono">{row.uas}</td>
                            <td className="py-3 px-4 text-center font-bold font-mono text-emerald-700 bg-emerald-50/30">{row.akhir}</td>`;

file = file.replace(regexTableCells, newTableCells);

const regexDownload = /"Nilai Tugas \(40%\)": row\.tugas,\s*"Nilai UTS \(30%\)": row\.uts,\s*"Nilai UAS \(30%\)": row\.uas,\s*"Nilai Akhir": row\.akhir/g;

const newDownload = `"UH 1": row.uh1,
          "UH 2": row.uh2,
          "UH 3": row.uh3,
          "UH 4": row.uh4,
          "UH 5": row.uh5,
          "Nilai STS": row.uts,
          "Nilai SAS": row.uas,
          "Nilai Akhir": row.akhir`;

file = file.replace(regexDownload, newDownload);

fs.writeFileSync('src/pages/GuruPages.tsx', file);
