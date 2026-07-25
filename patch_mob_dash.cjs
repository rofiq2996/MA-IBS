const fs = require('fs');
let code = fs.readFileSync('src/pages/MobileDashboard.tsx', 'utf8');

const ortuMenus = `      case 'ortu':
        return [
          { to: '/anak', icon: Users, label: 'Data Anak', color: 'text-blue-600', bg: 'bg-blue-50', desc: 'Profil akademik anak' },
          { to: '/absensi-anak', icon: CheckSquare, label: 'Kehadiran', color: 'text-emerald-600', bg: 'bg-emerald-50', desc: 'Presensi harian siswa' },
          { to: '/nilai-anak', icon: FileText, label: 'Laporan Nilai', color: 'text-purple-600', bg: 'bg-purple-50', desc: 'Hasil ulangan & raport' },
          { to: '/sikap-anak', icon: Activity, label: 'Sikap & Disiplin', color: 'text-amber-600', bg: 'bg-amber-50', desc: 'Poin & SP dari sekolah' },
          { to: '/pesan', icon: MessageSquare, label: 'Pesan Walas', color: 'text-indigo-600', bg: 'bg-indigo-50', desc: 'Konsultasi guru wali' },
        ];`;

code = code.replace(/      case 'ortu':[\s\S]*?\];/, ortuMenus);
fs.writeFileSync('src/pages/MobileDashboard.tsx', code);
console.log("Patched MobileDashboard.tsx");
