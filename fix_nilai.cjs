const fs = require('fs');
let file = fs.readFileSync('src/pages/GuruPages.tsx', 'utf8');

const regex = /const storageKey = \`grades_\${selectedClass}_\${selectedSubject}\`;[\s\S]*?akhir >= 75 \? "Lulus" : \(akhir > 0 \? "Remedial" : "-"\)[\s\S]*?\};[\s\S]*?\}\);/m;

const newNilai = `      return targetStudents.map((s, idx) => {
        const studentGrades = grades.filter(g => String(g.student_id) === String(s.id) && g.class_name === selectedClass && g.subject_name === selectedSubject);
        
        let uhSum = 0;
        let uhCount = 0;
        let uts = 0;
        let uas = 0;

        studentGrades.forEach(g => {
          if (g.type === 'UH') {
             uhSum += Number(g.score);
             uhCount++;
          } else if (g.type === 'UTS') {
             uts = Number(g.score);
          } else if (g.type === 'UAS') {
             uas = Number(g.score);
          }
        });
        
        const tugas = uhCount > 0 ? Math.round(uhSum / uhCount) : 0;
        
        let akhir = 0;
        if (tugas || uts || uas) {
           akhir = Math.round((tugas * 0.4) + (uts * 0.3) + (uas * 0.3));
        }
        
        const predikat = akhir >= 90 ? 'A' : akhir >= 80 ? 'B' : akhir >= 70 ? 'C' : 'D';
        
        return {
          no: idx + 1,
          nama: s.name,
          nis: s.nis,
          tugas: tugas || '-',
          uts: uts || '-',
          uas: uas || '-',
          akhir: akhir || '-',
          predikat: akhir ? predikat : '-',
          ket: akhir >= 75 ? "Lulus" : (akhir > 0 ? "Remedial" : "-")
        };
      });`;

file = file.replace(regex, newNilai);
fs.writeFileSync('src/pages/GuruPages.tsx', file);
