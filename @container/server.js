'use strict';

const express = require('express');

const PORT = 8080;
const HOST = '0.0.0.0';

const app = express();
app.get('/', (_, res) => {
  res.send('Hello World');
});

app.post('/', (_, res) => {
  res.json({ message: 'Nice Post!' });
});

app.get('/health_check', (_, res) => {
  res.send('OK');
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
