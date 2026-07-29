const fs = require('fs');
let code = fs.readFileSync('src/components/ui/TermSwitcher.tsx', 'utf8');

code = code.replace(
  "import { ChevronDown } from 'lucide-react';",
  "import { ChevronDown } from 'lucide-react';\nimport { apiClient } from '../../lib/apiClient';"
);

code = code.replace(
  "  useEffect(() => {\n    if (typeof window !== 'undefined') {\n      let parsedTerms: any[] = [];\n      const stored = localStorage.getItem('mockAcademicTerms');\n      if (stored) {\n        try {\n          parsedTerms = JSON.parse(stored);\n        } catch (e) {\n          console.error(e);\n        }\n      }\n      \n      if (parsedTerms.length === 0) {\n        parsedTerms = [\n           { id: '1', year: '2026/2027', semester: 'Ganjil', isActive: true },\n           { id: '2', year: '2026/2027', semester: 'Genap', isActive: false }\n        ];\n        localStorage.setItem('mockAcademicTerms', JSON.stringify(parsedTerms));\n      }\n      \n      setTerms(parsedTerms);\n      \n      const savedId = localStorage.getItem('selectedAcademicTermId');\n      if (savedId) {\n        setSelectedTermId(savedId);\n      } else {\n        const active = parsedTerms.find((t: any) => t.isActive);\n        if (active) {\n          setSelectedTermId(active.id);\n        } else if (parsedTerms.length > 0) {\n          setSelectedTermId(parsedTerms[0].id);\n        }\n      }\n    }\n  }, []);",
  `
  useEffect(() => {
    async function loadTerms() {
      try {
        const data = await apiClient('/crud.php?table=academic_terms');
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
      } catch (e) {
        console.error("Failed to load academic terms", e);
      }
    }
    loadTerms();
  }, []);
`
);

fs.writeFileSync('src/components/ui/TermSwitcher.tsx', code);
