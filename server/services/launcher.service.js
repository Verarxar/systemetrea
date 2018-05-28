const services = require('./');
const downloadService = services.downloadService;

function runAll(callback) {
  downloadService.getXML((err, file) => {
    if (err) {
      console.log('err fetching xml', err);
      return callback(err);
    }
    callback(null, file);
  });
}

module.exports = {
  runAll
}
