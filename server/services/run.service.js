
const fileService = require('./file.service');
const dbService = require('./db.service');

function init() {
  getJSON((err, json) => {
    if (err) {
      console.log('err getting json', err);
    } else {
      saveData(json);
    }
  });
}

function saveData(json) {
  dbService.saveData(json, (err, res) => {
    if (err) {
      console.log('err saving db', err);
    } else {
      console.log('save db response', res);
    }
  });
}

function getXML() {
  fileService.getXML((err, file) => {
    console.log('err', err);
    console.log('file', file);
  });
}

function getJSON(callback) {
  fileService.getJSONFromXML('sortimentfilen.xml', ((err, dbEntry) => {
    if (err) {
      return callback(err);
      console.log('err during xml -> json', err);
    } else {
      callback(null, dbEntry);
      console.log('res from xml -> json ', dbEntry.count, 'articles', dbEntry.date);
    }
  }));
}

function renameFile() {
  fileService.renameFile((err, file) => {
    console.log('err', err);
    console.log('file', file);
  });
}
module.exports = {
  getXML,
  getJSON,
  init,
  renameFile
}
