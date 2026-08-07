const fs = require('fs');
let file = fs.readFileSync('src/pages/GuruPages.tsx', 'utf8');

file = file.replace(/import \{ BarChart.*?from 'recharts';\n\n/, '');

if (!file.includes("import { BarChart")) {
   file = "import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';\n" + file;
}

fs.writeFileSync('src/pages/GuruPages.tsx', file);
