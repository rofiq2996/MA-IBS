const fs = require('fs');

// Patch Login.tsx
let loginCode = fs.readFileSync('src/pages/Login.tsx', 'utf8');
loginCode = loginCode.replace(
  'className="w-full h-auto object-contain drop-shadow-[0_2px_15px_rgba(255,255,255,0.3)]"',
  'className="w-full h-auto object-contain drop-shadow-[0_0_12px_rgba(255,255,255,0.8)]"'
);
fs.writeFileSync('src/pages/Login.tsx', loginCode);

// Patch Sidebar.tsx
let sidebarCode = fs.readFileSync('src/components/layout/Sidebar.tsx', 'utf8');
sidebarCode = sidebarCode.replace(
  'className="h-10 w-auto object-contain shrink-0 bg-white/10 rounded px-1"',
  'className="h-10 w-auto max-w-[120px] object-contain shrink-0 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"'
);
fs.writeFileSync('src/components/layout/Sidebar.tsx', sidebarCode);

// Patch AppLayout.tsx
let appLayoutCode = fs.readFileSync('src/components/layout/AppLayout.tsx', 'utf8');
appLayoutCode = appLayoutCode.replace(
  'className="h-9 w-auto object-contain shrink-0"',
  'className="h-9 w-auto max-w-[100px] object-contain shrink-0"'
);
fs.writeFileSync('src/components/layout/AppLayout.tsx', appLayoutCode);

console.log("Patched successfully again");
