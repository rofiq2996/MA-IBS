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
    
    if (!code.includes("import { TermSwitcher }")) {
      code = code.replace("import React", "import React from 'react';\nimport { TermSwitcher } from '../components/ui/TermSwitcher';\n//");
      if (!code.includes("import { TermSwitcher }")) {
        code = "import { TermSwitcher } from '../components/ui/TermSwitcher';\n" + code;
      }
    }

    // Replace the title div to include TermSwitcher side by side
    // Look for <h1 className="...">Dashboard ...</h1>
    
    // We can use a regex to find the h1 tag and its container
    // "<div>\n          <h1" -> "<div className=\"flex items-center gap-3\">\n          <h1"
    // Wait, the h1 is inside a div, along with a p.
    // Example:
    /*
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-800">Administrasi Sistem</h1>
          <p className="text-slate-500 mt-1 text-sm">Pusat kendali operasional madrasah.</p>
        </div>
    */
    // Let's modify it to:
    /*
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold tracking-tight text-slate-800">Administrasi Sistem</h1>
            <TermSwitcher />
          </div>
          <p className="text-slate-500 mt-1 text-sm">Pusat kendali operasional madrasah.</p>
        </div>
    */
    
    const h1Regex = /<div>\s*<h1\s+className="([^"]+)">([^<]+)<\/h1>\s*<p\s+className="([^"]+)">([^<]+)<\/p>\s*<\/div>/;
    const match = code.match(h1Regex);
    if (match) {
      const h1Class = match[1];
      const h1Text = match[2];
      const pClass = match[3];
      const pText = match[4];
      
      const newBlock = `<div className="flex flex-col">
          <div className="flex items-center gap-3">
            <h1 className="${h1Class}">${h1Text}</h1>
            <TermSwitcher />
          </div>
          <p className="${pClass}">${pText}</p>
        </div>`;
        
      code = code.replace(match[0], newBlock);
    }
    
    fs.writeFileSync(file, code);
  }
});

