const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  "import { DataAnak, AbsensiAnak, NilaiAnak, PesanWaliKelas } from './pages/OrtuPages';",
  "import { DataAnak, AbsensiAnak, NilaiAnak, PesanWaliKelas, SikapAnak } from './pages/OrtuPages';"
);

code = code.replace(
  "<Route path=\"pesan\" element={<PesanWaliKelas />} />",
  "<Route path=\"pesan\" element={<PesanWaliKelas />} />\n            <Route path=\"sikap-anak\" element={<SikapAnak />} />"
);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched App.tsx");
