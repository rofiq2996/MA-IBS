const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/pages/KamadPages.tsx');
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/r\.date === dateFilter/g, "(r.date === dateFilter || (r.date && r.date.startsWith(dateFilter)))");

content = content.replace(/r\.date >= startStr/g, "(r.date >= startStr || (r.date && r.date.substring(0,10) >= startStr))");
content = content.replace(/r\.date <= endStr/g, "(r.date <= endStr || (r.date && r.date.substring(0,10) <= endStr))");

fs.writeFileSync(file, content);
