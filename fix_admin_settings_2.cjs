const fs = require('fs');
let content = fs.readFileSync('src/pages/AdminSettings.tsx', 'utf8');

// We just replace that specific block with nothing
content = content.replace(/if \(typeof window !== 'undefined'\) \{\s*\}\s*catch\(e\) \{\}\s*\}\s*\}/g, '}');

// Specifically handle this exact broken string
content = content.replace(/\/\/ Update in localStorage\s*if \(typeof window !== 'undefined'\) \{\s*\}\s*catch\(e\) \{\}\s*\}\s*\}/g, '}');

fs.writeFileSync('src/pages/AdminSettings.tsx', content);
