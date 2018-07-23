const path = require('path');
const fs = require('fs');
const DEFAULT_FILE_NAME = 'sortimentfilen.xml';
const DOWNLOAD_DIR = path.resolve(process.cwd(), 'server', 'data', 'tmp');
const Parser = require('node-xml-stream');

function renameFile(fileName, callback) {
  const parser = new Parser();
  console.log('fileName', fileName);
  const FILE_NAME = fileName || DEFAULT_FILE_NAME;
  const FILE_PATH = path.join(DOWNLOAD_DIR, FILE_NAME)
  rs = fs.createReadStream(FILE_PATH);
  rs.on('error', function(err) {
    return callback(err);
  });

  let attrFound = false;
  let date;

  parser.on('text', (text) => {
    if (attrFound) {
      attrFound = false;
      date = (text.split(" ")[0]);

      var newFileName = "sortimentfilen" + "_" + date + ".xml";
      fs.rename(FILE_PATH, path.join(DOWNLOAD_DIR, '..', newFileName), function(err) {
        if ( err ) {
          console.log("@xml.service.js: in err, fs.rename", err);
          return callback(err);
        }
        rs.destroy();
        callback(null, newFileName);
      });
     }
  });

  parser.on('opentag', (name, attrs) => {
     if (name === 'skapad-tid') {
        attrFound = true;
     }
  });
 
  rs.pipe(parser);
}

module.exports = {
  renameFile
}