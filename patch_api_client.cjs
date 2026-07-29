const fs = require('fs');
let code = fs.readFileSync('src/lib/apiClient.ts', 'utf8');

if (!code.includes("console.log('Fetching API:', url);")) {
  code = code.replace("const url = endpoint === '/sync' ? `/api/sync.php` : `${API_URL}${endpoint}`;", "const url = endpoint === '/sync' ? `/api/sync.php` : `${API_URL}${endpoint}`;\n  console.log('Fetching API:', url);");
  fs.writeFileSync('src/lib/apiClient.ts', code);
}
