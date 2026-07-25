const fs = require('fs');

// Patch Sidebar.tsx
let sideCode = fs.readFileSync('src/components/layout/Sidebar.tsx', 'utf8');

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
sideCode = sideCode.replace(kesiswaanSideRegex, newKesiswaanSide);

// ensure ShieldAlert is imported in Sidebar.tsx
if (!sideCode.includes('ShieldAlert')) {
  sideCode = sideCode.replace(/import \{([\s\S]*?)from 'lucide-react';/, "import { ShieldAlert, $1 from 'lucide-react';");
}

fs.writeFileSync('src/components/layout/Sidebar.tsx', sideCode);
