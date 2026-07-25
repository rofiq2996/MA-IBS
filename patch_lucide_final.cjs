const fs = require('fs');
let code = fs.readFileSync('src/pages/KamadPages.tsx', 'utf8');

code = code.replace(
  "Trash2, Edit2 } from 'lucide-react';",
  "Trash2, Edit2, FileSpreadsheet } from 'lucide-react';"
);

fs.writeFileSync('src/pages/KamadPages.tsx', code);
