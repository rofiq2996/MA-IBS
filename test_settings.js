fetch('http://localhost:3000/api/keyval.php', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ key: 'school_lat_l', value: '-0.999' })
}).then(r => r.json()).then(console.log);
