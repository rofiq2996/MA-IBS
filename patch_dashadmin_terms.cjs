const fs = require('fs');
let code = fs.readFileSync('src/pages/DashboardAdmin.tsx', 'utf8');

const regex = /const stored = localStorage\.getItem\('mockAcademicTerms'\);[\s\S]*?setActiveTermSemester\(terms\[0\]\.semester \|\| '-'\);\n        \}\n      \} catch \(e\) \{\}\n    \}/;

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
        if (activeTerm) {
          setActiveTermName(activeTerm.year || '-');
          setActiveTermSemester(activeTerm.semester || '-');
        } else if (data.length > 0) {
          setActiveTermName(data[0].year || '-');
          setActiveTermSemester(data[0].semester || '-');
        }
      })
      .catch(console.error);
`);

fs.writeFileSync('src/pages/DashboardAdmin.tsx', code);
