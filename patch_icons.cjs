const fs = require('fs');

function patchFile(filename) {
  let code = fs.readFileSync(filename, 'utf8');
  
  if (code.includes("LayoutDashboard") && !code.includes("Home,")) {
    code = code.replace(/LayoutDashboard,/, "LayoutDashboard, Home,");
  } else if (!code.includes("Home,") && code.includes("from 'lucide-react'")) {
    code = code.replace(/from 'lucide-react'/, ", Home } from 'lucide-react'");
  }

  code = code.replace(/icon: LayoutDashboard, label: 'Beranda'/g, "icon: Home, label: 'Beranda'");
  
  fs.writeFileSync(filename, code);
  console.log("Patched " + filename);
}

patchFile('src/components/layout/MobileNav.tsx');
patchFile('src/components/layout/Sidebar.tsx');
