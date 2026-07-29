const fs = require('fs');
let code = fs.readFileSync('src/pages/MobileDashboard.tsx', 'utf8');

const targetStr = `
  useEffect(() => {
    let parsedTerms = [];
    const stored = localStorage.getItem('mockAcademicTerms');
    
    if (stored) {
      try {
        parsedTerms = JSON.parse(stored);
      } catch (e) {
        console.error(e);
      }
    }
    
    if (parsedTerms.length === 0) {
      parsedTerms = [
         { id: '1', year: '2026/2027', semester: 'Ganjil', isActive: true },
         { id: '2', year: '2026/2027', semester: 'Genap', isActive: false }
      ];
      localStorage.setItem('mockAcademicTerms', JSON.stringify(parsedTerms));
    }
    
    setTerms(parsedTerms);
    
    const savedId = localStorage.getItem('selectedAcademicTermId');
    if (savedId) {
      setSelectedTermId(savedId);
    } else {
      const active = parsedTerms.find((t: any) => t.isActive);
      if (active) {
        setSelectedTermId(active.id);
      } else if (parsedTerms.length > 0) {
        setSelectedTermId(parsedTerms[0].id);
      }
    }
  }, []);
`;

code = code.replace(targetStr.trim(), `
  useEffect(() => {
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
  }, []);
`);

fs.writeFileSync('src/pages/MobileDashboard.tsx', code);
