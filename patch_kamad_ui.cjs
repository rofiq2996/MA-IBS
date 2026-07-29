const fs = require('fs');
let code = fs.readFileSync('src/pages/KamadPages.tsx', 'utf8');

// Insert the tabs before the Card.
const tabsBlock = `
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {filterOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setActiveTab(opt.value as any)}
            className={\`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors \${
              activeTab === opt.value
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }\`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <Card`;
code = code.replace("<Card", tabsBlock);

fs.writeFileSync('src/pages/KamadPages.tsx', code);
