const fs = require('fs');

const files = ['src/pages/KamadPages.tsx', 'src/pages/GuruPages.tsx'];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');

  // Replace the mapping in fetchModul
  const regex = /role: m\.role === 'walas' \? 'Wali Kelas' : 'Guru Mapel',\s*category: m\.category,/g;
  
  const replacement = `role: (m.subject.toLowerCase().includes('quran') || m.subject.toLowerCase().includes('tahfizh')) ? 'Guru Al-Qur\\'an' : 'Guru Mapel',
          category: (m.subject.toLowerCase().includes('quran') || m.subject.toLowerCase().includes('tahfizh')) ? 'guru_quran' : 'guru_mapel',`;
  
  content = content.replace(regex, replacement);
  
  fs.writeFileSync(file, content);
  console.log('Patched', file);
}
