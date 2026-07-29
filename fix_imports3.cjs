const fs = require('fs');
const files = [
  'src/pages/DashboardAdmin.tsx',
  'src/pages/DashboardGuru.tsx',
  'src/pages/DashboardWalas.tsx',
  'src/pages/DashboardSiswa.tsx',
  'src/pages/DashboardKamad.tsx',
  'src/pages/DashboardWakaKurikulum.tsx',
  'src/pages/DashboardWakaKesiswaan.tsx',
  'src/pages/DashboardOrtu.tsx',
  'src/pages/DashboardBK.tsx',
  'src/pages/DashboardPustaka.tsx',
  'src/pages/DashboardGuruQuran.tsx'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let code = fs.readFileSync(file, 'utf8');
    
    // Check if it's missing the TermSwitcher import but has the component used
    if (code.includes('<TermSwitcher />') && !code.includes('import { TermSwitcher }')) {
      code = "import { TermSwitcher } from '../components/ui/TermSwitcher';\n" + code;
      fs.writeFileSync(file, code);
    }
  }
});
