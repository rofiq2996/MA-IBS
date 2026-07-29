const fs = require('fs');
console.log(fs.readFileSync('src/pages/DashboardGuru.tsx', 'utf8').substring(0, 1000));
