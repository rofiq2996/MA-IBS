const express = require('express');
const app = express();
app.all('/old', (req, res, next) => {
  req.url = '/new';
  next();
});
app.get('/new', (req, res) => {
  res.send('it works');
});
app.use((req, res) => res.status(404).send('not found'));
const server = app.listen(0, async () => {
  const fetch = (await import('node-fetch')).default;
  const res = await fetch(`http://localhost:${server.address().port}/old`);
  console.log(await res.text());
  server.close();
});
