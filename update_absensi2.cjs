const fs = require('fs');
let file = fs.readFileSync('src/pages/GuruPages.tsx', 'utf8');

const oldSave = `    // Save to database
    try {
       await Promise.all(Object.entries(attendance).map(async ([studentId, data]) => {`;

const newSave = `    // Save to database
    try {
       await apiClient('/query.php', {
          method: 'POST',
          body: JSON.stringify({ query: \`DELETE FROM student_attendance WHERE class_name = '\${selectedClass}' AND subject_name = '\${selectedMapel}' AND date = '\${today}'\` })
       });
       await Promise.all(Object.entries(attendance).map(async ([studentId, data]) => {`;

file = file.replace(oldSave, newSave);
fs.writeFileSync('src/pages/GuruPages.tsx', file);
