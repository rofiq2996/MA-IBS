const fs = require('fs');

let sql = fs.readFileSync('database.sql', 'utf8');

// Strip out everything we don't need
sql = sql.replace(/int\([0-9]+\)/gi, 'INTEGER');
sql = sql.replace(/varchar\([0-9]+\)/gi, 'TEXT');
sql = sql.replace(/text/gi, 'TEXT');
sql = sql.replace(/enum\([^)]+\)/gi, 'TEXT');
sql = sql.replace(/datetime/gi, 'TEXT');
sql = sql.replace(/date/gi, 'TEXT');
sql = sql.replace(/time/gi, 'TEXT');
sql = sql.replace(/timestamp/gi, 'TEXT');
sql = sql.replace(/boolean/gi, 'INTEGER');
sql = sql.replace(/decimal\([0-9]+,[0-9]+\)/gi, 'REAL');

// AUTO_INCREMENT
sql = sql.replace(/`id` INTEGER NOT NULL AUTO_INCREMENT/gi, '`id` INTEGER PRIMARY KEY AUTOINCREMENT');

// Remove primary key / unique key definitions that are separate
sql = sql.replace(/,\s*PRIMARY KEY \(`id`\)/gi, '');
sql = sql.replace(/,\s*UNIQUE KEY `[^`]+` \(`[^`]+`\)/gi, '');
sql = sql.replace(/,\s*FOREIGN KEY [^\n]+/gi, '');

// ENGINE=InnoDB
sql = sql.replace(/\) ENGINE=InnoDB DEFAULT CHARSET=[^;]+;/gi, ');');

// MySQL specific settings
sql = sql.replace(/SET FOREIGN_KEY_CHECKS\s*=\s*[01];/gi, '');

const Database = require('better-sqlite3');
const db = new Database('local.db');

try {
  db.exec(sql);
  console.log('SQLite DB setup complete!');
} catch (e) {
  console.error('Error executing SQL:', e);
}
