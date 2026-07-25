const fs = require('fs');
let code = fs.readFileSync('src/pages/AdminStudents.tsx', 'utf8');

// 1. Add useAuth import
if (!code.includes('import { useAuth }')) {
  code = code.replace(
    "import { CustomSelect } from '../components/ui/CustomSelect';",
    "import { CustomSelect } from '../components/ui/CustomSelect';\nimport { useAuth } from '../context/AuthContext';"
  );
}

// 2. Add useAuth and canManage to component
if (!code.includes('const { user } = useAuth();')) {
  code = code.replace(
    'export function AdminStudents() {\n  const [activeTab',
    'export function AdminStudents() {\n  const { user } = useAuth();\n  const canManage = ["admin", "kamad", "wakakurikulum", "wakakesiswaan"].includes(user?.role || "");\n  const [activeTab'
  );
}

// 3. Hide tabs for non-managers
code = code.replace(
  '<div className="flex bg-slate-100 p-1 rounded-lg">',
  '{canManage && (\n          <div className="flex bg-slate-100 p-1 rounded-lg">'
);
code = code.replace(
  '</button>\n        </div>\n      </div>',
  '</button>\n          </div>\n        )}\n        {!canManage && (\n          <h1 className="text-2xl font-bold text-slate-800">Data Siswa</h1>\n        )}\n      </div>'
);

// 4. Hide header actions for non-managers
code = code.replace(
  '<div className="flex flex-wrap items-center gap-2">\n                <input',
  '{canManage && (\n              <div className="flex flex-wrap items-center gap-2">\n                <input'
);
code = code.replace(
  '<Plus className="w-4 h-4" /> Tambah Siswa\n                </button>\n              </div>\n            </div>\n          </CardHeader>',
  '<Plus className="w-4 h-4" /> Tambah Siswa\n                </button>\n              </div>\n              )}\n            </div>\n          </CardHeader>'
);

// 5. Hide Aksi th
code = code.replace(
  '<th className="pb-3 px-4 font-bold text-right">Aksi</th>',
  '{canManage && <th className="pb-3 px-4 font-bold text-right">Aksi</th>}'
);

// 6. Hide Aksi td
code = code.replace(
  '<td className="py-3 px-4 text-right">\n                          <div className="flex items-center justify-end gap-2">',
  '{canManage && (\n                        <td className="py-3 px-4 text-right">\n                          <div className="flex items-center justify-end gap-2">'
);
code = code.replace(
  '</button>\n                          </div>\n                        </td>\n                      </tr>',
  '</button>\n                          </div>\n                        </td>\n                        )}\n                      </tr>'
);

// 7. Adjust colSpan
code = code.replace(
  '<td colSpan={5} className="py-8 text-center text-slate-500 text-sm">',
  '<td colSpan={canManage ? 5 : 4} className="py-8 text-center text-slate-500 text-sm">'
);

fs.writeFileSync('src/pages/AdminStudents.tsx', code);
