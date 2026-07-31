const fs = require('fs');
const file = 'src/pages/AdminStudents.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
`                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">Jenjang</label>
                    <CustomSelect
                      value={studentGrade}
                      onChange={(val) => setStudentGrade(val)}
                      options={[
                        { value: 'X', label: 'X' },
                        { value: 'XI', label: 'XI' },
                        { value: 'XII', label: 'XII' },
                      ]}
                    />
                  </div>
                </div>`,
`                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">Rombel / Kelas</label>
                    <CustomSelect
                      value={studentClassName}
                      onChange={(val) => setStudentClassName(val)}
                      options={[
                        { value: '', label: '-- Belum ada kelas --' },
                        ...classes.map(c => ({ value: c.name, label: c.name }))
                      ]}
                      searchable={true}
                    />
                  </div>
                </div>`
);

fs.writeFileSync(file, code);
