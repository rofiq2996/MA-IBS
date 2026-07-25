const fs = require('fs');
const files = [
  'src/pages/AdminAnnouncements.tsx',
  'src/pages/MobileDashboard.tsx',
  'src/pages/DashboardAdmin.tsx',
  'src/components/ui/UserAnnouncements.tsx',
  'src/pages/AdminSarpras.tsx'
];

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf8');

  // Fix AdminAnnouncements, MobileDashboard, DashboardAdmin
  content = content.replace(/const res = await apiClient\('\/announcements\.php', [^;]+;\s*if \(res\.ok [^}]+\{\s*const data = await res\.json\(\);\s*setAnnouncements\(data\);\s*\} else \{\s*(?:setAnnouncements\(\[\]\);|console\.log[^;]+;)\s*\}/g, 'const data = await apiClient(\'/announcements.php\');\n        setAnnouncements(data);');

  // Fix UserAnnouncements
  content = content.replace(/const response = await apiClient\('\/announcements\.php'\);\s*if \(!response\.ok\) throw new Error\('Network response was not ok'\);\s*const data = await response\.json\(\);/g, 'const data = await apiClient(\'/announcements.php\');');
  
  // Fix AdminSarpras
  content = content.replace(/const response = await apiClient\('\/sarpras\.php'\);\s*if \(!response\.ok\) throw new Error\('Network response was not ok'\);\s*const data = await response\.json\(\);/g, 'const data = await apiClient(\'/sarpras.php\');');

  fs.writeFileSync(file, content);
}
