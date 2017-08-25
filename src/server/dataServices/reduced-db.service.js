var Reduced = require('../models/reduced.model');
var async = require('async');

function getStats(callback) {
     Reduced.find({}, function(err, res) {
          console.log("err: ", err);
          console.log("res: ", res);
          return callback(res);
     });
}

function saveStats(reducedObject, callback) {
     const reduced = new Reduced(reducedObject);
     reduced.save().then(function(err, doc) {
          callback(null, doc);
     });
}

module.exports = {
     getStats,
     saveStats
};