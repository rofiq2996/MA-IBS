const fs = require('fs');
const file = 'src/pages/AdminStudents.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
`import React, { useState, useEffect, useRef } from 'react';`,
`import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';`
);

code = code.replace(
`export function AdminStudents() {
  const { user } = useAuth();`,
`export function AdminStudents() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedClassFilter, setSelectedClassFilter] = useState('');
  const walasClass = user?.className || user?.class_name;

  useEffect(() => {
    if ((user?.role === 'walas' || user?.roles?.includes('walas')) && walasClass) {
      setSelectedClassFilter(walasClass);
    }
  }, [user, walasClass]);`
);

code = code.replace(
`  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.nis.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.className.toLowerCase().includes(searchQuery.toLowerCase())
  );`,
`  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.nis.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.className.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = !selectedClassFilter || s.className === selectedClassFilter;
    return matchesSearch && matchesClass;
  });`
);

const searchBlockOld = `<div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari nama atau kelas..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                />
              </div>`;

const searchBlockNew = `<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Cari nama atau NIS..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div className="w-full sm:w-44">
                  <CustomSelect
                    value={selectedClassFilter}
                    onChange={setSelectedClassFilter}
                    options={[
                      { value: '', label: 'Semua Kelas' },
                      ...classes.map(c => ({ value: c.name, label: c.name }))
                    ]}
                  />
                </div>
                {walasClass && (
                  <button
                    onClick={() => setSelectedClassFilter(selectedClassFilter === walasClass ? '' : walasClass)}
                    className={"px-3 py-2 text-xs font-bold rounded-lg border transition-colors whitespace-nowrap " + (
                      selectedClassFilter === walasClass
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                        : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                    )}
                  >
                    Kelas Binaan ({walasClass})
                  </button>
                )}
                <button
                  onClick={() => navigate('/absensi')}
                  className="px-3 py-2 text-xs font-bold bg-teal-700 hover:bg-teal-800 text-white rounded-lg transition-colors whitespace-nowrap flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Check className="w-3.5 h-3.5" /> Absensi Kelas
                </button>
              </div>`;

code = code.replace(searchBlockOld, searchBlockNew);

fs.writeFileSync(file, code);
console.log('Patched AdminStudents successfully!');
