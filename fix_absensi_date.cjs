const fs = require('fs');
let file = fs.readFileSync('src/pages/GuruPages.tsx', 'utf8');

const regex = /const \[selectedMapel, setSelectedMapel\] = useState\(''\);\s*useEffect\(\(\) => \{\s*if \(selectedClass && selectedMapel\) \{\s*const storageKey = `attendance_\$\{selectedClass\}_\$\{selectedMapel\}`;\s*const existingData = JSON\.parse\(remoteStorage\.getItem\(storageKey\) \|\| '\{\}'\);\s*const today = new Date\(\)\.toISOString\(\)\.split\('T'\)\[0\];/g;

const replacement = `const [selectedMapel, setSelectedMapel] = useState('');
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (selectedClass && selectedMapel) {
      const storageKey = \`attendance_\${selectedClass}_\${selectedMapel}\`;
      const existingData = JSON.parse(remoteStorage.getItem(storageKey) || '{}');
      const today = selectedDate;`;

file = file.replace(regex, replacement);

const depRegex = /\}, \[selectedClass, selectedMapel, studentsList\]\);/g;
file = file.replace(depRegex, '}, [selectedClass, selectedMapel, studentsList, selectedDate]);');

fs.writeFileSync('src/pages/GuruPages.tsx', file);
