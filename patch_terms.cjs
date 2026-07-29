const fs = require('fs');
let code = fs.readFileSync('src/pages/AdminTermSettings.tsx', 'utf8');
code = code.replace(
  "import { CustomSelect } from '../components/ui/CustomSelect';",
  "import { CustomSelect } from '../components/ui/CustomSelect';\nimport { apiClient } from '../lib/apiClient';"
);
code = code.replace(
  "export function AdminTermSettings() {\n  const [terms, setTerms] = useState<AcademicTerm[]>(() => {",
  "export function AdminTermSettings() {\n  const [terms, setTerms] = useState<AcademicTerm[]>([]);\n  const [loading, setLoading] = useState(true);\n\n  const fetchTerms = async () => {\n    try {\n      const res = await apiClient('/crud/academic_terms');\n      // Map snake_case to camelCase and supply defaults\n      setTerms(res.map((t: any) => ({\n        id: t.id.toString(),\n        year: t.year,\n        semester: t.semester,\n        isActive: Boolean(t.is_active),\n        startDate: t.start_date || '2025-07-15',\n        endDate: t.end_date || '2025-12-15',\n        totalWeeks: t.total_weeks || 20\n      })));\n    } catch(e) {\n      console.error(e);\n      setFeedback({ type: 'error', message: 'Gagal memuat tahun ajaran' });\n    } finally {\n      setLoading(false);\n    }\n  };\n\n  useEffect(() => {\n    fetchTerms();\n  }, []);\n\n  // Remove old localStorage block\n  /*"
);
code = code.replace(
  "  useEffect(() => {\n    localStorage.setItem('mockAcademicTerms', JSON.stringify(terms));\n  }, [terms]);",
  "  */"
);
fs.writeFileSync('src/pages/AdminTermSettings.tsx', code);
