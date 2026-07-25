const fs = require('fs');
const path = './src/pages/AdminUsers.tsx';
let content = fs.readFileSync(path, 'utf8');

// Update fetchUsers to parse roles
content = content.replace(
  "roles: [u.role],",
  "roles: (typeof u.roles === 'string' ? JSON.parse(u.roles) : u.roles) || [u.role],"
);

// Update payload in handleSave
const oldPayload = `    const payload: any = {
        name: userName.trim(),
        username: generatedUsername,
        role: userRoles[0],
        gender: userGender || null,
        class_name: userRoles.includes('walas') ? userClassName : null,
        child_id: userRoles.includes('ortu') ? userChildId : null,
        avatar: \`https://api.dicebear.com/7.x/avataaars/svg?seed=\${encodeURIComponent(userName)}\`,
    };`;
const newPayload = `    const payload: any = {
        name: userName.trim(),
        username: generatedUsername,
        role: userRoles[0], // fallback
        roles: JSON.stringify(userRoles), // store array
        gender: userGender || null,
        class_name: userRoles.includes('walas') ? userClassName : null,
        child_id: userRoles.includes('ortu') ? userChildId : null,
        avatar: \`https://api.dicebear.com/7.x/avataaars/svg?seed=\${encodeURIComponent(userName)}\`,
    };`;
content = content.replace(oldPayload, newPayload);

// Update excel import payload
const oldExcelPayload = `             const payload = {
                name: u.name,
                username: u.username,
                password: u.password, // already hashed by bcrypt in this script
                role: u.role,
                gender: u.gender || null,
                class_name: u.className || null,
                child_id: u.childId || null,
                avatar: u.avatar || \`https://api.dicebear.com/7.x/avataaars/svg?seed=\${encodeURIComponent(u.name)}\`,
             };`;
const newExcelPayload = `             const payload = {
                name: u.name,
                username: u.username,
                password: u.password,
                role: u.role,
                roles: JSON.stringify(u.roles || [u.role]),
                gender: u.gender || null,
                class_name: u.className || null,
                child_id: u.childId || null,
                avatar: u.avatar || \`https://api.dicebear.com/7.x/avataaars/svg?seed=\${encodeURIComponent(u.name)}\`,
             };`;
content = content.replace(oldExcelPayload, newExcelPayload);


// Update excel newUsers push to include roles
const oldPush = `          newUsers.push({
            id: \`new-\${Date.now()}-\${index}\`,
            name: rawName,
            username: rawUsername,
            password: hashedPassword,
            role: matchedRole,
            gender: gender,
            className: className,
            roles: uniqueRoles,
          });`;
content = content.replace(oldPush, oldPush); // just checking, it already has roles: uniqueRoles

// Update the list mapping when viewing users
// The table renders roles?
// Let's check where it renders roles
fs.writeFileSync(path, content, 'utf8');
console.log('AdminUsers roles done');
