const fs = require('fs');
let code = fs.readFileSync('src/pages/KamadPages.tsx', 'utf8');

// Add Kinerja state
code = code.replace(
  "const [reportPeriod, setReportPeriod] = useState('Mingguan');",
  "const [reportPeriod, setReportPeriod] = useState('Mingguan');\n  const [kinerjaStartDate, setKinerjaStartDate] = useState('');\n  const [kinerjaEndDate, setKinerjaEndDate] = useState('');"
);

// Add Materi state
code = code.replace(
  "const [materiReportPeriod, setMateriReportPeriod] = useState('Mingguan');",
  "const [materiReportPeriod, setMateriReportPeriod] = useState('Mingguan');\n  const [materiStartDate, setMateriStartDate] = useState('');\n  const [materiEndDate, setMateriEndDate] = useState('');"
);

// Replace PDF title for Kinerja
code = code.replace(
  "doc.text(\`Laporan Kinerja Staf - \${reportPeriod}\`, 14, 20);",
  "doc.text(\`Laporan Kinerja Staf - \${reportPeriod === 'Mingguan' && kinerjaStartDate && kinerjaEndDate ? \`Mingguan (\${kinerjaStartDate} s/d \${kinerjaEndDate})\` : reportPeriod}\`, 14, 20);"
);

// Replace PDF title for Materi
code = code.replace(
  "doc.text(\`Laporan Pantau Materi Ajar - \${materiReportPeriod}\`, 14, 20);",
  "doc.text(\`Laporan Pantau Materi Ajar - \${materiReportPeriod === 'Mingguan' && materiStartDate && materiEndDate ? \`Mingguan (\${materiStartDate} s/d \${materiEndDate})\` : materiReportPeriod}\`, 14, 20);"
);

// Add UI for Kinerja
code = code.replace(
  /<select\s+value=\{reportPeriod\}/g,
  `{reportPeriod === 'Mingguan' && (
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-2 py-1.5 shadow-sm">
              <input type="date" value={kinerjaStartDate} onChange={e => setKinerjaStartDate(e.target.value)} className="text-xs sm:text-sm font-bold text-slate-700 outline-none bg-transparent w-[110px] sm:w-auto" />
              <span className="text-slate-400 font-bold text-xs">-</span>
              <input type="date" value={kinerjaEndDate} onChange={e => setKinerjaEndDate(e.target.value)} className="text-xs sm:text-sm font-bold text-slate-700 outline-none bg-transparent w-[110px] sm:w-auto" />
            </div>
          )}
          <select 
            value={reportPeriod}`
);

// Add UI for Materi
code = code.replace(
  /<select\s+value=\{materiReportPeriod\}/g,
  `{materiReportPeriod === 'Mingguan' && (
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-2 py-1.5 shadow-sm">
              <input type="date" value={materiStartDate} onChange={e => setMateriStartDate(e.target.value)} className="text-xs sm:text-sm font-bold text-slate-700 outline-none bg-transparent w-[110px] sm:w-auto" />
              <span className="text-slate-400 font-bold text-xs">-</span>
              <input type="date" value={materiEndDate} onChange={e => setMateriEndDate(e.target.value)} className="text-xs sm:text-sm font-bold text-slate-700 outline-none bg-transparent w-[110px] sm:w-auto" />
            </div>
          )}
          <select 
            value={materiReportPeriod}`
);

fs.writeFileSync('src/pages/KamadPages.tsx', code);
