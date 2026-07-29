const fs = require('fs');
let code = fs.readFileSync('src/pages/KamadPages.tsx', 'utf8');

// Update Grid for stats
code = code.replace(
  '<div className="grid grid-cols-2 md:grid-cols-4 gap-4">',
  '<div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">'
);
code = code.replace(/<div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">/g, '<div className="bg-white p-3 sm:p-4 rounded-xl border border-slate-200 shadow-sm">');
code = code.replace(/<div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 shadow-sm">/g, '<div className="bg-emerald-50 p-3 sm:p-4 rounded-xl border border-emerald-100 shadow-sm">');
code = code.replace(/<div className="bg-amber-50 p-4 rounded-xl border border-amber-100 shadow-sm">/g, '<div className="bg-amber-50 p-3 sm:p-4 rounded-xl border border-amber-100 shadow-sm">');
code = code.replace(/<div className="bg-rose-50 p-4 rounded-xl border border-rose-100 shadow-sm">/g, '<div className="bg-rose-50 p-3 sm:p-4 rounded-xl border border-rose-100 shadow-sm">');

code = code.replace(/<p className="text-2xl font-black text-slate-800">/g, '<p className="text-xl sm:text-2xl font-black text-slate-800 mt-1">');
code = code.replace(/<p className="text-2xl font-black text-emerald-700">/g, '<p className="text-xl sm:text-2xl font-black text-emerald-700 mt-1">');
code = code.replace(/<p className="text-2xl font-black text-amber-700">/g, '<p className="text-xl sm:text-2xl font-black text-amber-700 mt-1">');
code = code.replace(/<p className="text-2xl font-black text-rose-700">/g, '<p className="text-xl sm:text-2xl font-black text-rose-700 mt-1">');

code = code.replace(/<p className="text-xs font-bold text-slate-500 mb-1">/g, '<p className="text-[10px] sm:text-xs font-bold text-slate-500 leading-tight">');
code = code.replace(/<p className="text-xs font-bold text-emerald-600 mb-1">/g, '<p className="text-[10px] sm:text-xs font-bold text-emerald-600 leading-tight">');
code = code.replace(/<p className="text-xs font-bold text-amber-600 mb-1">/g, '<p className="text-[10px] sm:text-xs font-bold text-amber-600 leading-tight">');
code = code.replace(/<p className="text-xs font-bold text-rose-600 mb-1">/g, '<p className="text-[10px] sm:text-xs font-bold text-rose-600 leading-tight">');


// Update Tabs
const oldTabs = `      <div className="flex flex-wrap items-center gap-2 pb-2">
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
      </div>`;

const newTabs = `      <div className="flex flex-wrap sm:flex-nowrap items-center gap-1.5 sm:gap-2 pb-1 sm:pb-2 sm:overflow-x-auto scrollbar-hide">
        {filterOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setActiveTab(opt.value as any)}
            className={\`px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-lg text-[10px] sm:text-xs font-bold whitespace-nowrap transition-colors flex-1 sm:flex-none \${
              activeTab === opt.value
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }\`}
          >
            {opt.label}
          </button>
        ))}
      </div>`;

code = code.replace(oldTabs, newTabs);


// Update List layout
const oldListLayout = `                <div key={index} className="p-4 sm:p-6 hover:bg-slate-50 transition-colors">
                  <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold uppercase shrink-0">
                        {staf.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{staf.name}</p>
                        <p className="text-xs text-slate-500">{staf.role} {staf.kelas !== '-' ? \`• \${staf.kelas}\` : ''}</p>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                      <div className={\`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border \${summary.color}\`}>
                        <SummaryIcon className="w-4 h-4" />
                        {summary.label}
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-xs font-bold gap-2 text-indigo-700 border-indigo-200 hover:bg-indigo-50 w-full sm:w-auto"
                        onClick={() => setSelectedStaf(staf)}
                      >
                        <Eye className="w-4 h-4" />
                        View Jobdesk
                      </Button>
                    </div>
                  </div>
                </div>`;

const newListLayout = `                <div key={index} className="p-3 sm:p-5 hover:bg-slate-50 transition-colors">
                  <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
                    <div className="flex items-center justify-between w-full sm:w-auto">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 text-xs sm:text-sm font-bold uppercase shrink-0">
                          {staf.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm sm:text-base font-bold text-slate-800 leading-tight">{staf.name}</p>
                          <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5">{staf.role} {staf.kelas !== '-' ? \`• \${staf.kelas}\` : ''}</p>
                        </div>
                      </div>
                      
                      <div className="sm:hidden shrink-0 ml-2">
                        <div className={\`inline-flex items-center gap-1 px-1.5 py-1 rounded border \${summary.color}\`}>
                          <SummaryIcon className="w-3 h-3" />
                          <span className="text-[9px] font-bold tracking-tight">{summary.label}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto mt-1 sm:mt-0 border-t border-slate-100 sm:border-0 pt-2 sm:pt-0">
                      <div className={\`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border \${summary.color}\`}>
                        <SummaryIcon className="w-4 h-4" />
                        {summary.label}
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-[10px] sm:text-xs font-bold gap-1.5 text-indigo-700 border-indigo-200 hover:bg-indigo-50 w-full sm:w-auto h-8 sm:h-9"
                        onClick={() => setSelectedStaf(staf)}
                      >
                        <Eye className="w-3.5 h-3.5 shrink-0" />
                        Lihat Jobdesk
                      </Button>
                    </div>
                  </div>
                </div>`;

code = code.replace(oldListLayout, newListLayout);

fs.writeFileSync('src/pages/KamadPages.tsx', code);
