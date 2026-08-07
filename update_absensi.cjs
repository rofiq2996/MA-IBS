const fs = require('fs');
let file = fs.readFileSync('src/pages/GuruPages.tsx', 'utf8');

const oldSave = `    // Save to remote storage to persist locally
    const storageKey = \`attendance_\${selectedClass}_\${selectedMapel}\`;
    const existingData = JSON.parse(remoteStorage.getItem(storageKey) || '{}');
    const today = new Date().toISOString().split('T')[0];
    existingData[today] = attendance;
    remoteStorage.setItem(storageKey, JSON.stringify(existingData));
    setIsLocked(true);`;

const newSave = `    // Save to remote storage to persist locally
    const storageKey = \`attendance_\${selectedClass}_\${selectedMapel}\`;
    const existingData = JSON.parse(remoteStorage.getItem(storageKey) || '{}');
    const today = new Date().toISOString().split('T')[0];
    existingData[today] = attendance;
    remoteStorage.setItem(storageKey, JSON.stringify(existingData));
    
    // Save to database
    try {
       await Promise.all(Object.entries(attendance).map(async ([studentId, data]) => {
          if (!data.status) return;
          const payload = {
             student_id: studentId,
             class_name: selectedClass,
             subject_name: selectedMapel,
             date: today,
             status: data.status,
             notes: data.ket || ''
          };
          await apiClient('/crud.php?table=student_attendance', {
             method: 'POST',
             body: JSON.stringify(payload)
          });
       }));
    } catch(e) { console.error('Failed to save to database', e); }
    
    setIsLocked(true);`;

file = file.replace(oldSave, newSave);
fs.writeFileSync('src/pages/GuruPages.tsx', file);
