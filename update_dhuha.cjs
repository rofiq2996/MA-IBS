const fs = require('fs');
let file = fs.readFileSync('src/pages/GuruQuranPages.tsx', 'utf8');

const oldSave = `  const handleSave = async () => {
    if (!selectedClass) {
      window.alert("Pilih kelas terlebih dahulu!");
      return;
    }
    const storageKey = \`dhuha_\${selectedClass}\`;
    const existingData = JSON.parse(remoteStorage.getItem(storageKey) || '{}');
    const today = new Date().toISOString().split('T')[0];
    existingData[today] = attendance;
    remoteStorage.setItem(storageKey, JSON.stringify(existingData));
    setIsLocked(true);`;

const newSave = `  const handleSave = async () => {
    if (!selectedClass) {
      window.alert("Pilih kelas terlebih dahulu!");
      return;
    }
    const storageKey = \`dhuha_\${selectedClass}\`;
    const existingData = JSON.parse(remoteStorage.getItem(storageKey) || '{}');
    const today = new Date().toISOString().split('T')[0];
    existingData[today] = attendance;
    remoteStorage.setItem(storageKey, JSON.stringify(existingData));
    
    try {
      await apiClient('/query.php', {
        method: 'POST',
        body: JSON.stringify({ query: \`DELETE FROM ibadah_siswa WHERE class_name = '\${selectedClass}' AND type = 'Dhuha' AND date = '\${today}'\` })
      });
      
      await Promise.all(Object.entries(attendance).map(async ([studentId, data]) => {
         if (!data.status) return;
         await apiClient('/crud.php?table=ibadah_siswa', {
           method: 'POST',
           body: JSON.stringify({
             student_id: studentId,
             class_name: selectedClass,
             date: today,
             type: 'Dhuha',
             status: data.status,
             notes: data.ket || ''
           })
         });
      }));
    } catch(e) { console.error('Failed to save to database', e); }
    
    setIsLocked(true);`;

file = file.replace(oldSave, newSave);
fs.writeFileSync('src/pages/GuruQuranPages.tsx', file);
