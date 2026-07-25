const fs = require('fs');
let code = fs.readFileSync('src/components/layout/Sidebar.tsx', 'utf8');

// We will add { to: '/notifications', icon: Bell, label: 'Notifikasi' } to the end of every array returned in getLinks
// A simple way is to push it to the array before returning if it's not there, but since there are many return statements,
// we can just intercept the return value of getLinks.

code = code.replace(
  "const links = getLinks();",
  `const links = getLinks();
  // Ensure Notifikasi is in the links for all roles
  if (!links.find(link => link.to === '/notifications')) {
    links.push({ to: '/notifications', icon: Bell, label: 'Notifikasi' });
  }`
);

fs.writeFileSync('src/components/layout/Sidebar.tsx', code);
console.log("Patched successfully");
