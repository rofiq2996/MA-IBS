const fs = require('fs');
let code = fs.readFileSync('src/pages/WakaTUPages.tsx', 'utf-8');

if (!code.includes('recharts')) {
  code = code.replace(
    /import \{ useAuth \} from '\.\.\/context\/AuthContext';/,
    "import { useAuth } from '../context/AuthContext';\nimport { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';"
  );
  
  const kurikulumChartCode = `
      <Card className="md:col-span-3">
        <CardHeader>
          <div className="flex items-center gap-2">
            <span className="w-1 h-4 bg-emerald-500 rounded"></span>
            <CardTitle>Distribusi Nilai Rata-rata per Jurusan</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="h-64 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={[
              { name: 'MIPA', Nilai: 86.5 },
              { name: 'IPS', Nilai: 82.1 },
              { name: 'Agama', Nilai: 88.4 },
              { name: 'Bahasa', Nilai: 84.2 },
            ]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} domain={[70, 100]} />
              <Tooltip cursor={{ fill: 'transparent' }} />
              <Bar dataKey="Nilai" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
`;

  code = code.replace(
    /<\/Card>\s*<\/div>\s*<\/div>\s*\)\;\s*\}\s*export function DashboardWakaKesiswaan/g,
    "</Card>\n" + kurikulumChartCode + "\n      </div>\n    </div>\n  );\n}\n\nexport function DashboardWakaKesiswaan"
  );
  
  const kesiswaanChartCode = `
      <Card className="md:col-span-3">
        <CardHeader>
          <div className="flex items-center gap-2">
            <span className="w-1 h-4 bg-indigo-500 rounded"></span>
            <CardTitle>Trend Pelanggaran Kedisiplinan</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="h-64 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={[
              { name: 'Jan', Pelanggaran: 20 },
              { name: 'Feb', Pelanggaran: 25 },
              { name: 'Mar', Pelanggaran: 15 },
              { name: 'Apr', Pelanggaran: 10 },
              { name: 'Mei', Pelanggaran: 12 },
              { name: 'Jun', Pelanggaran: 5 },
            ]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="Pelanggaran" stroke="#f43f5e" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
`;

  code = code.replace(
    /<\/Card>\s*<\/div>\s*<\/div>\s*\)\;\s*\}\s*export function DashboardTU/g,
    "</Card>\n" + kesiswaanChartCode + "\n      </div>\n    </div>\n  );\n}\n\nexport function DashboardTU"
  );
  
  fs.writeFileSync('src/pages/WakaTUPages.tsx', code);
  console.log('WakaTUPages patched with recharts');
}
