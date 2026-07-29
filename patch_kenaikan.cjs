const fs = require('fs');
let code = fs.readFileSync('src/pages/AdminKenaikanKelas.tsx', 'utf8');

if (!code.includes('apiClient')) {
  code = code.replace(
    "import React,",
    "import { apiClient } from '../lib/apiClient';\nimport React,"
  );
}

const regex = /const handleKenaikan = \(\) => \{/g;
code = code.replace(regex, "const handleKenaikan = async () => {");

const termRegex = /const storedTerms = JSON\.parse\(localStorage\.getItem\('mockAcademicTerms'\) \|\| '\[\]'\);\n      const selectedTermId = localStorage\.getItem\('selectedAcademicTermId'\);\n      let activeTerm = selectedTermId \? storedTerms\.find\(\(t: any\) => t\.id === selectedTermId\) : null;\n      if \(!activeTerm\) activeTerm = storedTerms\.find\(\(t: any\) => t\.isActive\);\n      const academicYear = activeTerm \? `\$\{activeTerm\.year\} \(\$\{activeTerm\.semester\}\)` : '2026\/2027';/;

code = code.replace(termRegex, `
      let academicYear = '2026/2027';
      try {
        const termsData = await apiClient('/crud.php?table=academic_terms');
        const selectedTermId = localStorage.getItem('selectedAcademicTermId');
        let activeTerm = null;
        if (selectedTermId) activeTerm = termsData.find((t: any) => String(t.id) === selectedTermId);
        if (!activeTerm) activeTerm = termsData.find((t: any) => Boolean(t.is_active));
        if (activeTerm) academicYear = \`\${activeTerm.year} (\${activeTerm.semester})\`;
      } catch (e) {
        console.error("Failed to load academic terms", e);
      }
`);

fs.writeFileSync('src/pages/AdminKenaikanKelas.tsx', code);
