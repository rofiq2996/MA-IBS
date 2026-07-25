const fs = require('fs');
let content = fs.readFileSync('src/pages/AdminSarpras.tsx', 'utf8');

const oldFilter = `  const filteredAssets = assets.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          a.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'Semua' || a.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });`;

const newFilter = `  const filteredAssets = assets.filter(a => {
    const nameStr = a.name || '';
    const locStr = a.location || '';
    const matchesSearch = nameStr.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          locStr.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'Semua' || a.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });`;

content = content.replace(oldFilter, newFilter);
fs.writeFileSync('src/pages/AdminSarpras.tsx', content);
