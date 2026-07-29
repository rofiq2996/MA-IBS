const fs = require('fs');
let code = fs.readFileSync('src/pages/MobileDashboard.tsx', 'utf8');

const regex = /let parsedTerms = \[\];\n    const stored = localStorage\.getItem\('mockAcademicTerms'\);[\s\S]*?setSelectedTermId\(parsedTerms\[0\]\.id\);\n      \}\n    \}/;

code = code.replace(regex, `
    apiClient('/crud.php?table=academic_terms')
      .then(data => {
        const parsedTerms = data.map((t: any) => ({
          id: String(t.id),
          year: t.year,
          semester: t.semester,
          isActive: Boolean(t.is_active)
        }));
        setTerms(parsedTerms);
        
        const savedId = localStorage.getItem('selectedAcademicTermId');
        if (savedId && parsedTerms.find((t: any) => t.id === savedId)) {
          setSelectedTermId(savedId);
        } else {
          const active = parsedTerms.find((t: any) => t.isActive);
          if (active) {
            setSelectedTermId(active.id);
            localStorage.setItem('selectedAcademicTermId', active.id);
          } else if (parsedTerms.length > 0) {
            setSelectedTermId(parsedTerms[0].id);
            localStorage.setItem('selectedAcademicTermId', parsedTerms[0].id);
          }
        }
      })
      .catch(console.error);
`);

fs.writeFileSync('src/pages/MobileDashboard.tsx', code);
