const fs = require('fs');
let file = fs.readFileSync('src/pages/GuruPages.tsx', 'utf8');

const oldHandleDownload = `    } else if (reportType === 'nilai') {
      if (isWalas) {
        sheetName = "Laporan Sholat Zuhur";
        dataToExport = previewRows.map(row => ({
          "No": row.no,
          "Nama Siswa": row.nama,
          "NIS": row.nis,
          "Kelas": selectedClass,
          "Jamaah": row.jamaah,
          "Tidak Jamaah": row.tidak,
          "Persentase": row.persentase
        }));
      } else {
        sheetName = "Leger Nilai";
        dataToExport = targetStudents.map((s, idx) => {
          const charCodeSum = s.name.split('').reduce((acc, curr) => acc + curr.charCodeAt(0), 0);
          const tugas = (charCodeSum % 20) + 75;
          const uts = ((charCodeSum * 2) % 25) + 70;
          const uas = ((charCodeSum * 3) % 25) + 70;
          const akhir = Math.round((tugas * 0.4) + (uts * 0.3) + (uas * 0.3));
          const predikat = akhir >= 90 ? 'A' : akhir >= 80 ? 'B' : akhir >= 70 ? 'C' : 'D';
          return {
            "No": idx + 1,
            "Nama Siswa": s.name,
            "NIS": s.nis,
            "Kelas": s.className,
            "Mata Pelajaran": selectedSubject,
            "Nilai Tugas (40%)": tugas,
            "Nilai UTS (30%)": uts,
            "Nilai UAS (30%)": uas,
            "Nilai Akhir": akhir,
            "Predikat": predikat,
            "Keterangan": akhir >= 75 ? "Lulus KKM" : "Remedial"
          };
        });
      }
    } else if (reportType === 'sholat_dhuha') {
      sheetName = "Laporan Sholat Dhuha";
      dataToExport = previewRows.map(row => ({
        "No": row.no,
        "Nama Siswa": row.nama,
        "NIS": row.nis,
        "Kelas": selectedClass,
        "Jamaah": row.jamaah,
        "Tidak Jamaah": row.tidak,
        "Persentase": row.persentase
      }));
    } else if (reportType === 'jurnal') {
      sheetName = "Jurnal Mengajar";
      const savedJurnals = JSON.parse(remoteStorage.getItem('jurnals') || '[]');
      let filteredJurnals = savedJurnals;
      if (selectedClass) {
        filteredJurnals = filteredJurnals.filter((j: any) => j.kelas === selectedClass);
      }
      if (selectedSubject && selectedSubject !== 'Semua Mata Pelajaran' && selectedSubject !== 'Presensi Wali Kelas') {
        filteredJurnals = filteredJurnals.filter((j: any) => j.mataPelajaran === selectedSubject);
      }
      dataToExport = filteredJurnals.map((j: any, idx: number) => ({
        "No": idx + 1,
        "Tanggal": j.tanggal,
        "Kelas": j.kelas,
        "Mata Pelajaran": j.mataPelajaran,
        "Materi Pokok": j.materi,
        "Catatan KBM": j.catatan
      }));
    } else {
      sheetName = "Analisis Siswa";
      dataToExport = targetStudents.map((s, idx) => {
        const charCodeSum = s.name.split('').reduce((acc, curr) => acc + curr.charCodeAt(0), 0);
        const awal = (charCodeSum % 10) + 65;
        const akhir = ((charCodeSum * 3) % 15) + 80;
        const peningkat = akhir - awal;
        return {
          "No": idx + 1,
          "Nama Siswa": s.name,
          "NIS": s.nis,
          "Kelas": s.className,
          "Mata Pelajaran": selectedSubject,
          "Nilai Awal (Pre-test)": awal,
          "Nilai Akhir (Post-test)": akhir,
          "Peningkatan": \`+\${peningkat}\`,
          "Status Perkembangan": peningkat > 10 ? "Sangat Baik" : "Baik"
        };
      });
    }`;

const newHandleDownload = `    } else if (reportType === 'nilai') {
      if (isWalas) {
        sheetName = "Laporan Sholat Zuhur";
        dataToExport = previewRows.map(row => ({
          "No": row.no,
          "Nama Siswa": row.nama,
          "NIS": row.nis,
          "Kelas": selectedClass,
          "Jamaah": row.jamaah,
          "Tidak Jamaah": row.tidak,
          "Persentase": row.persentase
        }));
      } else {
        sheetName = "Leger Nilai";
        dataToExport = previewRows.map(row => ({
          "No": row.no,
          "Nama Siswa": row.nama,
          "NIS": row.nis,
          "Kelas": selectedClass,
          "Mata Pelajaran": selectedSubject,
          "Nilai Tugas (40%)": row.tugas,
          "Nilai UTS (30%)": row.uts,
          "Nilai UAS (30%)": row.uas,
          "Nilai Akhir": row.akhir,
          "Predikat": row.predikat,
          "Keterangan": row.ket
        }));
      }
    } else if (reportType === 'sholat_dhuha') {
      sheetName = "Laporan Sholat Dhuha";
      dataToExport = previewRows.map(row => ({
        "No": row.no,
        "Nama Siswa": row.nama,
        "NIS": row.nis,
        "Kelas": selectedClass,
        "Jamaah": row.jamaah,
        "Tidak Jamaah": row.tidak,
        "Persentase": row.persentase
      }));
    } else if (reportType === 'jurnal') {
      sheetName = "Jurnal Mengajar";
      dataToExport = previewRows.map((row: any) => ({
        "No": row.no,
        "Tanggal": row.tanggal,
        "Kelas": row.kelas,
        "Mata Pelajaran": row.mataPelajaran,
        "Materi Pokok": row.materi,
        "Catatan KBM": row.catatan
      }));
    } else {
      sheetName = "Analisis Siswa";
      dataToExport = previewRows.map(row => ({
        "No": row.no,
        "Nama Siswa": row.nama,
        "NIS": row.nis,
        "Kelas": selectedClass,
        "Mata Pelajaran": selectedSubject,
        "Nilai Awal (Pre-test)": row.awal,
        "Nilai Akhir (Post-test)": row.akhir,
        "Peningkatan": row.peningkatan,
        "Status Perkembangan": row.status
      }));
    }`;

file = file.replace(oldHandleDownload, newHandleDownload);
fs.writeFileSync('src/pages/GuruPages.tsx', file);
