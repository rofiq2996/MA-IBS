const fs = require('fs');
let file = fs.readFileSync('src/pages/GuruPages.tsx', 'utf8');

const oldSave = `  const handleSave = () => {
    if (!selectedClass) {
      window.alert("Pilih kelas terlebih dahulu!");
      return;
    }
    if (availableMapel.length > 0 && !selectedMapel) {
      window.alert("Pilih mata pelajaran terlebih dahulu!");
      return;
    }
    const storageKey = \`grades_\${selectedClass}_\${selectedMapel}\`;
    remoteStorage.setItem(storageKey, JSON.stringify(grades));
    setIsLocked(true);
    window.alert("Nilai berhasil disimpan!");
  };`;

const newSave = `  const handleSave = async () => {
    if (!selectedClass) {
      window.alert("Pilih kelas terlebih dahulu!");
      return;
    }
    if (availableMapel.length > 0 && !selectedMapel) {
      window.alert("Pilih mata pelajaran terlebih dahulu!");
      return;
    }
    const storageKey = \`grades_\${selectedClass}_\${selectedMapel}\`;
    remoteStorage.setItem(storageKey, JSON.stringify(grades));
    
    try {
      await apiClient('/query.php', {
        method: 'POST',
        body: JSON.stringify({ query: \`DELETE FROM grades WHERE class_name = '\${selectedClass}' AND subject_name = '\${selectedMapel}' AND semester = '\${semester}'\` })
      });
      
      await Promise.all(Object.entries(grades).map(async ([studentId, data]) => {
         // Insert UHs
         for (let i = 1; i <= 5; i++) {
           const uhVal = (data as any)[\`uh\${i}\`];
           if (uhVal) {
             await apiClient('/crud.php?table=grades', {
               method: 'POST',
               body: JSON.stringify({
                 student_id: studentId,
                 subject_name: selectedMapel,
                 class_name: selectedClass,
                 academic_year: '2026/2027',
                 semester: semester,
                 type: 'UH',
                 score: Number(uhVal)
               })
             });
           }
         }
         
         const utsVal = (data as any).uts;
         if (utsVal) {
             await apiClient('/crud.php?table=grades', {
               method: 'POST',
               body: JSON.stringify({
                 student_id: studentId,
                 subject_name: selectedMapel,
                 class_name: selectedClass,
                 academic_year: '2026/2027',
                 semester: semester,
                 type: 'UTS',
                 score: Number(utsVal)
               })
             });
         }

         const uasVal = (data as any).uas;
         if (uasVal) {
             await apiClient('/crud.php?table=grades', {
               method: 'POST',
               body: JSON.stringify({
                 student_id: studentId,
                 subject_name: selectedMapel,
                 class_name: selectedClass,
                 academic_year: '2026/2027',
                 semester: semester,
                 type: 'UAS',
                 score: Number(uasVal)
               })
             });
         }
      }));
    } catch(e) { console.error('Failed to save to database', e); }
    
    setIsLocked(true);
    window.alert("Nilai berhasil disimpan!");
  };`;

file = file.replace(oldSave, newSave);
fs.writeFileSync('src/pages/GuruPages.tsx', file);
