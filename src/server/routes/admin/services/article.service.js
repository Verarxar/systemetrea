const reducedService = require('../../../dataServices/reduced-db.service');
const jsonService = require('../../../dataServices/json.service');
const Reduced = require('../../../models/reduced.model');
const mongoose = require('mongoose');
const ReadPreference = require('mongodb').ReadPreference;
var Db = require('mongodb').Db;
var moment = require('moment');

function getStats(req, res) {
  const docquery = Reduced.find({}).read(ReadPreference.NEAREST);
  docquery
    .exec()
    .then(stats => {
      res.status(200).json(stats);
    }).catch(error => {
      res.status(500).send(error);
      return;
    });
  // reducedService.getStats().then(function(err, res) {
  //   res.status(200).send(res);
  // }).catch(handleError);
}

function compareArticles(req, res) {
  var fileNames = req.body.files;
  if(fileNames.length<1) {
    res.sendStatus(400).send("define name of file to compare");
    return;
  }
  console.log("fileNames", fileNames);
  
  jsonService.compareFromFiles(fileNames, function(res) {
    return res;
  }).then(function(data) {
    console.log("compareFromFiles response: ", data);
    res.status(200).send(data);
  });
}

function insertArticles(req, res) {
    var fileName = req.params.fileName;
    if(fileName.indexOf('sortimentfilen')<0) {
      res.status(500).send(customMessage);
      return;
    }
    jsonService.insertFromFile(fileName).then(function(data) {
      var reduced = {
          articleCount: data.articles,
          reducedCount: 0,
          apiFileDate: data.apiFileDate,
          articles: []
      };
      reducedService.saveStats(reduced, function(err, data) {
          res.status(200).send(data);
      });
    }).catch(function(err) {
      console.log("CATCH", err);
      res.sendStatus(500).send(err);
      return;
    });
}

function handleError(res, error, customMessage) {
  console.log("@article.service: " + customMessage);
  res.status(500).send(customMessage);
}
module.exports = {
  getStats,
  compareArticles,
  insertArticles
};

