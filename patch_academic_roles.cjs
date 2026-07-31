const fs = require('fs');
const file = 'src/pages/AdminAcademic.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
`            if (waliKelasId) {
               await apiClient(\`/crud.php?table=users&id=\${waliKelasId}\`, { method: 'PUT', body: JSON.stringify({ role: 'walas', class_name: name }) });
            }`,
`            if (waliKelasId) {
               const wUser = users.find(u => String(u.id) === String(waliKelasId));
               let currentRoles = wUser?.roles || [wUser?.role || 'guru'];
               if (typeof currentRoles === 'string') {
                 try { currentRoles = JSON.parse(currentRoles); } catch(e) { currentRoles = [wUser?.role || 'guru']; }
               }
               if (!currentRoles.includes('walas')) currentRoles.push('walas');
               await apiClient(\`/crud.php?table=users&id=\${waliKelasId}\`, { method: 'PUT', body: JSON.stringify({ role: 'walas', roles: JSON.stringify(currentRoles), class_name: name }) });
            }`
);

fs.writeFileSync(file, code);
