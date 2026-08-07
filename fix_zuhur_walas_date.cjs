const fs = require('fs');
let file = fs.readFileSync('src/pages/WalasPages.tsx', 'utf8');

const regex = /<p className="text-sm font-bold text-slate-800">\{today\}<\/p>[\s\S]*?<\/svg>\s*<\/div>/g;
const replacement = `<input 
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full h-8 rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-bold text-slate-700 shadow-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
              </div>`;

file = file.replace(regex, replacement);
fs.writeFileSync('src/pages/WalasPages.tsx', file);
