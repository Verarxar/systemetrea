const mongoose = require('mongoose');
/**
 * Set to Node.js native promises
 * Per http://mongoosejs.com/docs/promises.html
 */
mongoose.Promise = global.Promise;

// Cosmos DB Connection String
// eslint-disable-next-line max-len
// &replicaSet=globaldb`;
const mongoUri = `mongodb://localhost:${
  process.env.PORT || 27017
}/systemetrea`;

// Local MongoDB Connection String
// const mongoUri = `mongodb://localhost:27017/heroes-db`;

function connect() {
  mongoose.set('debug', true);
  return mongoose.connect(mongoUri);
}

module.exports = {
  connect,
  mongoose
};