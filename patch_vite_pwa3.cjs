const fs = require('fs');
let code = fs.readFileSync('vite.config.ts', 'utf8');

code = code.replace(/devOptions: \{\s*enabled: true\s*\}/, "devOptions: { enabled: true, type: 'classic' }");
fs.writeFileSync('vite.config.ts', code);
