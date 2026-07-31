const fs = require('fs');
const file = 'src/pages/LMSTugas.tsx';
let code = fs.readFileSync(file, 'utf8');

// We need to fetch the real subjects and classes for the teacher.
// We can use apiClient('/crud.php?table=schedules') or '/crud.php?table=teaching_assignments'
// But wait, user may be walas or guru. They might just teach the subjects they are assigned.
// For now, let's just make the classes options dynamic if possible, or use user's class if they are walas.

code = code.replace(
`import { useAuth } from '../context/AuthContext';`,
`import { useAuth } from '../context/AuthContext';
import { apiClient } from '../lib/apiClient';
import { useEffect } from 'react';`
);

const stateHook = `
  const [availableClasses, setAvailableClasses] = useState<{value: string, label: string}[]>([]);
  const [availableSubjects, setAvailableSubjects] = useState<{value: string, label: string}[]>([]);

  useEffect(() => {
    // Basic fallback classes
    let classOpts = [{value: 'X-IPA 1', label: 'X-IPA 1'}, {value: 'X-IPS 1', label: 'X-IPS 1'}];
    let subjOpts = [{value: 'Matematika Peminatan', label: 'Matematika'}, {value: 'Bahasa Indonesia', label: 'B. Indo'}];
    
    if (user?.className) {
       classOpts = [{value: user.className, label: user.className}];
       setForm(f => ({ ...f, className: user.className }));
    }
    setAvailableClasses(classOpts);
    setAvailableSubjects(subjOpts);

    if (user?.id) {
       // Ideally fetch teaching assignments here
       apiClient('/crud.php?table=teaching_assignments').then(data => {
          const myAssignments = data.filter((a:any) => a.teacher_id === String(user.id) || a.guru_id === String(user.id) || a.teacher_id === user.id || a.guru_id === user.id);
          if (myAssignments.length > 0) {
             const uniqueClasses = Array.from(new Set(myAssignments.map((a:any) => a.class_name || a.rombel))).filter(Boolean) as string[];
             const uniqueSubjects = Array.from(new Set(myAssignments.map((a:any) => a.subject_name || a.mapel))).filter(Boolean) as string[];
             
             if (uniqueClasses.length > 0) {
               setAvailableClasses(uniqueClasses.map(c => ({ value: c, label: c })));
               setForm(f => ({ ...f, className: uniqueClasses[0] }));
             }
             if (uniqueSubjects.length > 0) {
               setAvailableSubjects(uniqueSubjects.map(s => ({ value: s, label: s })));
               setForm(f => ({ ...f, subject: uniqueSubjects[0] }));
             }
          }
       }).catch(console.error);
    }
  }, [user]);
`;

code = code.replace(
`  const [toastMessage, setToastMessage] = useState('');`,
`  const [toastMessage, setToastMessage] = useState('');\n${stateHook}`
);

code = code.replace(
`options={[{value: 'X-IPA 1', label: 'X-IPA 1'}, {value: 'X-IPS 1', label: 'X-IPS 1'}]}`,
`options={availableClasses}`
);

code = code.replace(
`options={[{value: 'Matematika Peminatan', label: 'Matematika'}, {value: 'Bahasa Indonesia', label: 'B. Indo'}]}`,
`options={availableSubjects}`
);

fs.writeFileSync(file, code);
