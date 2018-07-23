const mongoose = require('mongoose');
var gracefulShutdown;
/**
 * Set to Node.js native promises
 * Per http://mongoosejs.com/docs/promises.html
 */
mongoose.Promise = global.Promise;

const mongoUri = `mongodb://localhost:${
  process.env.PORT || 27017
}/systemetrea`;

mongoose.set('debug', false);
mongoose.connect(mongoUri);

mongoose.connection.on('connected', function () {
  console.log(`mongoose connected to ${mongoUri}`);
});
mongoose.connection.on('error',function (err) {
  console.log('Mongoose default connection error: ' + err);
});
mongoose.connection.on('disconnected', function () {
  console.log('Mongoose default connection disconnected');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function() {
  mongoose.connection.close(function () {
    console.log('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});
gracefulShutdown = function(msg, callback) {
  mongoose.connection.close(function() {
    console.log('Mongoose disconnected through ' + msg);
    callback();
  });
};
// For nodemon restarts
process.once('SIGUSR2', function() {
  gracefulShutdown('nodemon restart', function() {
    process.kill(process.pid, 'SIGUSR2');
  });
});

require('./user.model');
require('./article.model');
require('./reduced.model');
