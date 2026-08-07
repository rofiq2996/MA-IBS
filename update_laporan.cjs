const fs = require('fs');

function main() {
    let file = fs.readFileSync('src/pages/GuruPages.tsx', 'utf8');

    // 1. Add fetch for the tables
    file = file.replace(
        `const [teachingAssignments, setTeachingAssignments] = useState<any[]>([]);`,
        `const [teachingAssignments, setTeachingAssignments] = useState<any[]>([]);
  const [studentAttendance, setStudentAttendance] = useState<any[]>([]);
  const [grades, setGrades] = useState<any[]>([]);
  const [jurnals, setJurnals] = useState<any[]>([]);
  const [ibadahSiswa, setIbadahSiswa] = useState<any[]>([]);`
    );

    file = file.replace(
        `apiClient('/crud.php?table=teaching_assignments').then(data => {
      if (Array.isArray(data)) {
        setTeachingAssignments(data);
      }
    }).catch(console.error);`,
        `apiClient('/crud.php?table=teaching_assignments').then(data => {
      if (Array.isArray(data)) {
        setTeachingAssignments(data);
      }
    }).catch(console.error);

    apiClient('/crud.php?table=student_attendance').then(data => {
      if (Array.isArray(data)) setStudentAttendance(data);
    }).catch(console.error);

    apiClient('/crud.php?table=grades').then(data => {
      if (Array.isArray(data)) setGrades(data);
    }).catch(console.error);

    apiClient('/crud.php?table=laporan_harian').then(data => {
      if (Array.isArray(data)) setJurnals(data);
    }).catch(console.error);

    apiClient('/crud.php?table=ibadah_siswa').then(data => {
      if (Array.isArray(data)) setIbadahSiswa(data);
    }).catch(console.error);`
    );

    // 2. Modify getPreviewData for presensi
    let oldPresensi = `    if (reportType === 'presensi') {
      const storageKey = \`attendance_\${selectedClass}_\${selectedSubject}\`;
      const savedData = JSON.parse(remoteStorage.getItem(storageKey) || '{}');
      
      return targetStudents.map((s, idx) => {
        let present = s.attendance?.present || 0;
        let sick = s.attendance?.sick || 0;
        let permission = s.attendance?.permission || 0;
        let absent = s.attendance?.absent || 0;
        let cabut = s.attendance?.cabut || 0;

        // Aggregate local storage data for this student
        Object.values(savedData).forEach((dailyData: any) => {
          const status = dailyData[s.id]?.status;
          if (status === 'Hadir') present++;
          else if (status === 'Sakit') sick++;
          else if (status === 'Izin') permission++;
          else if (status === 'Alpa') absent++;
          else if (status === 'Cabut') cabut++;
        });
        
        const total = present + sick + permission + absent + cabut || 1;
        
        return {
          no: idx + 1,
          nama: s.name,
          nis: s.nis,
          hadir: present,
          sakit: sick,
          izin: permission,
          alpa: absent,
          cabut: cabut,
          persentase: \`\${Math.round((present / total) * 100)}%\`
        };
      });
    }`;

    let newPresensi = `    if (reportType === 'presensi') {
      return targetStudents.map((s, idx) => {
        let present = 0; let sick = 0; let permission = 0; let absent = 0; let cabut = 0;
        
        const studentAtt = studentAttendance.filter(a => String(a.student_id) === String(s.id) && a.class_name === selectedClass && a.subject_name === selectedSubject);
        
        studentAtt.forEach((dailyData: any) => {
          const status = dailyData.status;
          if (status === 'Hadir') present++;
          else if (status === 'Sakit') sick++;
          else if (status === 'Izin') permission++;
          else if (status === 'Alpa') absent++;
          else if (status === 'Cabut') cabut++;
        });
        
        const total = present + sick + permission + absent + cabut || 1;
        
        return {
          no: idx + 1,
          nama: s.name,
          nis: s.nis,
          hadir: present,
          sakit: sick,
          izin: permission,
          alpa: absent,
          cabut: cabut,
          persentase: \`\${Math.round((present / total) * 100)}%\`
        };
      });
    }`;
    file = file.replace(oldPresensi, newPresensi);

    // 3. Modify getPreviewData for nilai
    let oldNilai = `    } else if (reportType === 'nilai') {
      if (isWalas) {
        const storageKey = \`ibadah_\${selectedClass}\`;
        const savedData = JSON.parse(remoteStorage.getItem(storageKey) || '{}');
        
        return targetStudents.map((s, idx) => {
          let jamaah = 0;
          let tidak = 0;
          
          Object.values(savedData).forEach((dailyData: any) => {
            const status = dailyData[s.id]?.status;
            if (status === 'Jamaah') jamaah++;
            else if (status === 'Tidak Jamaah' || status === 'Tidak') tidak++;
          });
          
          const total = jamaah + tidak || 1;
          
          return {
            no: idx + 1,
            nama: s.name,
            nis: s.nis,
            jamaah,
            tidak,
            persentase: \`\${Math.round((jamaah / total) * 100)}%\`
          };
        });
      }
      const storageKey = \`grades_\${selectedClass}_\${selectedSubject}\`;
      const savedData = JSON.parse(remoteStorage.getItem(storageKey) || '{}');

      return targetStudents.map((s, idx) => {
        let uhSum = 0;
        let uhCount = 0;

        for (let i = 1; i <= 5; i++) {
          const val = savedData[s.id]?.[\\\`uh\${i}\\\`];
          if (val) {
            uhSum += Number(val);
            uhCount++;
          }
        }
        
        // Calculate average UH if available, otherwise 0 or pseudo random if we wanted to fallback but we want real data now.
        // Let's use 0 if no data
        const tugas = uhCount > 0 ? Math.round(uhSum / uhCount) : 0;
        const uts = Number(savedData[s.id]?.uts || 0);
        const uas = Number(savedData[s.id]?.uas || 0);
        
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
      });
    }`;

    let newNilai = `    } else if (reportType === 'nilai') {
      return targetStudents.map((s, idx) => {
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
      });
    }`;
    file = file.replace(oldNilai, newNilai);

    // 4. sholat_dhuha and sholat_zuhur
    let oldDhuha = `    } else if (reportType === 'sholat_dhuha') {
      const storageKey = \`dhuha_\${selectedClass}\`;
      const savedData = JSON.parse(remoteStorage.getItem(storageKey) || '{}');
      
      return targetStudents.map((s, idx) => {
        let jamaah = 0;
        let tidak = 0;
        
        Object.values(savedData).forEach((dailyData: any) => {
          const status = dailyData[s.id]?.status;
          if (status === 'Jamaah') jamaah++;
          else if (status === 'Tidak Jamaah' || status === 'Tidak') tidak++;
        });
        
        const total = jamaah + tidak || 1;
        
        return {
          no: idx + 1,
          nama: s.name,
          nis: s.nis,
          jamaah,
          tidak,
          persentase: \`\${Math.round((jamaah / total) * 100)}%\`
        };
      });
    }`;

    let newDhuha = `    } else if (reportType === 'sholat_dhuha' || reportType === 'sholat_zuhur') {
      const type = reportType === 'sholat_dhuha' ? 'Dhuha' : 'Zuhur';
      return targetStudents.map((s, idx) => {
        let jamaah = 0;
        let tidak = 0;
        
        const studentIbadah = ibadahSiswa.filter(i => String(i.student_id) === String(s.id) && i.class_name === selectedClass && i.type === type);
        studentIbadah.forEach(i => {
           if (i.status === 'Hadir' || i.status === 'Jamaah') jamaah++;
           else tidak++;
        });
        
        const total = jamaah + tidak || 1;
        
        return {
          no: idx + 1,
          nama: s.name,
          nis: s.nis,
          jamaah,
          tidak,
          persentase: \`\${Math.round((jamaah / total) * 100)}%\`
        };
      });
    }`;
    file = file.replace(oldDhuha, newDhuha);

    // 5. jurnal
    let oldJurnal = `    } else if (reportType === 'jurnal') {
      const savedJurnals = JSON.parse(remoteStorage.getItem('jurnals') || '[]');
      let filteredJurnals = savedJurnals;

      if (selectedClass) {
        filteredJurnals = filteredJurnals.filter((j: any) => j.kelas === selectedClass);
      }
      if (selectedSubject && selectedSubject !== 'Semua Mata Pelajaran' && selectedSubject !== 'Presensi Wali Kelas') {
        filteredJurnals = filteredJurnals.filter((j: any) => j.mataPelajaran === selectedSubject);
      }
      
      return filteredJurnals.map((j: any, idx: number) => ({
        no: idx + 1,
        tanggal: j.tanggal,
        kelas: j.kelas,
        mataPelajaran: j.mataPelajaran,
        materi: j.materi,
        catatan: j.catatan
      }));`;

    let newJurnal = `    } else if (reportType === 'jurnal') {
      let filteredJurnals = jurnals;

      if (selectedClass) {
        filteredJurnals = filteredJurnals.filter((j: any) => {
           try {
              const act = JSON.parse(j.activity);
              return act.class === selectedClass;
           } catch(e) { return false; }
        });
      }
      if (selectedSubject && selectedSubject !== 'Semua Mata Pelajaran' && selectedSubject !== 'Presensi Wali Kelas') {
        filteredJurnals = filteredJurnals.filter((j: any) => {
           try {
              const act = JSON.parse(j.activity);
              return act.subject === selectedSubject;
           } catch(e) { return false; }
        });
      }
      
      return filteredJurnals.map((j: any, idx: number) => {
        let act = {};
        try { act = JSON.parse(j.activity); } catch(e) {}
        return {
          no: idx + 1,
          tanggal: j.date,
          kelas: act.class || selectedClass,
          mataPelajaran: act.subject || selectedSubject,
          materi: act.materi || act.topic || '-',
          catatan: act.catatan || act.notes || '-'
        };
      });`;
    file = file.replace(oldJurnal, newJurnal);

    fs.writeFileSync('src/pages/GuruPages.tsx', file);
    console.log("Updated Laporan reports");
}

main();
