const fs = require('fs');
let code = fs.readFileSync('src/pages/AdminTermSettings.tsx', 'utf8');

code = code.replace(
  /apiClient\(`\/crud\/academic_terms\/\$\{t\.id\}`/g,
  "apiClient(`/crud.php?table=academic_terms&id=${t.id}`"
);

code = code.replace(
  /apiClient\(`\/crud\/academic_terms\/\$\{id\}`/g,
  "apiClient(`/crud.php?table=academic_terms&id=${id}`"
);

code = code.replace(
  /apiClient\(`\/crud\/academic_terms\/\$\{editingId\}`/g,
  "apiClient(`/crud.php?table=academic_terms&id=${editingId}`"
);

code = code.replace(
  /apiClient\(`\/crud\/academic_terms\/\$\{deleteConfirmId\}`/g,
  "apiClient(`/crud.php?table=academic_terms&id=${deleteConfirmId}`"
);

fs.writeFileSync('src/pages/AdminTermSettings.tsx', code);
