const fs = require('fs');
let code = fs.readFileSync('src/components/layout/AppLayout.tsx', 'utf8');

if (!code.includes('apiClient')) {
  code = code.replace(
    "import { LogOut } from 'lucide-react';",
    "import { LogOut } from 'lucide-react';\nimport { apiClient } from '../../lib/apiClient';"
  );
  fs.writeFileSync('src/components/layout/AppLayout.tsx', code);
}
