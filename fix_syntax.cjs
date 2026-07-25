const fs = require('fs');

const files = [
  'src/pages/AdminAcademic.tsx',
  'src/pages/AdminSettings.tsx',
  'src/pages/InputJadwal.tsx'
];

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf8');

  // I previously replaced `if (stored) {` with nothing, which left `try { return JSON.parse(stored); } catch (e) {} }`
  content = content.replace(/try \{ return JSON\.parse\(stored[A-Za-z0-9_]*\); \} catch \(e\) \{\}\s*\}/g, '');
  content = content.replace(/try \{ return JSON\.parse\(stored\); \} catch \(e\) \{\}\s*\}/g, '');
  content = content.replace(/try \{ return JSON\.parse\(saved\); \} catch \(e\) \{\}\s*\}/g, '');
  content = content.replace(/try \{\s*return JSON\.parse\(stored[A-Za-z0-9_]*\);\s*\}\s*catch\s*\(e\)\s*\{\}\s*\}/g, '');

  fs.writeFileSync(file, content);
}
