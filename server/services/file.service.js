const fs = require('fs');
const url = require('url');
const https = require('https');
const Parser = require('node-xml-stream');

const FILE_NAME = 'sortimentfilen.xml';
const DOWNLOAD_DIR = './data';

function getXML(callback) {
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

function renameFile(callback) {
  const parser = new Parser();
  rs = fs.createReadStream(DOWNLOAD_DIR + "/" + FILE_NAME)
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

        fs.rename(DOWNLOAD_DIR + "/" + FILE_NAME, DOWNLOAD_DIR + '/xml/' + newFileName, function(err) {
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

function getJSONFromXML(fileName, callback) {
  const parser = new Parser();
  rs = fs.createReadStream(DOWNLOAD_DIR + "/" + fileName);
  rs.on('error', (err) => {
     return callback(err);
  });

  rs.on('end', () => {
    callback(null, dbEntry);
  });

  let dbEntry = {
    date: '',
    count: 0,
    articles: []
  };
  let article = null;
  let newArticleFound = false;
  let currentAttr = '';
  let date;

  parser.on('text', (text) => {
    if (newArticleFound) {
      article[currentAttr] = text;
      if (!currentAttr) {
        console.log('currentAttribute should be set since newArticleFound is true. investigate pls');
      }
    } else if (recordDate) {
      dbEntry.date = (text.split(" ")[0]);;
      recordDate = false;
    }
  });

  parser.on('opentag', (name, attrs) => {
    if (newArticleFound) {
      name = name.replace(/ /g,'')
      // Systembolaget skips a close tag if the tag has no value - usually for attrs
      // typ, namn2, stil and forslutning. In this case we should remove the '/' from the attr
      if ((name.indexOf('/') > 1)) {
        currentAttr = name.split('/')[0];
      } else {
        currentAttr = name;
      }
      article[currentAttr] = '';
    } else if (name === 'artikel') {
      dbEntry.count++;
      article = {};
      newArticleFound = true;
    } else if (name === 'skapad-tid') {
      recordDate = true;
      dbEntry.date = '';
    }
  });

  parser.on('closetag', (name, attrs) => {
    if (name === 'artikel') {
      newArticleFound = false;
      dbEntry.articles.push(article);
    }
  })
  rs.pipe(parser);
};

module.exports = {
  getJSONFromXML,
  getXML,
  renameFile
}
