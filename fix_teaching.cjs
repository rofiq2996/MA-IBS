const fs = require('fs');
const file = 'src/pages/AdminTeachingAssignments.tsx';
let content = fs.readFileSync(file, 'utf8');
if (!content.includes('import { dbClient }')) {
  content = content.replace("import { CustomSelect } from '../components/ui/CustomSelect';", "import { CustomSelect } from '../components/ui/CustomSelect';\nimport { dbClient } from '../lib/dbClient';");
  fs.writeFileSync(file, content);
}
