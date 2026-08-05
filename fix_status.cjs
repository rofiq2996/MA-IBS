const mysql = require('mysql2/promise');
require('dotenv').config();

async function run() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  const [res] = await connection.query("UPDATE materi_ajar SET status = 'Terbit' WHERE status = '' OR status IS NULL OR status = 'Sudah Membuat'");
  console.log(res);
  
  await connection.end();
}

run();
