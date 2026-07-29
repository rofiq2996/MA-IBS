const fs = require('fs');
let code = fs.readFileSync('src/pages/AdminTermSettings.tsx', 'utf8');

const activatePatch = `
  const handleActivate = async (id: string) => {
    try {
      // Set all terms to false
      await Promise.all(terms.map(t => 
        apiClient(\`/crud/academic_terms/\${t.id}\`, {
          method: 'PUT',
          body: JSON.stringify({ is_active: 0 })
        })
      ));
      // Set selected term to true
      await apiClient(\`/crud/academic_terms/\${id}\`, {
        method: 'PUT',
        body: JSON.stringify({ is_active: 1 })
      });
      fetchTerms();
      setFeedback({ type: 'success', message: 'Tahun ajaran dan semester aktif berhasil diubah.' });
    } catch (e) {
      console.error(e);
      setFeedback({ type: 'error', message: 'Gagal mengubah tahun ajaran.' });
    }
  };
`;

code = code.replace(/const handleActivate = \(id: string\) => \{[\s\S]*?setFeedback\(\{ type: 'success', message: 'Tahun ajaran dan semester aktif berhasil diubah.' \}\);\n  \};/g, activatePatch);

const savePatch = `
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!year.trim() || !startDate || !endDate || Number(totalWeeks) <= 0) {
      setFeedback({ type: 'error', message: 'Silakan isi formulir dengan lengkap.' });
      return;
    }
    const payload = {
      year: year.trim(),
      semester,
      start_date: startDate,
      end_date: endDate,
      total_weeks: Number(totalWeeks),
      is_active: terms.length === 0 ? 1 : 0 // If first, make active
    };
    try {
      if (editingId) {
        await apiClient(\`/crud/academic_terms/\${editingId}\`, {
          method: 'PUT',
          body: JSON.stringify({
            year: year.trim(),
            semester,
            start_date: startDate,
            end_date: endDate,
            total_weeks: Number(totalWeeks)
          })
        });
        setFeedback({ type: 'success', message: 'Tahun ajaran berhasil diperbarui.' });
      } else {
        await apiClient('/crud/academic_terms', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
        setFeedback({ type: 'success', message: 'Tahun ajaran dan semester baru berhasil dibuat.' });
      }
      setIsModalOpen(false);
      fetchTerms();
    } catch (e) {
      console.error(e);
      setFeedback({ type: 'error', message: 'Gagal menyimpan tahun ajaran.' });
    }
  };
`;

code = code.replace(/const handleSave = \(e: React\.FormEvent\) => \{[\s\S]*?setIsModalOpen\(false\);\n  \};/g, savePatch);

const delPatch = `
  const confirmDelete = async () => {
    if (deleteConfirmId) {
      const t = terms.find(x => x.id === deleteConfirmId);
      if (t && t.isActive) {
        setFeedback({ type: 'error', message: 'Tidak dapat menghapus tahun ajaran yang sedang aktif.' });
        setDeleteConfirmId(null);
        return;
      }
      try {
        await apiClient(\`/crud/academic_terms/\${deleteConfirmId}\`, {
          method: 'DELETE'
        });
        setFeedback({ type: 'success', message: 'Tahun ajaran berhasil dihapus.' });
        setDeleteConfirmId(null);
        fetchTerms();
      } catch(e) {
        setFeedback({ type: 'error', message: 'Gagal menghapus tahun ajaran.' });
      }
    }
  };
`;

code = code.replace(/const confirmDelete = \(\) => \{[\s\S]*?setDeleteConfirmId\(null\);\n  \};/g, delPatch);

fs.writeFileSync('src/pages/AdminTermSettings.tsx', code);
