const fs = require('fs');
let code = fs.readFileSync('src/pages/DashboardSiswa.tsx', 'utf-8');

if (!code.includes('recharts')) {
  code = code.replace(
    /import \{ useAuth \} from '\.\.\/context\/AuthContext';/,
    "import { useAuth } from '../context/AuthContext';\nimport { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';"
  );
  
  const chartCode = `
      <Card className="lg:col-span-2">
        <CardHeader>
          <div className="flex items-center gap-2">
            <span className="w-1 h-4 bg-emerald-500 rounded"></span>
            <CardTitle>Profil Kompetensi Akademik</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="h-64 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={[
              { subject: 'Matematika', A: 85, fullMark: 100 },
              { subject: 'Sains', A: 90, fullMark: 100 },
              { subject: 'Bahasa', A: 80, fullMark: 100 },
              { subject: 'Agama', A: 95, fullMark: 100 },
              { subject: 'Sosial', A: 88, fullMark: 100 },
            ]}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              <Radar name="Nilai Siswa" dataKey="A" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
`;

  code = code.replace(
    /<\/div>\s*<\/div>\s*\)\;/g,
    "</div>\n" + chartCode + "\n</div>\n  );"
  );
  
  fs.writeFileSync('src/pages/DashboardSiswa.tsx', code);
  console.log('DashboardSiswa patched with recharts');
}
