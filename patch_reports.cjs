const fs = require('fs');
let code = fs.readFileSync('src/pages/AdminReports.tsx', 'utf8');

// Add state for dates
code = code.replace(
  "const [selectedSemester, setSelectedSemester] = useState<string>('Ganjil 2026/2027');",
  "const [selectedSemester, setSelectedSemester] = useState<string>('Ganjil 2026/2027');\n  const [startDate, setStartDate] = useState<string>('');\n  const [endDate, setEndDate] = useState<string>('');"
);

// Add dates to filename
code = code.replace(
  "reportName = `${reportName}_${semesterSlug}`;",
  "reportName = `${reportName}_${semesterSlug}`;\n    if (startDate && endDate) {\n      reportName += `_${startDate}_sampai_${endDate}`;\n    }"
);

// Add date inputs to UI
const inputsReplacement = `              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tahun Ajaran / Semester</label>
                <CustomSelect
                  value={selectedSemester}
                  onChange={setSelectedSemester}
                  options={semesters}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Dari Tanggal</label>
                  <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full text-xs font-bold text-slate-700 px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-emerald-500" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Sampai Tanggal</label>
                  <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full text-xs font-bold text-slate-700 px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-emerald-500" />
                </div>
              </div>`;

code = code.replace(
  /<div className="space-y-1.5">\s*<label className="text-\[10px\] font-bold text-slate-500 uppercase tracking-wider">Tahun Ajaran \/ Semester<\/label>\s*<CustomSelect\s*value=\{selectedSemester\}\s*onChange=\{setSelectedSemester\}\s*options=\{semesters\}\s*\/>\s*<\/div>/g,
  inputsReplacement
);

// Download simulated functionality
// In handleDownload, it just sets the successMessage. The user said "belum bisa didownload". 
// To make it actually download, we can generate a simple csv or pdf mock file and trigger download via a link.

const handleDownloadReplacement = `  const handleDownload = (format: string) => {
    setDownloadProgress({format, active: true});
    setSuccessMessage(null);
    
    // Determine report name
    let reportName = 'Laporan';
    switch (selectedReportType) {
      case 'absensi_siswa': reportName = 'Laporan_Absensi_Siswa'; break;
      case 'kinerja_guru': reportName = 'Laporan_Kinerja_Guru_Walas'; break;
      case 'jurnal_guru': reportName = 'Jurnal_Harian_Guru'; break;
      case 'sholat_pegawai': reportName = 'Rekap_Sholat_Zuhur_Pegawai'; break;
      case 'sholat_siswa': reportName = 'Laporan_Sholat_Siswa'; break;
    }
    
    // Append semester to filename
    const semesterSlug = selectedSemester.replace('/', '-').replace(' ', '_');
    reportName = \`\${reportName}_\${semesterSlug}\`;
    if (startDate && endDate) {
      reportName += \`_\${startDate}_sampai_\${endDate}\`;
    }
    
    const extension = format === 'PDF' ? '.pdf' : '.csv';
    const fileName = reportName + extension;
    
    setTimeout(() => {
      // Create a dummy download link
      const blob = new Blob([\`Dummy content for \${fileName}\\nGenerated from AI Studio\`], { type: format === 'PDF' ? 'application/pdf' : 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setDownloadProgress({format: '', active: false});
      setSuccessMessage(\`Berhasil mengunduh dokumen "\${fileName}"!\`);
      setTimeout(() => setSuccessMessage(null), 4000);
    }, 1500);
  };`;

// replace handleDownload body
const match = code.match(/const handleDownload = \(format: string\) => \{[\s\S]*?\}, 1500\);\n  \};/);
if (match) {
    code = code.replace(match[0], handleDownloadReplacement);
}

fs.writeFileSync('src/pages/AdminReports.tsx', code);
