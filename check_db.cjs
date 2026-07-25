const mysql = require('mysql2/promise');
require('dotenv').config();

let host = process.env.DB_HOST || 'localhost';
let port = parseInt(process.env.DB_PORT || '3306');
if (host.includes(':')) {
  const parts = host.split(':');
  host = parts[0];
  if (parts[1]) {
    const parsedPort = parseInt(parts[1], 10);
    if (!isNaN(parsedPort)) {
      port = parsedPort;
    }
  }
}

const dbConfig = {
  host,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'test',
  port
};

async function main() {
  try {
    const conn = await mysql.createConnection(dbConfig);
    const [tables] = await conn.query('SHOW TABLES');
    console.log(tables);
    
    // Check sarpras table
    const [sarpras] = await conn.query('SELECT * FROM sarpras LIMIT 5').catch(e => [[{error: e.message}]]);
    console.log('Sarpras:', sarpras);
    
    conn.end();
  } catch (e) {
    console.error(e);
  }
}
main();
