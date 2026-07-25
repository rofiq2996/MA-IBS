const fs = require('fs');
let code = fs.readFileSync('src/pages/Login.tsx', 'utf8');

code = code.replace(
  'return (\n    <div className="h-[100dvh]',
  'return (\n    <>\n    <div className="h-[100dvh]'
);

code = code.replace(
  '    </div>\n  );\n}',
  '    </>\n  );\n}'
);

fs.writeFileSync('src/pages/Login.tsx', code);
console.log("Fixed successfully");
