const fs = require('fs');
let content = fs.readFileSync('src/pages/AdminSubjects.tsx', 'utf8');

const oldFilter = `  const filteredSubjects = subjects.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'Semua' || s.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });`;

const newFilter = `  const filteredSubjects = subjects.filter(s => {
    const nameStr = s.name || '';
    const codeStr = s.code || '';
    const matchesSearch = nameStr.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          codeStr.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'Semua' || s.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });`;

content = content.replace(oldFilter, newFilter);
fs.writeFileSync('src/pages/AdminSubjects.tsx', content);
