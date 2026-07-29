const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');
code = code.replace(
  "import bcrypt from 'bcryptjs';",
  "import bcrypt from 'bcryptjs';\nimport { createProxyMiddleware } from 'http-proxy-middleware';"
);
const proxySetup = `
  // PROXY to mmmaibs.com in development to bypass CORS
  if (process.env.USE_REMOTE_API === 'true' || true) {
    app.use('/api', createProxyMiddleware({
      target: 'https://mmmaibs.com',
      changeOrigin: true,
      secure: false,
    }));
  } else {
`;
code = code.replace(
  "  app.get('/api/crud/:table', async (req, res) => {",
  proxySetup + "\n  app.get('/api/crud/:table', async (req, res) => {"
);
// We need to close the else block before Vite middleware
code = code.replace(
  "  if (process.env.NODE_ENV !== \"production\") {",
  "  }\n  if (process.env.NODE_ENV !== \"production\") {"
);
fs.writeFileSync('server.ts.new', code);
