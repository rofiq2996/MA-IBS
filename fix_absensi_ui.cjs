const fs = require('fs');
let file = fs.readFileSync('src/pages/GuruPages.tsx', 'utf8');

const regex = /<h2 className="text-lg font-bold text-slate-800">Absensi Kehadiran<\/h2>\s*<p className="text-sm text-slate-500 mt-0\.5">Masukkan data kehadiran siswa<\/p>\s*<\/div>\s*<div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full md:w-auto">/g;

const replacement = `<h2 className="text-lg font-bold text-slate-800">Absensi Kehadiran</h2>
            <p className="text-sm text-slate-500 mt-0.5">Masukkan data kehadiran siswa</p>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full md:w-auto">
            <div className="w-full md:w-[150px]">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500 font-bold text-slate-700"
              />
            </div>`;

file = file.replace(regex, replacement);

const handleSaveRegex = /const today = new Date\(\)\.toISOString\(\)\.split\('T'\)\[0\];\s*existingData\[today\] = attendance;/g;
file = file.replace(handleSaveRegex, `const today = selectedDate;
    existingData[today] = attendance;`);

// Also fix isLate check
const isLateRegex = /const isLate = currentHour > limitHour \|\| \(currentHour === limitHour && currentMinute >= limitMinute\);/g;
const isLateReplacement = `const isLate = (currentHour > limitHour || (currentHour === limitHour && currentMinute >= limitMinute)) && selectedDate === new Date().toISOString().split('T')[0];`;
file = file.replace(isLateRegex, isLateReplacement);


fs.writeFileSync('src/pages/GuruPages.tsx', file);
