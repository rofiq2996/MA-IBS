const fs = require('fs');
const linesToFix = [1014, 1021, 1062, 1084, 1837, 1920, 1935, 2752, 2774, 2798, 2805, 2832, 2855, 2888];
let file = fs.readFileSync('src/pages/GuruPages.tsx', 'utf8');
let lines = file.split('\n');

for (let i of linesToFix) {
  let idx = i - 1;
  lines[idx] = lines[idx].replace(/\)\}/g, '))}');
}

// Line 752 has '}' expected. Let's see what is there.
// I will output line 752 first to see.

fs.writeFileSync('src/pages/GuruPages.tsx', lines.join('\n'));
