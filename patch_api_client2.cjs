const fs = require('fs');
let code = fs.readFileSync('src/lib/apiClient.ts', 'utf8');

const targetStr = `const getApiUrl = () => {
  let url = (import.meta as any).env?.VITE_API_URL || '/api';
  if (url && url !== '/api') {
    url = url.trim().replace(/\\/$/, '');
    if (!url.endsWith('/api')) {
      url = \`\${url}/api\`;
    }
  }
  return url;
};
export const API_URL = getApiUrl();`;

const replaceStr = `export const API_URL = '/api';`;

code = code.replace(targetStr, replaceStr);
fs.writeFileSync('src/lib/apiClient.ts', code);
