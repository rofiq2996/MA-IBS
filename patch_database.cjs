const fs = require('fs');
let content = fs.readFileSync('database.sql', 'utf8');

const oldTable = `CREATE TABLE \`sarpras\` (
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`item_name\` varchar(100) NOT NULL,
  \`code\` varchar(50) NOT NULL,
  \`category\` varchar(50) NOT NULL,
  \`quantity\` int NOT NULL,
  \`condition\` varchar(50) NOT NULL,
  \`room\` varchar(50) NOT NULL,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;`;

const newTable = `CREATE TABLE \`sarpras\` (
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`item_name\` varchar(100) NOT NULL,
  \`code\` varchar(50) NOT NULL,
  \`category\` varchar(50) NOT NULL,
  \`qty_baik\` int NOT NULL DEFAULT 0,
  \`qty_rusak_ringan\` int NOT NULL DEFAULT 0,
  \`qty_rusak_berat\` int NOT NULL DEFAULT 0,
  \`room\` varchar(50) NOT NULL,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;`;

content = content.replace(oldTable, newTable);

const oldInsert = `INSERT INTO \`sarpras\` (\`id\`, \`item_name\`, \`code\`, \`category\`, \`quantity\`, \`condition\`, \`room\`) VALUES
(1, 'Proyektor Epson EB-X400', 'Eps-PJ-01', 'Elektronik', 1, 'Baik', 'Ruang Kelas X MIPA 1'),
(2, 'Kursi Belajar Kayu Jati', 'Krs-KW-12', 'Mebel', 36, 'Baik', 'Ruang Kelas X MIPA 1'),
(3, 'AC Panasonic 1.5 PK', 'AC-Pan-03', 'Elektronik', 1, 'Rusak Ringan', 'Ruang Perpustakaan');`;

const newInsert = `INSERT INTO \`sarpras\` (\`id\`, \`item_name\`, \`code\`, \`category\`, \`qty_baik\`, \`qty_rusak_ringan\`, \`qty_rusak_berat\`, \`room\`) VALUES
(1, 'Proyektor Epson EB-X400', 'Eps-PJ-01', 'Elektronik', 1, 0, 0, 'Ruang Kelas X MIPA 1'),
(2, 'Kursi Belajar Kayu Jati', 'Krs-KW-12', 'Mebel', 36, 0, 0, 'Ruang Kelas X MIPA 1'),
(3, 'AC Panasonic 1.5 PK', 'AC-Pan-03', 'Elektronik', 0, 1, 0, 'Ruang Perpustakaan');`;

content = content.replace(oldInsert, newInsert);

fs.writeFileSync('database.sql', content);
