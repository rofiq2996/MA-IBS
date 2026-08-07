const fs = require('fs');
let file = fs.readFileSync('src/pages/GuruPages.tsx', 'utf8');

file = file.replace(/Akhir<\/th>\s*<\/>\s*\}\}/g, 'Akhir</th>\n                        </>\n                      )}');
file = file.replace(/\{row\.akhir\}<\/td>\s*<\/>\s*\}\}/g, '{row.akhir}</td>\n                          </>\n                        )}');

fs.writeFileSync('src/pages/GuruPages.tsx', file);
