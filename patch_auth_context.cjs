const fs = require('fs');
const file = 'src/context/AuthContext.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
`            const updatedUser = { ...user, avatar: data.user.avatar, name: data.user.name };`,
`            let parsedRoles = data.user.roles || [data.user.role];
            if (typeof parsedRoles === 'string') {
              try { parsedRoles = JSON.parse(parsedRoles); } catch(e) { parsedRoles = [data.user.role]; }
            }
            const updatedUser = { ...user, ...data.user, roles: parsedRoles };`
);

fs.writeFileSync(file, code);
