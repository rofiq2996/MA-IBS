const fs = require('fs');
const path = './src/pages/AdminUsers.tsx';
let content = fs.readFileSync(path, 'utf8');

const oldSave = `    let generatedUsername = userUsername.trim();
    if (!editingId) {
      const nameParts = userName.trim().split(' ').filter(Boolean);
      generatedUsername = nameParts[0].toLowerCase();
      const isStaff = userRoles.some(r => r !== 'ortu' && r !== 'siswa');
      if (isStaff) {
        let currentUsername = generatedUsername;
        let counter = 1;
        let finalUsername = currentUsername;
        while (users.some(u => u.username === finalUsername)) {
          finalUsername = \`\${currentUsername}\${counter}\`;
          counter++;
        }
        generatedUsername = finalUsername;
      }
    }`;

const newSave = `    let generatedUsername = userUsername.trim();
    if (!editingId && !generatedUsername) {
      const nameParts = userName.trim().split(' ').filter(Boolean);
      let currentUsername = (nameParts[0] || 'user').toLowerCase().replace(/[^a-z0-9]/g, '');
      let counter = 1;
      let finalUsername = currentUsername;
      while (users.some(u => u.username === finalUsername)) {
        finalUsername = \`\${currentUsername}\${counter}\`;
        counter++;
      }
      generatedUsername = finalUsername;
    }
    
    // Auto-generate password if empty on creation
    let finalPassword = userPassword.trim();
    if (!editingId && !finalPassword) {
      finalPassword = '12345';
    }
    const hashedPassword = finalPassword ? bcrypt.hashSync(finalPassword, 10) : '';`;

content = content.replace(oldSave, newSave);

const oldHash = `    const hashedPassword = userPassword.trim() ? bcrypt.hashSync(userPassword.trim(), 10) : '';`;
content = content.replace(oldHash, ''); // remove the extra one since we added it in newSave

fs.writeFileSync(path, content, 'utf8');
console.log('Done fix_admin_users_save');
