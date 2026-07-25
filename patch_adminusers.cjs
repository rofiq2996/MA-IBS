const fs = require('fs');
let code = fs.readFileSync('src/pages/AdminUsers.tsx', 'utf8');

code = code.replace(
  '{!editingId && (\n                  <div className="col-span-2 text-xs text-slate-500 bg-blue-50 p-3 rounded-lg border border-blue-100">\n                    <span className="font-bold text-blue-700">Info:</span> Username dan Password akan dibuat secara otomatis (Username = Nama Depan, Password = 12345).\n                  </div>\n                )}',
  `{!editingId ? (
                  <div className="col-span-2 text-xs text-slate-500 bg-blue-50 p-3 rounded-lg border border-blue-100">
                    <span className="font-bold text-blue-700">Info:</span> Username dan Password akan dibuat secara otomatis (Username = Nama Depan, Password = 12345).
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-emerald-700 uppercase tracking-wider">Reset Password (Opsional)</label>
                    <input
                      type="text"
                      placeholder="Masukkan password baru (kosongkan jika tidak diubah)"
                      value={userPassword}
                      onChange={(e) => setUserPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-emerald-200 rounded-lg text-sm focus:border-emerald-500 outline-none bg-emerald-50"
                    />
                  </div>
                )}`
);

fs.writeFileSync('src/pages/AdminUsers.tsx', code);
console.log("Patched successfully");
