const fs = require('fs');
let code = fs.readFileSync('src/pages/AdminReports.tsx', 'utf8');

// Ensure Eye icon is imported
if (!code.includes('Eye')) {
  code = code.replace('Info}', 'Info, Eye, X}');
}

// Ensure XLSX is imported
if (!code.includes('import * as XLSX')) {
  code = code.replace("import React, { useState } from 'react';", "import React, { useState } from 'react';\nimport * as XLSX from 'xlsx';");
}

// Add state for preview modal
code = code.replace(
  "const [successMessage, setSuccessMessage] = useState<string | null>(null);",
  "const [successMessage, setSuccessMessage] = useState<string | null>(null);\n  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);"
);

// Modify handleDownload to use xlsx
const downloadLogicReplacement = `  const handleDownload = (format: string) => {
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
    
    const extension = format === 'PDF' ? '.pdf' : '.xlsx';
    const fileName = reportName + extension;
    
    setTimeout(() => {
      if (format === 'Excel') {
        const wsData = [
          ['Laporan', reportName],
          ['Tanggal Mulai', startDate || '-'],
          ['Tanggal Akhir', endDate || '-'],
          [],
          ['No', 'Keterangan', 'Nilai'],
          [1, 'Data Dummy 1', 'A'],
          [2, 'Data Dummy 2', 'B']
        ];
        const ws = XLSX.utils.aoa_to_sheet(wsData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Laporan");
        XLSX.writeFile(wb, fileName);
      } else {
        // PDF download dummy
        const blob = new Blob([\`Dummy content for \${fileName}\\nGenerated from AI Studio\`], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }

      setDownloadProgress({format: '', active: false});
      setIsPreviewModalOpen(false);
      setSuccessMessage(\`Berhasil mengunduh dokumen "\${fileName}"!\`);
      setTimeout(() => setSuccessMessage(null), 4000);
    }, 1500);
  };`;

// replace handleDownload body
const matchDL = code.match(/const handleDownload = \(format: string\) => \{[\s\S]*?\}, 1500\);\n  \};/);
if (matchDL) {
    code = code.replace(matchDL[0], downloadLogicReplacement);
}

// Replace buttons with Preview button
const buttonsRegex = /<div className="pt-6 border-t border-slate-100 flex gap-2">[\s\S]*?<\/div>/;
const previewBtn = `<div className="pt-6 border-t border-slate-100 flex gap-2">
              <button
                onClick={() => setIsPreviewModalOpen(true)}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <Eye className="w-4 h-4" /> Preview & Cetak Laporan
              </button>
            </div>`;

code = code.replace(buttonsRegex, previewBtn);

// Add modal at the end before closing div of main component
const modalJSX = `
      {isPreviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-4 md:p-6 border-b border-slate-100 shrink-0">
              <h2 className="font-bold text-lg text-slate-800">
                Preview Laporan
              </h2>
              <button onClick={() => setIsPreviewModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50">
              <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-8 min-h-[400px]">
                <div className="text-center border-b border-slate-200 pb-4 mb-6">
                  <h3 className="font-bold text-xl uppercase tracking-wider text-slate-800">
                    {selectedReportType.replace(/_/g, ' ')}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">Semester: {selectedSemester}</p>
                  {(startDate || endDate) && (
                    <p className="text-sm text-slate-500">Periode: {startDate || '-'} s/d {endDate || '-'}</p>
                  )}
                </div>
                
                <div className="space-y-4">
                  <div className="h-8 bg-slate-100 rounded animate-pulse"></div>
                  <div className="h-8 bg-slate-100 rounded animate-pulse"></div>
                  <div className="h-8 bg-slate-100 rounded animate-pulse w-3/4"></div>
                  <div className="mt-8 overflow-hidden rounded border border-slate-200">
                     <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                           <tr>
                              <th className="p-3 font-bold">No</th>
                              <th className="p-3 font-bold">Keterangan</th>
                              <th className="p-3 font-bold">Nilai</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                           <tr>
                              <td className="p-3">1</td>
                              <td className="p-3">Contoh Data Baris 1</td>
                              <td className="p-3">Baik</td>
                           </tr>
                           <tr>
                              <td className="p-3">2</td>
                              <td className="p-3">Contoh Data Baris 2</td>
                              <td className="p-3">Sangat Baik</td>
                           </tr>
                        </tbody>
                     </table>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-white flex gap-3 justify-end shrink-0">
              <button
                onClick={() => setIsPreviewModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-bold transition-colors"
              >
                Tutup
              </button>
              <button
                onClick={() => handleDownload('PDF')}
                disabled={downloadProgress.active}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                <Download className="w-4 h-4" /> 
                {downloadProgress.active && downloadProgress.format === 'PDF' ? 'Proses...' : 'Unduh PDF'}
              </button>
              <button
                onClick={() => handleDownload('Excel')}
                disabled={downloadProgress.active}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                <Download className="w-4 h-4" /> 
                {downloadProgress.active && downloadProgress.format === 'Excel' ? 'Proses...' : 'Unduh Excel (XLSX)'}
              </button>
            </div>
          </div>
        </div>
      )}
`;

code = code.replace("    </div>\n  );\n}", modalJSX + "    </div>\n  );\n}");

fs.writeFileSync('src/pages/AdminReports.tsx', code);
