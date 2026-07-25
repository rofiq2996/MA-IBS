const fs = require('fs');
let code = fs.readFileSync('src/pages/Login.tsx', 'utf8');

code = code.replace(
  '<h2 className="text-base md:text-2xl font-bold mb-2 md:mb-8">Keutamaan Menuntut Ilmu</h2>',
  '<h2 className="text-lg md:text-2xl font-bold mb-2 md:mb-8">Keutamaan Menuntut Ilmu</h2>'
);

code = code.replace(
  '<div className="mb-2 md:mb-6">',
  '<div className="hidden md:block mb-2 md:mb-6">'
);

code = code.replace(
  '<p className="text-[10px] md:text-base italic mb-1 md:mb-4 opacity-90 max-w-[280px] md:max-w-sm px-2">',
  '<p className="text-xs md:text-base italic mb-1 md:mb-4 opacity-90 max-w-[280px] md:max-w-sm px-2">'
);

code = code.replace(
  '<p className="text-[10px] md:text-sm font-bold opacity-80">(HR. Muslim)</p>',
  '<p className="text-xs md:text-sm font-bold opacity-80">(HR. Muslim)</p>'
);

fs.writeFileSync('src/pages/Login.tsx', code);
console.log("Patched successfully");
