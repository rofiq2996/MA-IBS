const fs = require('fs');
let file = fs.readFileSync('src/pages/GuruQuranPages.tsx', 'utf8');

const regex = /<div className="w-\[150px\]">\s*<CustomSelect/g;
const replacement = `<div className="w-[150px]">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 py-1 text-sm font-bold text-slate-700 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div className="w-[150px]">
              <CustomSelect`;

file = file.replace(regex, replacement);
fs.writeFileSync('src/pages/GuruQuranPages.tsx', file);
