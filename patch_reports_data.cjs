const fs = require('fs');
let code = fs.readFileSync('src/pages/AdminReports.tsx', 'utf8');

if (!code.includes('import jsPDF')) {
  code = code.replace("import * as XLSX from 'xlsx';", "import * as XLSX from 'xlsx';\nimport jsPDF from 'jspdf';\nimport autoTable from 'jspdf-autotable';");
}

const getReportDataFunc = `
  const getReportData = () => {
    let headers: string[] = [];
    let rows: any[][] = [];
    
    // Fallbacks to actual local storage data if mock is empty initially
    let currentStudents = mockStudents;
    let currentUsers = mockUsers;
    if (typeof window !== 'undefined') {
        const storedStudents = localStorage.getItem('mockStudents');
        if (storedStudents) currentStudents = JSON.parse(storedStudents);
        const storedUsers = localStorage.getItem('mockUsers');
        if (storedUsers) currentUsers = JSON.parse(storedUsers);
    }

    switch (selectedReportType) {
      case 'absensi_siswa':
        headers = ['No', 'NIS', 'Nama Siswa', 'Kelas', 'Hadir', 'Izin', 'Sakit', 'Alpa'];
        rows = currentStudents.map((s, i) => [
          i + 1,
          s.nis || '-',
          s.name || '-',
          s.className || '-',
          s.attendance?.present || 0,
          s.attendance?.permission || 0,
          s.attendance?.sick || 0,
          s.attendance?.absent || 0
        ]);
        break;
      case 'kinerja_guru':
        headers = ['No', 'NIP', 'Nama Guru', 'Peran', 'Kelas', 'Kehadiran (%)'];
        rows = currentUsers.filter(u => ['guru', 'walas', 'guru_quran'].includes(u.role)).map((u, i) => [
          i + 1,
          u.nip || '-',
          u.name || '-',
          u.role.toUpperCase().replace('_', ' '),
          u.className || '-',
          Math.floor(Math.random() * 20 + 80) + '%'
        ]);
        break;
      case 'jurnal_guru':
        headers = ['No', 'Nama Guru', 'Status Jurnal', 'Persentase Pengisian'];
        rows = currentUsers.filter(u => ['guru', 'walas'].includes(u.role)).map((u, i) => [
          i + 1,
          u.name || '-',
          'Lengkap',
          '100%'
        ]);
        break;
      case 'sholat_pegawai':
        headers = ['No', 'Nama Pegawai', 'Jabatan', 'Kehadiran Sholat Zuhur'];
        rows = currentUsers.map((u, i) => [
          i + 1,
          u.name || '-',
          u.role.toUpperCase().replace('_', ' '),
          Math.floor(Math.random() * 5 + 20) + ' Kali'
        ]);
        break;
      case 'sholat_siswa':
        headers = ['No', 'NIS', 'Nama Siswa', 'Kelas', 'Zuhur', 'Dhuha'];
        rows = currentStudents.map((s, i) => [
          i + 1,
          s.nis || '-',
          s.name || '-',
          s.className || '-',
          Math.floor(Math.random() * 5 + 20) + ' Kali',
          Math.floor(Math.random() * 5 + 20) + ' Kali'
        ]);
        break;
    }
    
    return { headers, rows };
  };
`;

code = code.replace("  const handleDownload = (format: string) => {", getReportDataFunc + "\n  const handleDownload = (format: string) => {");

const handleDownloadRegex = /const handleDownload = \(format: string\) => \{[\s\S]*?\}, 1500\);\n  \};/;

const newHandleDownload = `const handleDownload = (format: string) => {
    setDownloadProgress({format, active: true});
    setSuccessMessage(null);
    
    let reportName = 'Laporan';
    switch (selectedReportType) {
      case 'absensi_siswa': reportName = 'Laporan_Absensi_Siswa'; break;
      case 'kinerja_guru': reportName = 'Laporan_Kinerja_Guru_Walas'; break;
      case 'jurnal_guru': reportName = 'Jurnal_Harian_Guru'; break;
      case 'sholat_pegawai': reportName = 'Rekap_Sholat_Zuhur_Pegawai'; break;
      case 'sholat_siswa': reportName = 'Laporan_Sholat_Siswa'; break;
    }
    
    const semesterSlug = selectedSemester.replace('/', '-').replace(' ', '_');
    reportName = \`\${reportName}_\${semesterSlug}\`;
    if (startDate && endDate) {
      reportName += \`_\${startDate}_sampai_\${endDate}\`;
    }
    
    const extension = format === 'PDF' ? '.pdf' : '.xlsx';
    const fileName = reportName + extension;
    const { headers, rows } = getReportData();
    
    setTimeout(() => {
      if (format === 'Excel') {
        const wsData = [
          ['Laporan', reportName.replace(/_/g, ' ')],
          ['Semester', selectedSemester],
          ['Tanggal Mulai', startDate || '-'],
          ['Tanggal Akhir', endDate || '-'],
          [],
          headers,
          ...rows
        ];
        const ws = XLSX.utils.aoa_to_sheet(wsData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Laporan");
        XLSX.writeFile(wb, fileName);
      } else {
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text(reportName.replace(/_/g, ' '), 14, 20);
        doc.setFontSize(11);
        doc.text(\`Semester: \${selectedSemester}\`, 14, 28);
        if (startDate || endDate) {
           doc.text(\`Periode: \${startDate || '-'} s/d \${endDate || '-'}\`, 14, 34);
        }
        
        autoTable(doc, {
          startY: (startDate || endDate) ? 40 : 34,
          head: [headers],
          body: rows,
        });
        
        doc.save(fileName);
      }

      setDownloadProgress({format: '', active: false});
      setIsPreviewModalOpen(false);
      setSuccessMessage(\`Berhasil mengunduh dokumen "\${fileName}"!\`);
      setTimeout(() => setSuccessMessage(null), 4000);
    }, 1500);
  };`;

code = code.replace(handleDownloadRegex, newHandleDownload);

fs.writeFileSync('src/pages/AdminReports.tsx', code);
