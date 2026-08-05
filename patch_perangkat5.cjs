const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/pages/GuruPages.tsx');
let content = fs.readFileSync(file, 'utf8');

const regexClass = /<label className="block font-bold text-slate-700 mb-1">Kelas<\/label>\s*<input\s*type="text"\s*value=\{formClass\}\s*onChange=\{\(e\) => setFormClass\(e\.target\.value\)\}\s*placeholder="Misal: X IPA 1"\s*className="w-full p-2\.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:border-emerald-500 font-semibold"\s*required\s*\/>/;

const replacementClass = `<label className="block font-bold text-slate-700 mb-1">Kelas</label>
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
                  </select>`;

const regexSubject = /<label className="block font-bold text-slate-700 mb-1">Mata Pelajaran<\/label>\s*<input\s*type="text"\s*value=\{formSubject\}\s*onChange=\{\(e\) => setFormSubject\(e\.target\.value\)\}\s*placeholder="Misal: Matematika"\s*className="w-full p-2\.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:border-emerald-500 font-semibold"\s*required\s*\/>/;

const replacementSubject = `<label className="block font-bold text-slate-700 mb-1">Mata Pelajaran</label>
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
                  </select>`;

if (content.match(regexClass) && content.match(regexSubject)) {
    content = content.replace(regexClass, replacementClass);
    content = content.replace(regexSubject, replacementSubject);
    fs.writeFileSync(file, content);
    console.log('Replaced form fields');
} else {
    console.log('Regex did not match');
}
