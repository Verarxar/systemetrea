
function getJSONFromXML(fileName, callback) {
  const parser = new Parser();
  rs = fs.createReadStream(DOWNLOAD_DIR + "/" + fileName);
  rs.on('error', (err) => {
     return callback(err);
  });

  rs.on('end', () => {
    callback(null, articles);
  });

  const articles = [];
 
  let article = null;
  let newArticleFound = false;
  let currentAttr = '';

  parser.on('text', (text) => {
    if (newArticleFound) {
      article[currentAttr] = text;
      if (!currentAttr) {
        console.log('currentAttribute should be set since newArticleFound is true. investigate pls');
      }
    } else if (recordDate) {
      article.lastSeen = (text.split(" ")[0]);
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
      // dbEntry.count++;
      article = {};
      newArticleFound = true;
    } else if (name === 'skapad-tid') {
      recordDate = true;
      article.lastSeen = '';
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