var fs = require('fs');
const path = require('path');

function copyXMLFile() {
  const WRITE_DESTINATION = path.resolve(process.cwd(), 'server', 'data', 'tmp');
  console.log('WRITE_DESTINATION', WRITE_DESTINATION);
  fs.createReadStream('../data/small.xml').pipe(fs.createWriteStream(WRITE_DESTINATION + '/small.xml'));
}

function checkFileExist(path) {
  let fileExist = fs.existsSync(path);
  return fileExist;
}

module.exports = {
  copyXMLFile,
  checkFileExist
}