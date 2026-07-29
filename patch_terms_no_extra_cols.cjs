const fs = require('fs');
let code = fs.readFileSync('src/pages/AdminTermSettings.tsx', 'utf8');

code = code.replace(
  "    const payload = {\n      year: year.trim(),\n      semester,\n      start_date: startDate,\n      end_date: endDate,\n      total_weeks: Number(totalWeeks),\n      is_active: terms.length === 0 ? 1 : 0 // If first, make active\n    };",
  "    const payload = {\n      year: year.trim(),\n      semester,\n      is_active: terms.length === 0 ? 1 : 0\n    };"
);

code = code.replace(
  "          body: JSON.stringify({\n            year: year.trim(),\n            semester,\n            start_date: startDate,\n            end_date: endDate,\n            total_weeks: Number(totalWeeks)\n          })",
  "          body: JSON.stringify({\n            year: year.trim(),\n            semester\n          })"
);

fs.writeFileSync('src/pages/AdminTermSettings.tsx', code);
