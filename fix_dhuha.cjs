const fs = require('fs');
let file = fs.readFileSync('src/pages/GuruQuranPages.tsx', 'utf8');

const stateRegex = /const \[selectedClass, setSelectedClass\] = useState\(''\);/g;
file = file.replace(stateRegex, `const [selectedClass, setSelectedClass] = useState('');\n  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);`);

// Fix useEffect today
const effectRegex = /const storageKey = `dhuha_\$\{selectedClass\}`;\s*const existingData = JSON\.parse\(remoteStorage\.getItem\(storageKey\) \|\| '\{\}'\);\s*const today = new Date\(\)\.toISOString\(\)\.split\('T'\)\[0\];/g;
file = file.replace(effectRegex, `const storageKey = \`dhuha_\${selectedClass}\`;
      const existingData = JSON.parse(remoteStorage.getItem(storageKey) || '{}');
      const today = selectedDate;`);

const effectDeps = /\}, \[selectedClass, students\]\);/g;
file = file.replace(effectDeps, `}, [selectedClass, students, selectedDate]);`);

// Fix handleSave today
const saveRegex = /const today = new Date\(\)\.toISOString\(\)\.split\('T'\)\[0\];\s*existingData\[today\] = attendance;/g;
file = file.replace(saveRegex, `const today = selectedDate;
    existingData[today] = attendance;`);

const deleteRegex = /const today = new Date\(\)\.toISOString\(\)\.split\('T'\)\[0\];\s*await apiClient\('\/query\.php', \{/g;
file = file.replace(deleteRegex, `const today = selectedDate;
      await apiClient('/query.php', {`);
      
// Wait, is today declared again? 
// Let's check handleSave exactly.
fs.writeFileSync('src/pages/GuruQuranPages.tsx', file);
