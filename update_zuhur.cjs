const fs = require('fs');
let file = fs.readFileSync('src/pages/WalasPages.tsx', 'utf8');

const oldSave = `  const handleSave = async () => {
    const storageKey = \`zuhur_\${selectedClass}\`;
    const existingData = JSON.parse(remoteStorage.getItem(storageKey) || '{}');
    const todayKey = new Date().toISOString().split('T')[0];
    existingData[todayKey] = attendance;
    remoteStorage.setItem(storageKey, JSON.stringify(existingData));
    setIsLocked(true);`;

const newSave = `  const handleSave = async () => {
    const storageKey = \`zuhur_\${selectedClass}\`;
    const existingData = JSON.parse(remoteStorage.getItem(storageKey) || '{}');
    const todayKey = new Date().toISOString().split('T')[0];
    existingData[todayKey] = attendance;
    remoteStorage.setItem(storageKey, JSON.stringify(existingData));
    
    try {
      await apiClient('/query.php', {
        method: 'POST',
        body: JSON.stringify({ query: \`DELETE FROM ibadah_siswa WHERE class_name = '\${selectedClass}' AND type = 'Zuhur' AND date = '\${todayKey}'\` })
      });
      
      await Promise.all(Object.entries(attendance).map(async ([studentId, data]) => {
         if (!data.status) return;
         await apiClient('/crud.php?table=ibadah_siswa', {
           method: 'POST',
           body: JSON.stringify({
             student_id: studentId,
             class_name: selectedClass,
             date: todayKey,
             type: 'Zuhur',
             status: data.status,
             notes: data.ket || ''
           })
         });
      }));
    } catch(e) { console.error('Failed to save to database', e); }
    
    setIsLocked(true);`;

file = file.replace(oldSave, newSave);
fs.writeFileSync('src/pages/WalasPages.tsx', file);
