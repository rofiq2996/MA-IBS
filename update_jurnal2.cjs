const fs = require('fs');
let file = fs.readFileSync('src/pages/GuruPages.tsx', 'utf8');

const oldSave = `  const handleSave = async () => {
    if (!selected || !materi || !tanggal) {
      setToastMessage('Mohon lengkapi form jurnal!');
      setTimeout(() => setToastMessage(''), 3000);
      return;
    }
    
    const [mapel, kelas] = selected.split(' - ');
    const [year, month, day] = tanggal.split('-');
    const formattedTanggal = \`\${day}-\${month}-\${year}\`;
    
    if (editingId) {
      const updated = jurnals.map(j => j.id === editingId ? {
        ...j,
        tanggal: formattedTanggal,
        kelas: kelas || '',
        mataPelajaran: mapel || '',
        materi,
        catatan
      } : j);
      saveToStorage(updated);
      setToastMessage("Jurnal mengajar berhasil diperbarui!");
    } else {
      const newJurnal = {
        id: Date.now().toString(),
        tanggal: formattedTanggal,
        kelas: kelas || '',
        mataPelajaran: mapel || '',
        materi,
        catatan
      };
      
      saveToStorage([newJurnal, ...jurnals]);
      setToastMessage("Jurnal mengajar berhasil disimpan!");
    }`;

const newSave = `  const handleSave = async () => {
    if (!selected || !materi || !tanggal) {
      setToastMessage('Mohon lengkapi form jurnal!');
      setTimeout(() => setToastMessage(''), 3000);
      return;
    }
    
    const [mapel, kelas] = selected.split(' - ');
    const [year, month, day] = tanggal.split('-');
    const formattedTanggal = \`\${day}-\${month}-\${year}\`;
    
    if (editingId) {
      const updated = jurnals.map(j => j.id === editingId ? {
        ...j,
        tanggal: formattedTanggal,
        kelas: kelas || '',
        mataPelajaran: mapel || '',
        materi,
        catatan
      } : j);
      saveToStorage(updated);
      setToastMessage("Jurnal mengajar berhasil diperbarui!");
    } else {
      const newJurnal = {
        id: Date.now().toString(),
        tanggal: formattedTanggal,
        kelas: kelas || '',
        mataPelajaran: mapel || '',
        materi,
        catatan
      };
      
      saveToStorage([newJurnal, ...jurnals]);
      
      try {
        await apiClient('/crud.php?table=laporan_harian', {
          method: 'POST',
          body: JSON.stringify({
            user_id: user?.id,
            role: user?.role,
            date: tanggal,
            activity: JSON.stringify({
               class: kelas,
               subject: mapel,
               materi: materi,
               catatan: catatan
            })
          })
        });
      } catch(e) { console.error('Failed saving to laporan_harian', e); }

      setToastMessage("Jurnal mengajar berhasil disimpan!");
    }`;

file = file.replace(oldSave, newSave);
fs.writeFileSync('src/pages/GuruPages.tsx', file);
