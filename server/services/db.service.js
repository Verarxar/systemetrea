const Sortimentfil = require('../models/sortimentfil.model');

function saveData(data, callback) {
  const sortiment = new Sortimentfil(data);
  sortiment.save((err, res) => {
    if(err) {
      console.log('err saving to db', err);
      return callback(err);
    }
    callback(res);
  });
}

module.exports = {
  saveData
}