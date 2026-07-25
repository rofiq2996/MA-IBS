const fs = require('fs');

// Patch Login.tsx
let loginCode = fs.readFileSync('src/pages/Login.tsx', 'utf8');
loginCode = loginCode.replace(
  '<div className="w-20 h-20 md:w-32 md:h-32 mb-3 md:mb-6">',
  '<div className="w-48 md:w-64 lg:w-72 mb-4 md:mb-6">'
);
loginCode = loginCode.replace(
  'className="w-full h-full object-contain drop-shadow-md"',
  'className="w-full h-auto object-contain drop-shadow-[0_2px_15px_rgba(255,255,255,0.3)]"'
);
fs.writeFileSync('src/pages/Login.tsx', loginCode);

// Patch Sidebar.tsx
let sidebarCode = fs.readFileSync('src/components/layout/Sidebar.tsx', 'utf8');
sidebarCode = sidebarCode.replace(
  'className="w-10 h-10 object-contain shrink-0"',
  'className="h-10 w-auto object-contain shrink-0 bg-white/10 rounded px-1"' // Added slight light bg for visibility if it's on dark bg
);
// Actually wait, let me just change the size first. The sidebar bg is `#126442`, dark green. The logo has black text.
fs.writeFileSync('src/components/layout/Sidebar.tsx', sidebarCode);

// Patch AppLayout.tsx
let appLayoutCode = fs.readFileSync('src/components/layout/AppLayout.tsx', 'utf8');
appLayoutCode = appLayoutCode.replace(
  'className="w-9 h-9 object-contain shrink-0"',
  'className="h-9 w-auto object-contain shrink-0"'
);
fs.writeFileSync('src/components/layout/AppLayout.tsx', appLayoutCode);

console.log("Patched successfully");
