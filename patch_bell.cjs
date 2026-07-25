const fs = require('fs');
let code = fs.readFileSync('src/components/layout/AppLayout.tsx', 'utf8');

code = code.replace(
  '<div className="relative flex items-center justify-center w-8 h-8 rounded-full hover:bg-slate-100 cursor-pointer text-slate-600 transition-colors">\n                <Bell className="w-5 h-5" />\n                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>\n              </div>',
  '<button onClick={() => navigate(\'/notifications\')} className="relative flex items-center justify-center w-8 h-8 rounded-full hover:bg-slate-100 cursor-pointer text-slate-600 transition-colors">\n                <Bell className="w-5 h-5" />\n                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>\n              </button>'
);

fs.writeFileSync('src/components/layout/AppLayout.tsx', code);
console.log("Patched successfully");
