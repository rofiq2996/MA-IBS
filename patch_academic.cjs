const fs = require('fs');
let code = fs.readFileSync('src/pages/AdminAcademic.tsx', 'utf8');

// Remove state
code = code.replace(
  /const \[manageStudentsClass, setManageStudentsClass\] = useState<any>\(null\);\n  const \[manageSearchQuery, setManageSearchQuery\] = useState\(''\);\n/,
  ""
);

// Remove button
code = code.replace(
  /\s*<button onClick=\{\(\) => setManageStudentsClass\(c\)\} className="text-indigo-600 hover:text-indigo-700" title="Kelola Siswa">\n\s*<Users className="w-4 h-4" \/>\n\s*<\/button>/g,
  ""
);

// Find the index of `{manageStudentsClass && (() => {` and remove it and the modal.
const modalStartIndex = code.indexOf('{manageStudentsClass && (() => {');
if (modalStartIndex !== -1) {
  // It ends at the end of the file before `    </div>\n  );\n}`
  const fileEndIndex = code.lastIndexOf('</div>');
  code = code.substring(0, modalStartIndex) + code.substring(fileEndIndex);
}

fs.writeFileSync('src/pages/AdminAcademic.tsx', code);
