const fs = require('fs');
let file = fs.readFileSync('src/pages/GuruPages.tsx', 'utf8');

// Fix 1292: setIsModalOpen(true); )} -> setIsModalOpen(true); }}
file = file.replace(/setIsModalOpen\(true\);\s*\)\}/g, 'setIsModalOpen(true); }}');

// Fix 2076: bottom: 0 )}> -> bottom: 0 }}>
file = file.replace(/bottom: 0 \)\}>/g, 'bottom: 0 }}>');

// Fix 2078, 2079: fontSize: 12 )} -> fontSize: 12 }}
file = file.replace(/fontSize: 12 \)\}/g, 'fontSize: 12 }}');

// Fix 2081: rgb(0 0 0 \/ 0.1)' )} -> rgb(0 0 0 / 0.1)' }}
file = file.replace(/rgb\(0 0 0 \/ 0\.1\)' \)\}/g, "rgb(0 0 0 / 0.1)' }}");

// Fix 2083: paddingTop: '20px' )} -> paddingTop: '20px' }}
file = file.replace(/paddingTop: '20px' \)\}/g, "paddingTop: '20px' }}");

// Fix 3083: setLocationError(null); )} -> setLocationError(null); }}
file = file.replace(/setLocationError\(null\);\s*\)\}/g, 'setLocationError(null); }}');

fs.writeFileSync('src/pages/GuruPages.tsx', file);
