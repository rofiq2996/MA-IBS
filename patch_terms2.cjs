const fs = require('fs');
let code = fs.readFileSync('src/pages/AdminTermSettings.tsx', 'utf8');

code = code.replace(
  "const res = await apiClient('/crud/academic_terms');",
  "const res = await apiClient('/crud.php?table=academic_terms');"
);

code = code.replace(
  "apiClient(`\\/crud\\/academic_terms\\/\\${t.id}`",
  "apiClient(`\\/crud.php?table=academic_terms&id=\\${t.id}`"
);

code = code.replace(
  "apiClient(`\\/crud\\/academic_terms\\/\\${id}`",
  "apiClient(`\\/crud.php?table=academic_terms&id=\\${id}`"
);

code = code.replace(
  "apiClient(`\\/crud\\/academic_terms\\/\\${editingId}`",
  "apiClient(`\\/crud.php?table=academic_terms&id=\\${editingId}`"
);

code = code.replace(
  "await apiClient('/crud/academic_terms', {",
  "await apiClient('/crud.php?table=academic_terms', {"
);

code = code.replace(
  "apiClient(`\\/crud\\/academic_terms\\/\\${deleteConfirmId}`",
  "apiClient(`\\/crud.php?table=academic_terms&id=\\${deleteConfirmId}`"
);

fs.writeFileSync('src/pages/AdminTermSettings.tsx', code);
