var mongoose     = require('mongoose');
var config = require('./../../config');
var dbURI = config.database;


// Bring Mongoose into the app
var mongoose = require( 'mongoose' );
//
// Create the database connection
try {
  mongoose.connect(dbURI);
  console.log("Trying to connect to DB " + config.database);
} catch (err) {
  console.log("Sever initialization failed " , err.message);
}
// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function () {
  console.log('Mongoose default connection open to ' + dbURI);
});

// If the connection throws an error
mongoose.connection.on('error',function (err) {
  console.log('Mongoose default connection error: ' + err);
});

// When the connection is disconnected
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

