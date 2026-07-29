const fs = require('fs');
let code = fs.readFileSync('src/pages/KamadPages.tsx', 'utf8');

const tabsBlockRegex = /<div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">[\s\S]*?<\/div>\s*<Card className="overflow-hidden border-slate-200\/60 shadow-sm">/;
code = code.replace(tabsBlockRegex, '<Card className="overflow-hidden border-slate-200/60 shadow-sm">');

const funcIndex = code.indexOf('export function KamadKinerjaStaf');
if (funcIndex !== -1) {
  const cardIndex = code.indexOf('<Card className="overflow-hidden border-slate-200/60 shadow-sm">', funcIndex);
  if (cardIndex !== -1) {
    const tabsUI = 
      "      <div className=\"flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide\">\n" +
      "        {filterOptions.map((opt) => (\n" +
      "          <button\n" +
      "            key={opt.value}\n" +
      "            onClick={() => setActiveTab(opt.value as any)}\n" +
      "            className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${\n" +
      "              activeTab === opt.value\n" +
      "                ? 'bg-emerald-600 text-white shadow-md'\n" +
      "                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'\n" +
      "            }`}\n" +
      "          >\n" +
      "            {opt.label}\n" +
      "          </button>\n" +
      "        ))}\n" +
      "      </div>\n";
      
    const before = code.substring(0, cardIndex);
    const after = code.substring(cardIndex);
    code = before + tabsUI + after;
  }
}

code = code.replace('saveMateriList(updated);', 'setMateriList(updated);');

fs.writeFileSync('src/pages/KamadPages.tsx', code);
