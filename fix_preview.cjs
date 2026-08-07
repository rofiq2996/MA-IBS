const fs = require('fs');
let file = fs.readFileSync('src/pages/GuruPages.tsx', 'utf8');

const regex = /if \(isWalas\) \{\s*const storageKey = \`ibadah_\$\{selectedClass\}\`;\s*const savedData = JSON\.parse\(remoteStorage\.getItem\(storageKey\) \|\| '\{\}'\);\s*return targetStudents\.map\(\(s, idx\) => \{\s*let jamaah = 0;\s*let tidak = 0;\s*Object\.values\(savedData\)\.forEach\(\(dailyData: any\) => \{\s*const status = dailyData\[s\.id\]\?\.status;\s*if \(status === 'Jamaah'\) jamaah\+\+;\s*else if \(status === 'Tidak Jamaah' \|\| status === 'Tidak'\) tidak\+\+;\s*\}\);\s*const total = jamaah \+ tidak \|\| 1;\s*return \{\s*no: idx \+ 1,\s*nama: s\.name,\s*nis: s\.nis,\s*jamaah,\s*tidak,\s*persentase: \`\$\{Math\.round\(\(jamaah \/ total\) \* 100\)\\}%\`\s*\};\s*\}\);\s*\}\s*return targetStudents/g;

file = file.replace(regex, 'return targetStudents');
fs.writeFileSync('src/pages/GuruPages.tsx', file);
