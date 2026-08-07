const fs = require('fs');
let content = fs.readFileSync('src/pages/AdminReports.tsx', 'utf8');
console.log(content.split('\n')[190]);
