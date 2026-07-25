const fs = require('fs');

// Patch MobileDashboard.tsx
let mobCode = fs.readFileSync('src/pages/MobileDashboard.tsx', 'utf8');
const siswaMenuRegex = /case 'siswa':\s*return \[\s*\{ to: '\/lms-tugas'[\s\S]*?\];/;
const newSiswaMenu = `case 'siswa':
        return [
          { to: '/lms-tugas', icon: ClipboardList, label: 'Materi & Tugas', color: 'text-cyan-600', bg: 'bg-cyan-50', desc: 'Materi ajar & latihan' },
          { to: '/cbt', icon: FileText, label: 'Ujian CBT', color: 'text-fuchsia-600', bg: 'bg-fuchsia-50', desc: 'Masuk ruang ujian' },
          { to: '/siswa-nilai', icon: Edit3, label: 'Nilai & Rapor', color: 'text-amber-600', bg: 'bg-amber-50', desc: 'Laporan raport berkala' },
          { to: '/siswa/hafalan', icon: Book, label: 'Hafalan & Tahfizku', color: 'text-emerald-600', bg: 'bg-emerald-50', desc: 'Progres setoran hafalan' },
        ];`;
mobCode = mobCode.replace(siswaMenuRegex, newSiswaMenu);

const guruQuranMenuRegex = /case 'guru_quran':\s*const quranLinks = \[\s*\{ to: '\/data-siswa'[\s\S]*?\];/;
const newGuruQuranMenu = `case 'guru_quran':
        const quranLinks = [
          { to: '/data-siswa', icon: Users, label: 'Data Siswa', color: 'text-indigo-600', bg: 'bg-indigo-50', desc: 'Kelompok ngaji & biodata' },
          { to: '/guru-quran/hafalan', icon: Book, label: 'Input Hafalan', color: 'text-purple-600', bg: 'bg-purple-50', desc: 'Catat setoran tahfiz' },
          { to: '/guru-quran/dhuha', icon: Heart, label: 'Absensi Dhuha', color: 'text-emerald-600', bg: 'bg-emerald-50', desc: 'Input sholat dhuha siswa' },
          { to: '/guru-quran/laporan', icon: FileBarChart, label: 'Laporan Quran', color: 'text-blue-600', bg: 'bg-blue-50', desc: 'Rekapan dhuha & tahfiz' },
          { to: '/absensi-zuhur', icon: Moon, label: 'Absensi Zuhur', color: 'text-emerald-600', bg: 'bg-emerald-50', desc: 'Monitor sholat berjamaah' },
        ];`;
mobCode = mobCode.replace(guruQuranMenuRegex, newGuruQuranMenu);

const wakaKesiswaanMenuRegex = /case 'wakakesiswaan':\s*return \[\s*\{ to: '\/kesiswaan\/data'[\s\S]*?\];/;
const newWakaKesiswaanMenu = `case 'wakakesiswaan':
        return [
          { to: '/kesiswaan/data', icon: Users, label: 'Data Siswa', color: 'text-indigo-600', bg: 'bg-indigo-50', desc: 'Data induk kesiswaan' },
          { to: '/kesiswaan/prestasi', icon: Target, label: 'Prestasi & Pelanggaran', color: 'text-rose-600', bg: 'bg-rose-50', desc: 'Catatan kedisiplinan' },
          { to: '/kesiswaan/sp', icon: ShieldAlert, label: 'Kelola SP & Poin', color: 'text-red-600', bg: 'bg-red-50', desc: 'Penerbitan Surat Peringatan' },
          { to: '/kesiswaan/ekskul', icon: Activity, label: 'Ekstrakurikuler', color: 'text-emerald-600', bg: 'bg-emerald-50', desc: 'Kelompok bakat minat' },
          { to: '/kamad/ibadah-siswa', icon: Heart, label: 'Ibadah Siswa', color: 'text-rose-600', bg: 'bg-rose-50', desc: 'Peringkat ketaatan sholat' },
          { to: '/absensi-zuhur', icon: Moon, label: 'Absensi Zuhur', color: 'text-emerald-600', bg: 'bg-emerald-50', desc: 'Kehadiran sholat zuhur' },
        ];`;
mobCode = mobCode.replace(wakaKesiswaanMenuRegex, newWakaKesiswaanMenu);

fs.writeFileSync('src/pages/MobileDashboard.tsx', mobCode);

// Patch Sidebar.tsx
let sideCode = fs.readFileSync('src/components/layout/Sidebar.tsx', 'utf8');

const siswaSideRegex = /} else if \(user\?\.role === 'siswa'\) \{\s*return \[\s*\{ to: '\/', icon: Home, label: 'Beranda' \},\s*\{ to: '\/lms-tugas', icon: ClipboardList, label: 'Materi & Tugas' \},\s*\{ to: '\/cbt', icon: FileText, label: 'Ujian CBT' \},\s*\{ to: '\/siswa-nilai', icon: Edit3, label: 'Nilai & Rapor' \},\s*\];/;
const newSiswaSide = `} else if (user?.role === 'siswa') {
      return [
        { to: '/', icon: Home, label: 'Beranda' },
        { to: '/lms-tugas', icon: ClipboardList, label: 'Materi & Tugas' },
        { to: '/cbt', icon: FileText, label: 'Ujian CBT' },
        { to: '/siswa-nilai', icon: Edit3, label: 'Nilai & Rapor' },
        { to: '/siswa/hafalan', icon: Book, label: 'Hafalan & Tahfizku' },
      ];`;
sideCode = sideCode.replace(siswaSideRegex, newSiswaSide);

const quranSideRegex = /const quranLinks = \[\s*\{ to: '\/', icon: Home, label: 'Beranda' \},\s*\{ to: '\/data-siswa', icon: Users, label: 'Data Siswa' \},\s*\{ to: '\/absensi', icon: CheckSquare, label: 'Absensi Mapel' \},\s*\{ to: '\/guru-quran\/dhuha', icon: Heart, label: 'Absensi Dhuha' \},\s*\{ to: '\/guru-quran\/laporan', icon: FileBarChart, label: 'Laporan Dhuha' \},\s*\{ to: '\/absensi-zuhur', icon: Moon, label: 'Absensi Zuhur' \},\s*\];/;
const newQuranSide = `const quranLinks = [
        { to: '/', icon: Home, label: 'Beranda' },
        { to: '/data-siswa', icon: Users, label: 'Data Siswa' },
        { to: '/guru-quran/hafalan', icon: Book, label: 'Input Hafalan' },
        { to: '/absensi', icon: CheckSquare, label: 'Absensi Mapel' },
        { to: '/guru-quran/dhuha', icon: Heart, label: 'Absensi Dhuha' },
        { to: '/guru-quran/laporan', icon: FileBarChart, label: 'Laporan Quran' },
        { to: '/absensi-zuhur', icon: Moon, label: 'Absensi Zuhur' },
      ];`;
sideCode = sideCode.replace(quranSideRegex, newQuranSide);

const kesiswaanSideRegex = /} else if \(user\?\.role === 'wakakesiswaan'\) \{\s*return \[\s*\{ to: '\/', icon: Home, label: 'Beranda' \},[\s\S]*?\{ to: '\/absensi-zuhur', icon: Moon, label: 'Absensi Zuhur' \},\s*\];/;
const newKesiswaanSide = `} else if (user?.role === 'wakakesiswaan') {
      return [
        { to: '/', icon: Home, label: 'Beranda' },
        { to: '/kesiswaan/data', icon: Users, label: 'Data Siswa' },
        { to: '/kesiswaan/prestasi', icon: Target, label: 'Prestasi & Pelanggaran' },
        { to: '/kesiswaan/sp', icon: ShieldAlert, label: 'Kelola SP & Poin' },
        { to: '/kesiswaan/ekskul', icon: Activity, label: 'Ekstrakurikuler' },
        { to: '/kamad/ibadah-siswa', icon: Heart, label: 'Pantau Ibadah Siswa' },
        { to: '/absensi-zuhur', icon: Moon, label: 'Absensi Zuhur' },
      ];`;
sideCode = sideCode.replace(kesiswaSideRegex, newKesiswaanSide);

// ensure ShieldAlert is imported in Sidebar.tsx
if (!sideCode.includes('ShieldAlert')) {
  sideCode = sideCode.replace(/import \{([\s\S]*?)from 'lucide-react';/, "import { ShieldAlert, $1 from 'lucide-react';");
}

fs.writeFileSync('src/components/layout/Sidebar.tsx', sideCode);
