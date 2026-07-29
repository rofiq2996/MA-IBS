const fs = require('fs');
let code = fs.readFileSync('src/pages/GuruPages.tsx', 'utf8');
code = code.replace(
  "        .catch(console.error);\n  }, []);",
  "        .catch(console.error);\n    }\n  }, []);"
);
fs.writeFileSync('src/pages/GuruPages.tsx', code);
