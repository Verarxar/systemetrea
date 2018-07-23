'use strict';

const express = require('express');
const passport = require('passport');
const session = require('express-session');
const bodyParser = require('body-parser');
const routes = require('./routes');
const logging = require('./utilities/logging');
// const config = require('./config');
const publicweb = process.env.PUBLICWEB || './dist/publicweb';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(publicweb));
app.disable('etag');

require('./services/automation.service').init();
require('./config/passport');

// [START session]
// Configure the session and session storage.
// const sessionConfig = {
//   resave: false,
//   saveUninitialized: false,
//   secret: config.get('SECRET'),
//   signed: true
// };

// app.use(session(sessionConfig));
// [END session]

// OAuth2
app.use(passport.initialize());
// app.use(passport.session());
// app.use(require('./routes/oauth2').router);

app.use(logging.requestLogger);
app.use('/api', routes);
app.get('*', (req, res) => {
   res.sendFile(`index.html`, { root: publicweb });
});

const port = process.env.PORT || 9090;
const ip = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';

app.listen(port, ip, () => console.log(`API running on http://${ip}:${port}`));


