const fs = require('fs');
['src/pages/DashboardAdmin.tsx', 'src/pages/DashboardWalas.tsx', 'src/pages/DashboardOrtu.tsx'].forEach(file => {
  let code = fs.readFileSync(file, 'utf8');
  code = code.replace("import React from 'react';\\nimport { TermSwitcher } from '../components/ui/TermSwitcher';\\n//,", "import React,");
  fs.writeFileSync(file, code);
});
