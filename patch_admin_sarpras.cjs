const fs = require('fs');
let content = fs.readFileSync('src/pages/AdminSarpras.tsx', 'utf8');

content = content.replace(/const confirmDelete = \(\) => \{[\s\S]*?setFeedback\(\{ type: 'success', message: 'Aset berhasil dihapus\.' \}\);\n    \}\n  \};/,
  `const confirmDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await dbClient.delete('sarpras', deleteConfirmId);
      setFeedback({ type: 'success', message: 'Aset berhasil dihapus.' });
      setDeleteConfirmId(null);
      fetchSarpras();
    } catch (err) {
      console.error(err);
      setFeedback({ type: 'error', message: 'Gagal menghapus aset.' });
    }
  };`);

fs.writeFileSync('src/pages/AdminSarpras.tsx', content);
