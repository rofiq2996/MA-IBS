import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { 
  FileBarChart2, Users, GraduationCap, Calendar, Download, TrendingUp, Award, Clock, ArrowUpRight, BarChart3, PieChart, Info, Eye, X
} from 'lucide-react';
import { mockClasses, mockStudents, mockUsers } from '../data/mock';
import { CustomSelect } from '../components/ui/CustomSelect';

export function AdminReports() {
  const [classes] = useState(mockClasses);

  const [selectedReportType, setSelectedReportType] = useState<string>('absensi_siswa');
  const [selectedSemester, setSelectedSemester] = useState<string>('Ganjil 2026/2027');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [downloadProgress, setDownloadProgress] = useState<{format: string, active: boolean}>({format: '', active: false});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  const semesters = [
    { value: 'Ganjil 2026/2027', label: 'Ganjil 2026/2027 (Aktif)' },
    { value: 'Genap 2025/2026', label: 'Genap 2025/2026' },
    { value: 'Ganjil 2025/2026', label: 'Ganjil 2025/2026' },
    { value: 'Genap 2024/2025', label: 'Genap 2024/2025' },
    { value: 'Ganjil 2024/2025', label: 'Ganjil 2024/2025' }
  ];

    
  const getReportData = () => {
    let headers: string[] = [];
    let rows: any[][] = [];
    
    // Fallbacks to actual local storage data if mock is empty initially
    let currentStudents = mockStudents;
    let currentUsers = mockUsers;
    

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
          (u as any).nip || '-',
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

  const handleDownload = (format: string) => {
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
    reportName = `${reportName}_${semesterSlug}`;
    if (startDate && endDate) {
      reportName += `_${startDate}_sampai_${endDate}`;
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
        doc.text(`Semester: ${selectedSemester}`, 14, 28);
        if (startDate || endDate) {
           doc.text(`Periode: ${startDate || '-'} s/d ${endDate || '-'}`, 14, 34);
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
      setSuccessMessage(`Berhasil mengunduh dokumen "${fileName}"!`);
      setTimeout(() => setSuccessMessage(null), 4000);
    }, 1500);
  };

  // Dynamic calculations
  const totalStudents = mockStudents.length;
  
  // Pesantren terminology: Putra (L) and Putri (P)
  const countPutra = mockStudents.filter(s => s.gender === 'L').length;
  const countPutri = mockStudents.filter(s => s.gender === 'P').length;
  
  const pctPutra = totalStudents > 0 ? Math.round((countPutra / totalStudents) * 100) : 0;
  const pctPutri = totalStudents > 0 ? Math.round((countPutri / totalStudents) * 100) : 0;

  const totalTeachers = mockUsers.filter(u => ['guru', 'guru_quran', 'walas'].includes(u.role)).length;

  const classStats = classes.map(c => {
    const studentsInClass = mockStudents.filter(s => s.className === c.name);
    const count = studentsInClass.length;
    
    // Average attendance for class
    let totalPresent = 0;
    let totalDays = 0;
    
    // Average grade (mocked using behaviorScore for now)
    let totalScore = 0;

    studentsInClass.forEach(s => {
      const att = s.attendance || { present: 0, absent: 0, sick: 0, permission: 0 };
      totalPresent += att.present;
      totalDays += (att.present + att.absent + att.sick + att.permission);
      totalScore += (s.behaviorScore || 0);
    });

    const avgGrade = count > 0 ? +(totalScore / count).toFixed(1) : 0;
    const attendance = totalDays > 0 ? +((totalPresent / totalDays) * 100).toFixed(1) : 0;

    return {
      name: c.name,
      students: count,
      avgGrade,
      attendance
    };
  });

  const overallAvgGrade = classStats.length > 0 && classStats.some(c => c.students > 0)
    ? +(classStats.reduce((acc, curr) => acc + (curr.avgGrade * curr.students), 0) / totalStudents).toFixed(1)
    : 0;

  const overallAttendance = classStats.length > 0 && classStats.some(c => c.students > 0)
    ? +(classStats.reduce((acc, curr) => acc + (curr.attendance * curr.students), 0) / totalStudents).toFixed(1)
    : 0;

  const subjectStats = [
    { name: 'Matematika', score: 78.4, passRate: 85 },
    { name: 'Bahasa Indonesia', score: 86.5, passRate: 98 },
    { name: 'Pendidikan Agama Islam', score: 89.2, passRate: 100 },
    { name: 'Ilmu Hadis / Tafsir', score: 88.5, passRate: 95 },
    { name: 'Bahasa Arab', score: 82.7, passRate: 92 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-800">Laporan & Statistik Madrasah</h1>
          <p className="text-slate-500 mt-1 text-sm">Pusat analisis data perkembangan akademik, kehadiran, dan kinerja guru.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Periode Aktif:</span>
          <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-bold">
            TA 2026/2027 Ganjil
          </span>
        </div>
      </div>

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-sm font-semibold flex items-center gap-2 animate-fade-in">
          <span className="text-emerald-600">✓</span> {successMessage}
        </div>
      )}

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Santri</span>
            {totalStudents > 0 && <span className="text-emerald-500 text-xs font-bold flex items-center gap-0.5"><ArrowUpRight className="w-3.5 h-3.5" /> +4.2%</span>}
          </div>
          <div className="mt-2">
            <p className="text-3xl font-black text-slate-800">{totalStudents}</p>
            <p className="text-[10px] text-slate-400 mt-0.5 font-semibold">Santri terdaftar aktif</p>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Rata-rata Nilai</span>
            {overallAvgGrade > 0 && <span className="text-emerald-500 text-xs font-bold flex items-center gap-0.5"><ArrowUpRight className="w-3.5 h-3.5" /> +1.8%</span>}
          </div>
          <div className="mt-2">
            <p className="text-3xl font-black text-slate-800">{overallAvgGrade > 0 ? overallAvgGrade : '-'}</p>
            <p className="text-[10px] text-slate-400 mt-0.5 font-semibold">Skala Penilaian KKM 75</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Kehadiran (Absensi)</span>
            {overallAttendance > 0 && <span className="text-emerald-500 text-xs font-bold flex items-center gap-0.5"><ArrowUpRight className="w-3.5 h-3.5" /> +0.5%</span>}
          </div>
          <div className="mt-2">
            <p className="text-3xl font-black text-slate-800">{overallAttendance > 0 ? `${overallAttendance}%` : '-'}</p>
            <p className="text-[10px] text-slate-400 mt-0.5 font-semibold">Tingkat kehadiran semester ini</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Asatidz</span>
            <span className="text-slate-400 text-xs font-bold">Tetap</span>
          </div>
          <div className="mt-2">
            <p className="text-3xl font-black text-slate-800">{totalTeachers}</p>
            <p className="text-[10px] text-slate-400 mt-0.5 font-semibold">Tenaga Pendidik</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* INTERACTIVE EXPORT SECTION */}
        <Card className="lg:col-span-1 flex flex-col justify-between">
          <CardHeader>
            <div className="flex items-center gap-2">
              <span className="w-1 h-4 bg-emerald-500 rounded"></span>
              <CardTitle>Ekspor & Cetak Laporan</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-4 flex-1 flex flex-col justify-between">
            <div className="space-y-3">
              <p className="text-xs text-slate-500 leading-relaxed">
                Pilih format dokumen resmi untuk keperluan rapat pengurus, akreditasi, atau laporan tahunan ke yayasan/kemenag.
              </p>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Jenis Laporan</label>
                <CustomSelect
                  value={selectedReportType}
                  onChange={setSelectedReportType}
                  options={[
                    { value: 'absensi_siswa', label: 'Absensi Bulanan Siswa' },
                    { value: 'kinerja_guru', label: 'Kinerja Guru & Walas' },
                    { value: 'jurnal_guru', label: 'Jurnal Harian Guru & Walas' },
                    { value: 'sholat_pegawai', label: 'Kehadiran Sholat Pegawai' },
                    { value: 'sholat_siswa', label: 'Laporan Sholat Siswa' },
                  ]}
                />
              </div>

                            <div className="space-y-1.5">
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
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex gap-2">
              <button
                onClick={() => setIsPreviewModalOpen(true)}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <Eye className="w-4 h-4" /> Preview & Cetak Laporan
              </button>
            </div>
          </CardContent>
        </Card>

        {/* ACADEMIC CHART COMPARISON */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-1 h-4 bg-emerald-500 rounded"></span>
                <CardTitle>Rata-rata Nilai per Jenjang Kelas</CardTitle>
              </div>
              {classStats.length > 0 && (
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-500" /> Standar KKM {'>'} 75
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-4 space-y-5">
            {classStats.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                <Info className="w-10 h-10 mb-3 text-slate-300" />
                <p className="text-sm font-semibold text-slate-600">Rata-rata kelas masih kosong</p>
                <p className="text-xs text-center mt-1">Kelas dan rombel belum diinput oleh Admin.<br/>Silakan tambahkan data kelas terlebih dahulu.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {classStats.map((c, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold text-slate-700">
                      <span className="flex items-center gap-2">
                        <Users className="w-3.5 h-3.5 text-slate-400" /> {c.name} <span className="text-[10px] text-slate-400 font-normal">({c.students} siswa)</span>
                      </span>
                      <span>{c.avgGrade}</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${c.avgGrade >= 75 ? 'bg-emerald-500' : 'bg-amber-500'}`} 
                        style={{ width: `${Math.min(100, Math.max(0, (c.avgGrade / 100) * 100))}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {isPreviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
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
                
                {(() => {
                  const { headers, rows } = getReportData();
                  return (
                    <div className="mt-8 overflow-hidden rounded border border-slate-200">
                       <table className="w-full text-sm text-left">
                          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                             <tr>
                                {headers.map((h, i) => (
                                  <th key={i} className="p-3 font-bold">{h}</th>
                                ))}
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-slate-700">
                             {rows.length === 0 ? (
                               <tr>
                                 <td colSpan={headers.length} className="p-4 text-center text-slate-500">Tidak ada data</td>
                               </tr>
                             ) : rows.map((r, i) => (
                               <tr key={i} className="hover:bg-slate-50">
                                  {r.map((c: any, j: number) => (
                                    <td key={j} className="p-3 border-b border-slate-100">{c}</td>
                                  ))}
                               </tr>
                             ))}
                          </tbody>
                       </table>
                    </div>
                  );
                })()}
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
    </div>
  );
}
