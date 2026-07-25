const fs = require('fs');
let db = fs.readFileSync('database.sql', 'utf8');

const oldCreate = "CREATE TABLE `subjects` (\n  `id` int(11) NOT NULL AUTO_INCREMENT,\n  `name` varchar(100) NOT NULL,\n  PRIMARY KEY (`id`),\n  UNIQUE KEY `name` (`name`)\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";
const newCreate = "CREATE TABLE `subjects` (\n  `id` int(11) NOT NULL AUTO_INCREMENT,\n  `code` varchar(20) NOT NULL,\n  `name` varchar(100) NOT NULL,\n  `category` enum('Wajib', 'Muatan Lokal', 'Pilihan') DEFAULT 'Wajib',\n  `weekly_hours` int(11) DEFAULT 2,\n  PRIMARY KEY (`id`),\n  UNIQUE KEY `code` (`code`),\n  UNIQUE KEY `name` (`name`)\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";

const oldInsert = "INSERT INTO `subjects` (`id`, `name`) VALUES\n(1, 'Matematika'),\n(2, 'Fisika'),\n(3, 'Kimia'),\n(4, 'Bahasa Arab'),\n(5, 'Tahfizh Al-Quran'),\n(6, 'Fiqih'),\n(7, 'Akidah Akhlak');";

const newInsert = "INSERT INTO `subjects` (`id`, `code`, `name`, `category`, `weekly_hours`) VALUES\n(1, 'MTK-01', 'Matematika', 'Wajib', 4),\n(2, 'FIS-01', 'Fisika', 'Pilihan', 3),\n(3, 'KIM-01', 'Kimia', 'Pilihan', 3),\n(4, 'ARB-01', 'Bahasa Arab', 'Muatan Lokal', 2),\n(5, 'TFZ-01', 'Tahfizh Al-Quran', 'Muatan Lokal', 4),\n(6, 'FIQ-01', 'Fiqih', 'Wajib', 2),\n(7, 'AKD-01', 'Akidah Akhlak', 'Wajib', 2),\n(8, 'IND-01', 'Bahasa Indonesia', 'Wajib', 4),\n(9, 'ENG-01', 'Bahasa Inggris', 'Wajib', 4),\n(10, 'SJR-01', 'Sejarah', 'Wajib', 2),\n(11, 'PJK-01', 'Pendidikan Jasmani', 'Wajib', 2),\n(12, 'SNI-01', 'Seni Budaya', 'Muatan Lokal', 2),\n(13, 'PKN-01', 'Pendidikan Kewarganegaraan', 'Wajib', 2),\n(14, 'BIO-01', 'Biologi', 'Pilihan', 3),\n(15, 'EKO-01', 'Ekonomi', 'Pilihan', 3),\n(16, 'GEO-01', 'Geografi', 'Pilihan', 3),\n(17, 'SOS-01', 'Sosiologi', 'Pilihan', 3),\n(18, 'IKU-01', 'Ilmu Tafsir', 'Muatan Lokal', 2),\n(19, 'HAD-01', 'Ilmu Hadits', 'Muatan Lokal', 2),\n(20, 'SKD-01', 'Sejarah Kebudayaan Islam', 'Wajib', 2);";

if (db.includes(oldCreate)) {
  db = db.replace(oldCreate, newCreate);
} else {
  console.log("oldCreate not found");
}

if (db.includes(oldInsert)) {
  db = db.replace(oldInsert, newInsert);
} else {
  console.log("oldInsert not found");
}

fs.writeFileSync('database.sql', db);
