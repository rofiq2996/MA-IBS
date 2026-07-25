const fs = require('fs');
let code = fs.readFileSync('src/pages/KamadPages.tsx', 'utf8');

// Add imports
code = code.replace(
  "import { Button } from '../components/ui/Button';",
  "import { Button } from '../components/ui/Button';\nimport { CustomSelect } from '../components/ui/CustomSelect';\nimport { jsPDF } from 'jspdf';\nimport autoTable from 'jspdf-autotable';\nimport * as XLSX from 'xlsx';"
);

fs.writeFileSync('src/pages/KamadPages.tsx', code);
