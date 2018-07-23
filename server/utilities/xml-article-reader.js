const fs = require('fs');
const Parser = require('node-xml-stream');

function getJSONFromXML(filePath, callback) {
  const parser = new Parser();
  rs = fs.createReadStream(filePath);
  rs.on('error', (err) => {
     return callback(err);
  });

  rs.on('end', () => {
    callback(null, articles);
  });

  const articles = [];
  let lastModified;
  let article = {};
  let newArticleFound = false;
  let currentAttr = '';

  parser.on('text', (text) => {
    if (newArticleFound) {
      article[currentAttr] = text;
      article.lastModified = new Date(lastModified);
      if (!currentAttr) {
        console.log('currentAttribute should be set since newArticleFound is true. investigate pls');
      }
    } else if (recordDate) {
      lastModified = text.split(" ")[0];
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
      currentAttr = setFirstCharToLowerCase(currentAttr);
      article[currentAttr] = '';
    } else if (name === 'artikel') {
      // dbEntry.count++;
      article = {};
      newArticleFound = true;
    } else if (name === 'skapad-tid') {
      recordDate = true;
    }
  });

  parser.on('closetag', (name, attrs) => {
    if (name === 'artikel') {
      newArticleFound = false;
      articles.push(article);
    }
  });
  rs.pipe(parser);
};

const setFirstCharToLowerCase = (string) => {
  const newValue = string.charAt(0).toLowerCase() + string.slice(1);
  return newValue;
}
module.exports = {
  getJSONFromXML
};
