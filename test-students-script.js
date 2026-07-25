const fs = require('fs');
let code = fs.readFileSync('src/pages/AdminStudents.tsx', 'utf8');
console.log("length:", code.length);
