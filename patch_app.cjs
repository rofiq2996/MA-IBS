const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  /mockClasses\.splice\(0, mockClasses\.length, \.\.\.syncedClasses\);/,
  `mockClasses.splice(0, mockClasses.length, ...syncedClasses);
          if (res.subjects) {
            const syncedSubjects = res.subjects.map((s: any) => ({ ...s, id: String(s.id) }));
            mockSubjects.splice(0, mockSubjects.length, ...syncedSubjects);
          }`
);

fs.writeFileSync('src/App.tsx', content);
