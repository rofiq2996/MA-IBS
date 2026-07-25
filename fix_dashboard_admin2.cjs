const fs = require('fs');
const path = './src/pages/DashboardAdmin.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(/mockStudents/g, 'students');

fs.writeFileSync(path, content, 'utf8');
console.log('DashboardAdmin 2 done');
