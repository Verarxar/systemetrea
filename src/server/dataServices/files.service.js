const xmlService = require('./xml.service');
const XmlFile = require ('../models/xml.model.js');

function verifyWithDB() {
  xmlService.getFileStats(function(err, response) {
       return err || response;
  }).then(function(fileNames) {
     var promises = fileNames.map(function(file) {
          var update = { name: file.name, size: file.size, apiFileDate: file.apiFileDate };
          return XmlFile.findOneAndUpdate({name: file.name},update, {upsert: true, new: true, setDefaultsOnInsert: false}).exec();
     });
     Promise.all(promises).then(function(results) {
          //console.log("Promises.all res: ", results);
     });
     // var query = {};

     // var update = { expire: new Date() };
     // var options = { upsert: true, new: true, setDefaultsOnInsert: true };

     // // Find the document
     // Model.findOneAndUpdate(query, update, options, function(error, result) {
     // if (error) return;

     // // do something with the document
     // });       
    //  XmlFile.find({}, function(err, docs) {
    //       if(err) {
    //            console.log("XmlFile.find err: ", err);
    //       }
    //       fileNames.forEach(function(file) {

    //       });
    //       console.log("getFileStats result: ", fileNames.length);
    //       console.log("XmlFile.find result: ", docs.length);
          
    //  });
  }).catch(function(err){
      console.log("err getFileStats: ", err);
  });
}

function updateHasBeenRun(fileName, callback) {
     XmlFile.findOneAndUpdate({name: fileName}, { $set: {hasBeenRun: true}}, {new:true}, function(err, doc) {
          if(err) { 
            console.log("findOneAndUpdate err", err)
            return callback(err);
          };
          //saveReduced(fileName, response);
          console.log("Done updating xml's hasBeenRun: ", doc);
          return callback(null, doc);
     });
}

function getFileList(callback) {
  XmlFile.find({}, [], {sort: {apiFileDate: -1}}, function(err, docs) {
      if(err) {
            console.log("XmlFile.find err: ", err);
            return callback(err);
      }
      callback(null, docs);
  });
}

module.exports = {
  verifyWithDB,
  updateHasBeenRun,
  getFileList
};