const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/pages/GuruPages.tsx');
let content = fs.readFileSync(file, 'utf8');

const regex = /<div className="grid grid-cols-2 gap-3">\s*<div>\s*<label className="block font-bold text-slate-700 mb-1">Mata Pelajaran<\/label>[\s\S]*?<\/select>\s*<\/div>\s*<div>\s*<label className="block font-bold text-slate-700 mb-1">Kelas<\/label>[\s\S]*?<\/select>\s*<\/div>\s*<\/div>/;

const replacement = `<div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kelas</label>
                  <select
                    value={formClass}
                    onChange={(e) => setFormClass(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:border-emerald-500 font-semibold"
                    required
                  >
                    <option value="" disabled>Pilih Kelas</option>
                    {uniqueClasses.map((cls, idx) => (
                      <option key={idx} value={cls as string}>{cls as string}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mata Pelajaran</label>
                  <select
                    value={formSubject}
                    onChange={(e) => setFormSubject(e.target.value)}
                    disabled={availableSubjects.length <= 1}
                    className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:border-emerald-500 font-semibold disabled:opacity-70"
                    required
                  >
                    <option value="" disabled>Pilih Mata Pelajaran</option>
                    {availableSubjects.map((sub, idx) => (
                      <option key={idx} value={sub as string}>{sub as string}</option>
                    ))}
                  </select>
                </div>
              </div>`;

if (content.match(regex)) {
    content = content.replace(regex, replacement);
    fs.writeFileSync(file, content);
    console.log('Swapped Kelas and Mata Pelajaran');
} else {
    console.log('Regex did not match');
}
