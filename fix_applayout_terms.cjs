const fs = require('fs');
let code = fs.readFileSync('src/components/layout/AppLayout.tsx', 'utf8');

const regex = /let parsedTerms: any\[\] = \[\];[\s\S]*?setTerms\(parsedTerms\);/g;

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
          if (!savedId) {
            const active = parsedTerms.find((t: any) => t.isActive);
            if (active) {
              localStorage.setItem('selectedAcademicTermId', active.id);
            }
          }
        })
        .catch(console.error);
`);

fs.writeFileSync('src/components/layout/AppLayout.tsx', code);
