const fs = require('fs');
let code = fs.readFileSync('src/components/layout/Sidebar.tsx', 'utf8');

const ortuSidebar = `    } else if (user?.role === 'ortu') {
      return [
        { to: '/', icon: Home, label: 'Beranda' },
        { to: '/anak', icon: Users, label: 'Data Anak' },
        { to: '/absensi-anak', icon: CheckSquare, label: 'Kehadiran' },
        { to: '/nilai-anak', icon: FileText, label: 'Laporan Nilai' },
        { to: '/sikap-anak', icon: Activity, label: 'Sikap & Kedisiplinan' },
        { to: '/pesan', icon: MessageSquare, label: 'Pesan Wali Kelas' },
      ];`;

code = code.replace(/    } else if \(user\?\.role === 'ortu'\) \{[\s\S]*?\];/, ortuSidebar);
fs.writeFileSync('src/components/layout/Sidebar.tsx', code);
console.log("Patched Sidebar.tsx");
