const fs = require('fs');
const url = require('url');
const https = require('https');
const path = require('path');
const Parser = require('node-xml-stream');

const FILE_NAME = 'sortimentfilen.xml';
const DOWNLOAD_DIR = path.resolve('server', 'data', 'tmp');

function getSortimentfilen(callback) {
  const XML_URL = 'https://www.systembolaget.se/api/assortment/products/xml';

   const options = {
       host: url.parse(XML_URL).host,
       port: 443,
       path: url.parse(XML_URL).pathname,
       method: 'GET'
   };

   console.log("\nDownload path: " + DOWNLOAD_DIR + "/" + FILE_NAME);
   console.log("Connecting to: " + options.host + options.path);
   console.log("downloading... \n");

   // Create folder if it doesn't exist
   if (!fs.existsSync(DOWNLOAD_DIR)){
    fs.mkdirSync(DOWNLOAD_DIR);
   }
   const file = fs.createWriteStream(DOWNLOAD_DIR + "/" + FILE_NAME);
   const fileWriter = function(response) {
     response.on('data', function(d) {
        file.write(d);
     });

     response.on('end', function() {
        file.end();
        console.log(FILE_NAME + ' downloaded to ' + DOWNLOAD_DIR);
        callback(null, FILE_NAME);
     });

     response.on('error', function(err){
        console.log('Err while downloading XML file', FILE_NAME);
        return callback(err);
     });
  };
  https.request(options, fileWriter).end();
}

module.exports = {
  getSortimentfilen
}