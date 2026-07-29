const mysql = require('mysql2/promise');
require('dotenv').config();

async function run() {
  let host = process.env.DB_HOST || 'localhost';
  let port = parseInt(process.env.DB_PORT || '3306');
  if (host.includes(':')) {
    const parts = host.split(':');
    host = parts[0];
    if (parts[1]) port = parseInt(parts[1], 10);
  }
  
  if (!process.env.DB_HOST) {
    console.log("No DB_HOST");
    return;
  }
  
  const pool = mysql.createPool({
    host, port,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  const [rows] = await pool.query('DESCRIBE schedules');
  console.log(rows);
  const [data] = await pool.query('SELECT * FROM schedules LIMIT 5');
  console.log(data);
  process.exit(0);
}
run();
