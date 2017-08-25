const mongoose = require('mongoose');
/**
 * Set to Node.js native promises
 * Per http://mongoosejs.com/docs/promises.html
 */
mongoose.Promise = global.Promise;

const env = require('./env/local');
console.log("env: ", env);

// eslint-disable-next-line max-len
//const mongoUri = `mongodb://${env.dbName}:${env.key}@${env.dbName}.documents.azure.com:${env.cosmosPort}/?ssl=true&replicaSet=globaldb`; //&replicaSet=globaldb`;
mongoUri = `mongodb://${env.host}:${env.port}`;
console.log("mongoUri", mongoUri);
function connect() {
 mongoose.set('debug', true);
 return mongoose.connect(mongoUri, { useMongoClient: true });
}

module.exports = {
  connect,
  mongoose
};