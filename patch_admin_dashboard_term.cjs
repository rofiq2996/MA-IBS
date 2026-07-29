const fs = require('fs');
let code = fs.readFileSync('src/pages/DashboardAdmin.tsx', 'utf8');

const targetState = `        const activeTerm = terms.find((t: any) => t.isActive);
        if (activeTerm) {
          setActiveTermName(activeTerm.name);
          setActiveTermSemester(activeTerm.semester === 'ganjil' ? 'Ganjil' : 'Genap');
        } else if (terms.length > 0) {
          setActiveTermName(terms[0].name);
          setActiveTermSemester(terms[0].semester === 'ganjil' ? 'Ganjil' : 'Genap');
        }`;

const replaceState = `        const activeTerm = terms.find((t: any) => t.isActive);
        if (activeTerm) {
          setActiveTermName(activeTerm.year || '-');
          setActiveTermSemester(activeTerm.semester || '-');
        } else if (terms.length > 0) {
          setActiveTermName(terms[0].year || '-');
          setActiveTermSemester(terms[0].semester || '-');
        }`;

code = code.replace(targetState, replaceState);

fs.writeFileSync('src/pages/DashboardAdmin.tsx', code);
