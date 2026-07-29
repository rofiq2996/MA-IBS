const http = require('http');
http.get('http://localhost:3000/api/get_cols.php', (resp) => {
  let data = '';
  resp.on('data', (chunk) => { data += chunk; });
  resp.on('end', () => { console.log(data); });
});
