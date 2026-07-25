const fs = require('fs');
let code = fs.readFileSync('src/pages/WakaTUPages.tsx', 'utf8');

if (!code.includes('import { Link } from "react-router-dom";')) {
  code = code.replace(
    "import { useAuth } from '../context/AuthContext';",
    "import { useAuth } from '../context/AuthContext';\nimport { Link } from 'react-router-dom';"
  );
}

// Wrap Ekskul card with Link
code = code.replace(
  '<Card className="bg-emerald-50 border-emerald-100">\n          <CardContent className="p-6">\n            <div className="flex items-center gap-4">\n              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">\n                <Activity className="w-6 h-6" />\n              </div>\n              <div>\n                <p className="text-sm font-bold text-emerald-800">Ekskul Aktif</p>\n                <p className="text-2xl font-black text-emerald-900 mt-1">8</p>\n              </div>\n            </div>\n          </CardContent>\n        </Card>',
  '<Link to="/kesiswaan/ekskul" className="block">\n        <Card className="bg-emerald-50 border-emerald-100 hover:shadow-md transition-shadow cursor-pointer">\n          <CardContent className="p-6">\n            <div className="flex items-center gap-4">\n              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">\n                <Activity className="w-6 h-6" />\n              </div>\n              <div>\n                <p className="text-sm font-bold text-emerald-800">Ekskul Aktif</p>\n                <p className="text-2xl font-black text-emerald-900 mt-1">8</p>\n              </div>\n            </div>\n          </CardContent>\n        </Card>\n        </Link>'
);

// Wrap Siswa Aktif card with Link
code = code.replace(
  '<Card className="bg-indigo-50 border-indigo-100">\n          <CardContent className="p-6">\n            <div className="flex items-center gap-4">\n              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">\n                <Users className="w-6 h-6" />\n              </div>\n              <div>\n                <p className="text-sm font-bold text-indigo-800">Total Siswa Aktif</p>\n                <p className="text-2xl font-black text-indigo-900 mt-1">452</p>\n              </div>\n            </div>\n          </CardContent>\n        </Card>',
  '<Link to="/kesiswaan/data" className="block">\n        <Card className="bg-indigo-50 border-indigo-100 hover:shadow-md transition-shadow cursor-pointer">\n          <CardContent className="p-6">\n            <div className="flex items-center gap-4">\n              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">\n                <Users className="w-6 h-6" />\n              </div>\n              <div>\n                <p className="text-sm font-bold text-indigo-800">Total Siswa Aktif</p>\n                <p className="text-2xl font-black text-indigo-900 mt-1">452</p>\n              </div>\n            </div>\n          </CardContent>\n        </Card>\n        </Link>'
);

fs.writeFileSync('src/pages/WakaTUPages.tsx', code);
