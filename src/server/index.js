const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const routes = require('./routes');
const root = './';
const filesService = require('./dataServices/files.service.js');
const app = express();
require('./mongo').connect();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(root, 'dist')));
app.use('/api', routes);
filesService.verifyWithDB();
app.get('*', (req, res) => {
  res.sendFile('dist/index.html', {root: root});
});

const port = process.env.PORT || '3000';
app.listen(port, () => console.log(`API running on localhost:${port}`));
