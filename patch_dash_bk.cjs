const fs = require('fs');
let code = fs.readFileSync('src/pages/DashboardBK.tsx', 'utf-8');

if (!code.includes('recharts')) {
  code = code.replace(
    /import \{ useAuth \} from '\.\.\/context\/AuthContext';/,
    "import { useAuth } from '../context/AuthContext';\nimport { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';"
  );
  
  const chartCode = `
      <Card className="lg:col-span-2">
        <CardHeader>
          <div className="flex items-center gap-2">
            <span className="w-1 h-4 bg-emerald-500 rounded"></span>
            <CardTitle>Distribusi Layanan Bimbingan (Semester Ini)</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="h-64 w-full pt-4 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={[
                  { name: 'Pribadi/Sosial', value: 45 },
                  { name: 'Belajar', value: 30 },
                  { name: 'Karir', value: 15 },
                  { name: 'Kasus (Kuratif)', value: 10 },
                ]}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                <Cell fill="#3b82f6" />
                <Cell fill="#10b981" />
                <Cell fill="#a855f7" />
                <Cell fill="#f59e0b" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
`;

  code = code.replace(
    /<\/div>\s*<\/div>\s*\)\;/g,
    "</div>\n" + chartCode + "\n</div>\n  );"
  );
  
  fs.writeFileSync('src/pages/DashboardBK.tsx', code);
  console.log('DashboardBK patched with recharts');
}
