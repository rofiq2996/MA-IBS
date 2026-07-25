const fs = require('fs');
let code = fs.readFileSync('src/components/layout/MobileNav.tsx', 'utf8');

code = code.replace(
  "    { to: '/notifications', icon: Bell, label: 'Notifikasi' },\n",
  ""
);

fs.writeFileSync('src/components/layout/MobileNav.tsx', code);
console.log("Patched MobileNav.tsx");
