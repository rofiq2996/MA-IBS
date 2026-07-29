const fs = require('fs');
let code = fs.readFileSync('src/pages/GuruPages.tsx', 'utf8');

const regex = /const stored = localStorage\.getItem\('mockAcademicTerms'\);[\s\S]*?setSemester\(activeTerm\.semester\);\n          }\n        \} catch \(e\) \{\}\n      \}\n    \}/;

code = code.replace(regex, `
      apiClient('/crud.php?table=academic_terms')
        .then(data => {
          const selectedTermId = localStorage.getItem('selectedAcademicTermId');
          let activeTerm = null;
          if (selectedTermId) {
            activeTerm = data.find((t: any) => String(t.id) === selectedTermId);
          }
          if (!activeTerm) {
            activeTerm = data.find((t: any) => Boolean(t.is_active));
          }
          if (activeTerm) setSemester(activeTerm.semester);
        })
        .catch(console.error);
`);

fs.writeFileSync('src/pages/GuruPages.tsx', code);
