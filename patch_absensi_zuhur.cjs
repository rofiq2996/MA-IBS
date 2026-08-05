const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/pages/GuruPages.tsx');
let content = fs.readFileSync(file, 'utf8');

const targetFunction = `  const handleSubmit = () => {
    if (status === 'tidak' && !reason) {
      window.alert('Mohon isi keterangan (misal: haid, dinas luar, dll).');
      return;
    }

    const saveAbsen = (msg: string) => {
        window.alert(msg);
        remoteStorage.setItem(absensiKey, 'true');
        setHasAbsen(true);
        setStatus(null);
        setReason('');
    };`;

const replacementFunction = `  const handleSubmit = () => {
    if (status === 'tidak' && !reason) {
      window.alert('Mohon isi keterangan (misal: haid, dinas luar, dll).');
      return;
    }

    const saveAbsen = async (msg: string) => {
        try {
          const payload = {
            user_id: user?.id,
            date: new Date().toLocaleDateString('en-CA'),
            status: status === 'hadir' ? 'Jamaah' : 'Tidak Jamaah',
            keterangan: status === 'tidak' ? reason : ''
          };
          await apiClient('/crud.php?table=ibadah_guru', {
            method: 'POST',
            body: JSON.stringify(payload)
          });
          window.alert(msg);
          remoteStorage.setItem(absensiKey, 'true');
          setHasAbsen(true);
          setStatus(null);
          setReason('');
        } catch (e) {
          console.error(e);
          window.alert('Gagal menyimpan absensi ibadah');
        }
    };`;

content = content.replace(targetFunction, replacementFunction);
fs.writeFileSync(file, content);
