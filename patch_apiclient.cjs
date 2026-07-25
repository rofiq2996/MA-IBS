const fs = require('fs');
let code = fs.readFileSync('src/lib/apiClient.ts', 'utf8');

code = code.replace(
  'const getApiUrl = () => {',
  `const getApiUrl = () => {
  return '/api';`
);

fs.writeFileSync('src/lib/apiClient.ts', code);
console.log("Patched apiClient.ts");
