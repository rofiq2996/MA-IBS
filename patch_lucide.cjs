const fs = require('fs');
let code = fs.readFileSync('src/pages/KamadPages.tsx', 'utf8');

if (!code.includes('FileSpreadsheet')) {
  code = code.replace(
    "} from 'lucide-react';",
    ", FileSpreadsheet } from 'lucide-react';"
  );
  fs.writeFileSync('src/pages/KamadPages.tsx', code);
}
