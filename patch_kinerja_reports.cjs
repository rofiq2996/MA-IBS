const fs = require('fs');
let code = fs.readFileSync('src/pages/KamadPages.tsx', 'utf8');

const kinerjaHooks = `
  const [selectedStaf, setSelectedStaf] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'guru_mapel' | 'wali_kelas' | 'pelanggaran'>('all');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [reportPeriod, setReportPeriod] = useState('Mingguan');
`;

code = code.replace(
  "  const [selectedStaf, setSelectedStaf] = useState<any>(null);\n  const [activeTab, setActiveTab] = useState<'all' | 'guru_mapel' | 'wali_kelas' | 'pelanggaran'>('all');\n  const [isDropdownOpen, setIsDropdownOpen] = useState(false);",
  kinerjaHooks
);

const kinerjaFunctions = `
  const downloadKinerjaPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(\`Laporan Kinerja Staf - \${reportPeriod}\`, 14, 20);
    doc.setFontSize(10);
    doc.text(\`Dicetak pada: \${new Date().toLocaleDateString('id-ID')}\`, 14, 28);
    
    const tableData = stafList.map(staf => {
      const selesai = staf.tasks.filter(t => t.status === 'selesai').length;
      const total = staf.tasks.length;
      const pelanggaran = staf.tasks.filter(t => t.status === 'terlewat').length;
      return [
        staf.name,
        staf.role,
        staf.kelas || '-',
        \`\${selesai}/\${total} Selesai\`,
        pelanggaran > 0 ? 'Ada Pelanggaran' : 'Baik'
      ];
    });

    autoTable(doc, {
      startY: 35,
      head: [['Nama Staf', 'Role', 'Kelas', 'Penyelesaian', 'Status']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [16, 185, 129] }
    });

    doc.save(\`Laporan_Kinerja_Staf_\${reportPeriod.replace(/ /g, '_')}.pdf\`);
  };

  const downloadKinerjaExcel = () => {
    const data = stafList.map(staf => {
      const selesai = staf.tasks.filter(t => t.status === 'selesai').length;
      const total = staf.tasks.length;
      const pelanggaran = staf.tasks.filter(t => t.status === 'terlewat').length;
      return {
        'Nama Staf': staf.name,
        'Role': staf.role,
        'Kelas': staf.kelas || '-',
        'Penyelesaian': \`\${selesai} dari \${total}\`,
        'Status': pelanggaran > 0 ? 'Ada Pelanggaran' : 'Baik'
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Kinerja Staf");
    XLSX.writeFile(workbook, \`Laporan_Kinerja_Staf_\${reportPeriod.replace(/ /g, '_')}.xlsx\`);
  };

  const pelanggaranCount = stafList.filter(s => s.tasks.some(t => t.status === 'terlewat')).length;
`;

code = code.replace(
  "  const pelanggaranCount = stafList.filter(s => s.tasks.some(t => t.status === 'terlewat')).length;",
  kinerjaFunctions
);

const kinerjaHeaderOld = `<div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-800">Kinerja Staf Real-time</h1>
        <p className="text-slate-500 text-xs sm:text-sm font-medium">Monitoring pengerjaan jobdesk harian Guru & Wali Kelas sesuai SOP Madrasah.</p>
      </div>`;

const kinerjaHeaderNew = `<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-800">Kinerja Staf Real-time</h1>
          <p className="text-slate-500 text-xs sm:text-sm font-medium">Monitoring pengerjaan jobdesk Guru & Wali Kelas.</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <select 
            value={reportPeriod}
            onChange={(e) => setReportPeriod(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:border-emerald-500"
          >
            <option value="Mingguan">Mingguan</option>
            <option value="Bulanan">Bulanan</option>
            <option value="Per Semester">Per Semester</option>
            <option value="Tahunan">Tahunan</option>
          </select>
          <button onClick={downloadKinerjaPDF} className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-3 py-2 rounded-xl text-sm font-bold transition-colors">
            <FileText className="w-4 h-4" /> PDF
          </button>
          <button onClick={downloadKinerjaExcel} className="flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-200 px-3 py-2 rounded-xl text-sm font-bold transition-colors">
            <FileSpreadsheet className="w-4 h-4" /> Excel
          </button>
        </div>
      </div>`;

code = code.replace(kinerjaHeaderOld, kinerjaHeaderNew);

fs.writeFileSync('src/pages/KamadPages.tsx', code);
