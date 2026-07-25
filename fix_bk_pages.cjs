const fs = require('fs');
let content = fs.readFileSync('src/pages/BKPages.tsx', 'utf8');

// We need to remove handleRekomendasiSP from line 23
const injectedCode = `
  const handleRekomendasiSP = (c) => {
    if (window.confirm('Rekomendasikan kasus ini ke Kesiswaan untuk Poin / SP?')) {
      const bkSaved = localStorage.getItem('bk_rekomendasi_sp');
      const bkCases = bkSaved ? JSON.parse(bkSaved) : [];
      
      bkCases.push({
        idKasusBK: c.id,
        tanggal: new Date().toISOString().split('T')[0],
        namaSiswa: c.namaSiswa,
        kasus: c.kasus,
        usulanSP: c.tingkat === 'Berat' ? 'SP 2' : (c.tingkat === 'Sedang' ? 'SP 1' : 'Tidak Ada')
      });
      
      localStorage.setItem('bk_rekomendasi_sp', JSON.stringify(bkCases));
      
      // Update status in BK to indicate it was forwarded
      setCases(cases.map(caseItem => caseItem.id === c.id ? { ...caseItem, status: 'Diteruskan ke Kesiswaan' } : caseItem));
      
      window.alert('Berhasil direkomendasikan ke Kesiswaan!');
    }
  };
`;

content = content.replace(injectedCode, "");

// Now inject it correctly into BKKuratif.
// BKKuratif is down below. Let's find its handleSave
const regexBKKuratif = /(export function BKKuratif\(\) \{[\s\S]*?)(const handleSave = \(\) => \{)/;
content = content.replace(regexBKKuratif, `$1${injectedCode}\n  $2`);

fs.writeFileSync('src/pages/BKPages.tsx', content);
