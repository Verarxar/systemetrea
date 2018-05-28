const dotenv = require('dotenv').config();

if (!process.env.NODE_ENV) {
  console.error(
    'ENV variables are missing.',
    'Verify that you have set them directly or in a .env file.'
  );
  process.exit(1);
}

console.log('dotevn', dotenv);
var express      = require('express');
var app          = express();
var bodyParser   = require('body-parser');
var logger       = require('morgan');
var path         = require('path');
var cookieParser = require('cookie-parser');

// var db 			 = require('./models/db');
var fs 			 = require('fs');

// services
const services = require('./services');
const logService = services.logService;

const publicweb = process.env.PUBLICWEB || './dist/publicweb';
const port = process.env.PORT || 9090;
const ip = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';

// TESTS \\
const debugService = services.debugService;
debugService.compareTest((err, result) => {
  if (err) {
    console.log('err', err);
  } else {
    console.log('Init operation successfull - result', result);
  }
});

app.use('/api', (req, res, next) => logService.mrcurious(req, res, next));
app.use('/api', require('./routes'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(publicweb));
app.use(logger('dev'));

// this middleware goes last to catches anything left
// in the pipeline and reports to client as an error
var header_ip;

app.get('*', (req, res) => {
   res.sendFile(`index.html`, { root: publicweb });
});

app.listen(port, ip, () => console.log(`API running on http://${ip}:${port}`));


