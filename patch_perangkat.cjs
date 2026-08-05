const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/pages/GuruPages.tsx');
let content = fs.readFileSync(file, 'utf8');

const regex = /const \[modulList, setModulList\] = useState<ModulAjarItem\[\]>\(\[\]\);\s*const \[loading, setLoading\] = useState\(true\);/;
const replacement = `const [modulList, setModulList] = useState<ModulAjarItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [teachingAssignments, setTeachingAssignments] = useState<any[]>([]);`;

if (content.match(regex)) {
    content = content.replace(regex, replacement);
    fs.writeFileSync(file, content);
    console.log('Replaced states');
} else {
    console.log('Regex did not match');
}
