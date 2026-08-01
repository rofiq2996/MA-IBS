const fs = require('fs');

// Patch AdminStudents.tsx
let file = 'src/pages/AdminStudents.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
`  const [classes, setClasses] = useState<{name:string}[]>([]);`,
`  const [classes, setClasses] = useState<{name:string}[]>([]);

  const availableClassNames = Array.from(new Set([
    ...classes.map(c => c.name),
    ...students.map(s => s.className),
    ...mockClasses.map((c: any) => c.name),
    ...(walasClass ? [walasClass] : [])
  ])).filter(Boolean).sort();`
);

code = code.replace(
`      setClasses(classesData.map((c: any) => ({ name: c.name })));`,
`      if (Array.isArray(classesData) && classesData.length > 0) {
        setClasses(classesData.map((c: any) => ({ name: c.name })));
      } else {
        setClasses(mockClasses.map((c: any) => ({ name: c.name })));
      }`
);

code = code.replace(
`                    options={[
                      { value: '', label: 'Semua Kelas' },
                      ...classes.map(c => ({ value: c.name, label: c.name }))
                    ]}`,
`                    options={[
                      { value: '', label: 'Semua Kelas' },
                      ...availableClassNames.map(c => ({ value: c, label: c }))
                    ]}`
);

code = code.replace(
`                      options={[
                        { value: '', label: '-- Belum ada kelas --' },
                        ...classes.map(c => ({ value: c.name, label: c.name }))
                      ]}`,
`                      options={[
                        { value: '', label: '-- Belum ada kelas --' },
                        ...availableClassNames.map(c => ({ value: c, label: c }))
                      ]}`
);

fs.writeFileSync(file, code);
console.log('Patched AdminStudents successfully!');

// Patch GuruPages.tsx
file = 'src/pages/GuruPages.tsx';
code = fs.readFileSync(file, 'utf8');

if (!code.includes("mockClasses")) {
  code = code.replace(
    `import { mockStudents } from '../data/mock';`,
    `import { mockStudents, mockClasses } from '../data/mock';`
  );
}

code = code.replace(
`  const availableClasses = Array.from(new Set([
    ...(walasClass ? [walasClass] : []),
    ...subjectClasses,
    ...dbClasses
  ])).filter(Boolean) as string[];`,
`  const availableClasses = Array.from(new Set([
    ...(walasClass ? [walasClass] : []),
    ...subjectClasses,
    ...dbClasses,
    ...studentsList.map((s: any) => s.class_name || s.className),
    ...mockClasses.map((c: any) => c.name)
  ])).filter(Boolean).sort() as string[];`
);

fs.writeFileSync(file, code);
console.log('Patched GuruPages successfully!');
