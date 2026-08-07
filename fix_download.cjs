const fs = require('fs');
let file = fs.readFileSync('src/pages/GuruPages.tsx', 'utf8');

const regex = /\} else if \(reportType === 'nilai'\) \{\s*if \(isWalas\) \{\s*sheetName = "Laporan Sholat Zuhur";\s*dataToExport = previewRows\.map\(row => \(\{\s*"No": row\.no,\s*"Nama Siswa": row\.nama,\s*"NIS": row\.nis,\s*"Kelas": selectedClass,\s*"Jamaah": row\.jamaah,\s*"Tidak Jamaah": row\.tidak,\s*"Persentase": row\.persentase\s*\}\)\);\s*\} else \{\s*sheetName = "Leger Nilai";\s*dataToExport = previewRows\.map\(row => \(\{\s*"No": row\.no,\s*"Nama Siswa": row\.nama,\s*"NIS": row\.nis,\s*"Kelas": selectedClass,\s*"Mata Pelajaran": selectedSubject,\s*"Nilai Tugas \(40%\)": row\.tugas,\s*"Nilai UTS \(30%\)": row\.uts,\s*"Nilai UAS \(30%\)": row\.uas,\s*"Nilai Akhir": row\.akhir,\s*"Predikat": row\.predikat,\s*"Keterangan": row\.ket\s*\}\)\);\s*\}\s*\}/g;

const newLogic = `    } else if (reportType === 'nilai') {
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
    }`;

file = file.replace(regex, newLogic);
fs.writeFileSync('src/pages/GuruPages.tsx', file);
