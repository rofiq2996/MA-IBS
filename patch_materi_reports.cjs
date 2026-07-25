const fs = require('fs');
let code = fs.readFileSync('src/pages/KamadPages.tsx', 'utf8');

const materiHooks = `
  const [selectedMateri, setSelectedMateri] = useState<ModulAjarItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<'all' | 'guru_mapel' | 'wali_kelas' | 'guru_quran'>('all');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [materiReportPeriod, setMateriReportPeriod] = useState('Mingguan');
`;

code = code.replace(
  "  const [selectedMateri, setSelectedMateri] = useState<ModulAjarItem | null>(null);\n  const [activeCategory, setActiveCategory] = useState<'all' | 'guru_mapel' | 'wali_kelas' | 'guru_quran'>('all');\n  const [isDropdownOpen, setIsDropdownOpen] = useState(false);\n  const [searchQuery, setSearchQuery] = useState('');",
  materiHooks
);

const materiFunctions = `
  const downloadMateriPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(\`Laporan Pantau Materi Ajar - \${materiReportPeriod}\`, 14, 20);
    doc.setFontSize(10);
    doc.text(\`Dicetak pada: \${new Date().toLocaleDateString('id-ID')}\`, 14, 28);
    
    const tableData = filteredList.map(materi => {
      return [
        materi.title,
        materi.subject,
        materi.teacherName,
        materi.className,
        materi.status
      ];
    });

    autoTable(doc, {
      startY: 35,
      head: [['Judul Materi', 'Mata Pelajaran', 'Guru', 'Kelas', 'Status']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246] }
    });

    doc.save(\`Laporan_Materi_Ajar_\${materiReportPeriod.replace(/ /g, '_')}.pdf\`);
  };

  const downloadMateriExcel = () => {
    const data = filteredList.map(materi => {
      return {
        'Judul Materi': materi.title,
        'Mata Pelajaran': materi.subject,
        'Guru': materi.teacherName,
        'Role': materi.role,
        'Kelas': materi.className,
        'Link Drive': materi.driveUrl,
        'Status': materi.status
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Materi Ajar");
    XLSX.writeFile(workbook, \`Laporan_Materi_Ajar_\${materiReportPeriod.replace(/ /g, '_')}.xlsx\`);
  };

  const totalMateri = materiList.length;
`;

code = code.replace(
  "  const totalMateri = materiList.length;",
  materiFunctions
);

const materiHeaderOld = `<div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-800">Pantau Modul Ajar Harian Guru</h1>
        <p className="text-slate-500 text-xs sm:text-sm font-medium">
          Pantau dan amati kelengkapan dokumen persiapan Modul Ajar harian yang diunggah oleh Guru via Google Drive.
        </p>
      </div>`;

const materiHeaderNew = `<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-800">Pantau Modul Ajar Harian</h1>
          <p className="text-slate-500 text-xs sm:text-sm font-medium">Pantau kelengkapan dokumen persiapan Modul Ajar.</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <select 
            value={materiReportPeriod}
            onChange={(e) => setMateriReportPeriod(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:border-blue-500"
          >
            <option value="Mingguan">Mingguan</option>
            <option value="Bulanan">Bulanan</option>
            <option value="Per Semester">Per Semester</option>
            <option value="Tahunan">Tahunan</option>
          </select>
          <button onClick={downloadMateriPDF} className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-3 py-2 rounded-xl text-sm font-bold transition-colors">
            <FileText className="w-4 h-4" /> PDF
          </button>
          <button onClick={downloadMateriExcel} className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 px-3 py-2 rounded-xl text-sm font-bold transition-colors">
            <FileSpreadsheet className="w-4 h-4" /> Excel
          </button>
        </div>
      </div>`;

code = code.replace(materiHeaderOld, materiHeaderNew);

fs.writeFileSync('src/pages/KamadPages.tsx', code);
