const fs = require('fs');
let content = fs.readFileSync('database.sql', 'utf8');

const badTable = `CREATE TABLE \`sarpras\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`item_name\` varchar(150) NOT NULL,
  \`code\` varchar(50) NOT NULL,
  \`category\` varchar(100) NOT NULL,
  \`quantity\` int(11) NOT NULL DEFAULT 1,
  \`condition\` enum('Baik', 'Rusak Ringan', 'Rusak Berat') DEFAULT 'Baik',
  \`room\` varchar(100) NOT NULL,
  \`created_at\` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`code\` (\`code\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`;

const goodTable = `CREATE TABLE \`sarpras\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`item_name\` varchar(150) NOT NULL,
  \`code\` varchar(50) NOT NULL,
  \`category\` varchar(100) NOT NULL,
  \`qty_baik\` int(11) NOT NULL DEFAULT 0,
  \`qty_rusak_ringan\` int(11) NOT NULL DEFAULT 0,
  \`qty_rusak_berat\` int(11) NOT NULL DEFAULT 0,
  \`room\` varchar(100) NOT NULL,
  \`created_at\` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`code\` (\`code\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`;

content = content.replace(badTable, goodTable);
fs.writeFileSync('database.sql', content);
