const fs = require('fs');
let content = fs.readFileSync('src/pages/AdminSarpras.tsx', 'utf8');

const regex = /let qtyBaik =.*?;[\s\S]*?if \(item\.quantityGood === undefined && item\.condition === undefined\) \{[\s\S]*?qtyBaik = Number\(item\.quantity\) \|\| 0;\n\s*\}/m;

const newMapping = `let qtyBaik = Number(item.qty_baik || item.quantityGood || 0);
             let qtyRusakRingan = Number(item.qty_rusak_ringan || item.quantityLight || 0);
             let qtyRusakBerat = Number(item.qty_rusak_berat || item.quantityHeavy || 0);
             
             if (!item.qty_baik && !item.qty_rusak_ringan && !item.qty_rusak_berat && item.condition) {
                 if (item.condition === 'Baik') qtyBaik = Number(item.quantity) || 0;
                 if (item.condition === 'Rusak Ringan') qtyRusakRingan = Number(item.quantity) || 0;
                 if (item.condition === 'Rusak Berat') qtyRusakBerat = Number(item.quantity) || 0;
             }`;

content = content.replace(regex, newMapping);
fs.writeFileSync('src/pages/AdminSarpras.tsx', content);
