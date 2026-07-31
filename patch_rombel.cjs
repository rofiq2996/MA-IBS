const fs = require('fs');
const file = 'src/pages/AdminRombel.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
`  const availableStudents = students.filter(s => 
    s.className !== selectedClass && 
    (!classGrade || s.grade === classGrade)
  );`,
`  const isAssignedToAnyClass = (className) => {
    return classes.some(c => c.name === className);
  };

  const availableStudents = students.filter(s => 
    !isAssignedToAnyClass(s.className) && 
    (!classGrade || s.grade === classGrade)
  );`
);

fs.writeFileSync(file, code);
