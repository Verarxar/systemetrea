var fs = require('fs');
var artikelDB = require('./article-db.service');
var xml2js = require('xml2object');
var async = require('async');
var articleSkeleton = require('./article.structure');
var date = "";
var arraypos = 0;
var FILE_PATH = './src/server/data/';
var FILE_NAME = '';
var insertMethod = null;
var isBusy = false;
var Article = require('../models/article.model');
var Reduced = require('../models/reduced.model');
const XmlFile = require ('../models/xml.model.js');
var filesService = require('./files.service');
var moment = require('moment');

function beginScan() {
    isBusy = true;
    return new Promise(function (resolve, reject) {
        var responseObject = {};
        var SORTIMENTFILEN = FILE_PATH + FILE_NAME;
        var readStream = fs.createReadStream(SORTIMENTFILEN);
        var artiklar = [];
        var counter = 0;
        var artikelObj = articleSkeleton.current();
        var parser = new xml2js(['skapad-tid', 'artikel'], readStream);

        parser.on('object', function(name, obj) {
            if(name === 'skapad-tid') {
                var dateString = obj['$t'] || obj['$text'];
                responseObject.created = dateString;
                responseObject['$t'] = obj;
                var date = new Date(dateString);
            } else if(name === 'artikel') {
                artikelObj.nr = obj.nr;
                artikelObj.artikelid = obj.Artikelid || null;
                artikelObj.varnummer = obj.Varnummer || null;
                artikelObj.namn = obj.Namn || null;
                artikelObj.namn2 = obj.Namn2 || null;
                artikelObj.prisinklmoms = obj.Prisinklmoms || null; 
                artikelObj.volymiml = obj.Volymiml || null;
                artikelObj.prisPerLiter = obj.PrisPerLiter || null;
                artikelObj.saljstart = obj.Saljstart || null;
                artikelObj.slutlev = obj.Utgått || obj.Slutlev || null;
                artikelObj.varugrupp = obj.Varugrupp || null;
                artikelObj.typ = obj.typ || null;
                artikelObj.stil = obj.stil || null;
                artikelObj.forpackning = obj.Forpackning || null;
                artikelObj.forslutning = obj.Forslutning || null;
                artikelObj.ursprung = obj.Ursprung || null;
                artikelObj.ursprunglandnamn = obj.Ursprunglandnamn || null;
                artikelObj.producent = obj.Producent || null;
                artikelObj.leverantor = obj.Leverantor || null;
                artikelObj.argang = obj.Argang || null;
                artikelObj.provadargang = obj.Provadargang || null;
                artikelObj.alkoholhalt = obj.Alkoholhalt || null;
                artikelObj.sortiment = obj.Sortiment || null;
                artikelObj.sortimenttext = obj.SortimentText || null;
                artikelObj.ekologisk = obj.Ekologisk || null;
                artikelObj.etiskt = obj.Etiskt || null;
                artikelObj.koscher = obj.Koscher || null;
                artikelObj.ravarorBeskrivning = obj.RavarorBeskrivning || null;
                artikelObj.siteData.priceHistory = {timestamp: Date(), pris:obj.Prisinklmoms || null};
                artikelObj.siteData.lastFound = date;
                artikelObj.siteData.pricePercent = Number,
                artikelObj.siteData.exists = true;

                artiklar.push(JSON.parse(JSON.stringify(artikelObj)));
                counter = (counter + 1);
                if (counter % 1000 == 0 ) {
                    readStream.pause();
                    console.log("********************************************");
                    console.log("********          PAUSED          **********");
                    console.log("********************************************");
                    insertMethod(artiklar, function(err, result) {
                        if(err) {
                            console.log("SHIT, ERROR!");
                            return reject(err);
                        }
                        console.log("GREAT NO ERROR");
                        artiklar = [];
                        readStream.resume();
                        console.log("********************************************");
                        console.log("*********        RESUMED          **********");
                        console.log("********************************************");
                    });
                }
            } else {
                responseObject[name] = "Object type: " + name + " should not have been found";
            }
        });
        
        parser.on('end', function() {
            console.log("Remaining objects:", counter);
            if (!(counter % 1000 == 0)) {
                insertMethod(artiklar, function(errorCode, data) {
                    if(errorCode) {
                        console.log("parser.on 'end', response: ", data);
                        return reject(errorCode);
                    }
                    responseObject.total = counter;
                    readStream.destroy();
                    return resolve(responseObject);                    
                });
            }else {
                console.log("why on earth are you in here?");
            }

        });

        parser.on('error', reject);
        parser.start();
    });
};

function compareFromFiles(fileNames, callback) {
    insertMethod = insertIndividual;
    return new Promise((resolve, reject) => {
        promiseAllP(fileNames, function(fileName, index, resolve, reject) {
            FILE_NAME = fileName;
            console.log("¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤");
            console.log("beginScan of file: ", fileName);
            console.log("¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤");
            beginScan().then(function(res) {
                console.log("*********************************************");
                console.log("beginScan of file: ", fileName, "-- Completed");
                console.log("*********************************************");
                filesService.updateHasBeenRun(fileName, function(err, data) {
                    resolve(data);
                });
            }).catch(function(err){
                return callback(err);
            });
        }).then(results => {
            isBusy = false;
            return resolve(results);
        })
        .catch(error => {
            isBusy = false;
            return reject(error);
        });
    });
}

function insertFromFile(fileName) {
    FILE_NAME = fileName;
    insertMethod = insertCollection;
    return new Promise(function(resolve, reject) {
        if(isBusy || !fileName) {
            console.log("isbusy", isBusy, "filename: ", fileName);
            return reject( "service is busy or no filename was included");
        }
        console.log("################################");
        console.log("######## BEGIN SCAN   ########");
        console.log("################################");
        beginScan().then(function(response) {
            var responseData = {
                articles: response.total
            }
            isBusy = false;
            filesService.updateHasBeenRun(fileName, function(err, doc) {
                if(err) {
                    console.log("updateHasBeenRun err", err);
                }
                responseData.apiFileDate = doc.apiFileDate;
                filesService.getFileList(function(err, list) {
                    if(err) {
                        console.log("getFileList err", err);
                    }
                    responseData.fileList = list;
                    resolve(responseData);
                });
            });
        }).catch(function(err) {
            console.log("***************************************");
            isBusy = false;
            return reject(err);
        });
    });
}

function saveReduced(fileName, data) {
    conosle.log("you're here now");
    XmlFile.findOneAndUpdate({name: fileName}, {hasBeenRun: true}, {new: true, upsert: true}, function(error, result) {
        if(error) {
            console.log("error updating hasBeenRun: ", error);
        }
        console.log("Done updating xml's hasBeenRun: ", result);
    });
    var reduced = new Reduced({
        articleCount: data.total,
        reducedCount: 0,
        apiFileDate: moment(data.created).format('YYYY-MM-DD'),
        articles: []
    });
    reduced.save(function(err, product, numAffected) {
        if(err) {
            console.log("** reduced.save **");
            return;
        }
    });

}
function insertCollection(data, callback) {
    Article.create(data, function(err, results) {
        if (err && err.code !== 11000) {
            console.log("errr whwtttt: ", err);
            return callback(err.code);
        }
        callback(null, results);
    });
}

function promiseAllP(items, block) {
    var promises = [];
    items.forEach(function(item,index) {
        promises.push( function(item,i) {
            return new Promise(function(resolve, reject) {
                return block.apply(this,[item,index,resolve,reject]);
            });
        }(item,index))
    });
    return Promise.all(promises);
}

function insertIndividual(list, callback) {
    var counter = 0;
    var promises = [];
    var data = [];
    list.forEach(function(article) {
        var newArticle = article;
        promises.push(function(callback) { artikelDB.comparePrices(newArticle, callback) });
    });
    async.series(promises, function(err, result) {
        return callback(err);
        console.log("async.each in json.service encountered an error: ", err);
    });
    // return new Promise(((resolve, reject) => {
    //     promiseAllP(list, function(article, index, resolve, reject) {
    //         artikelDB.comparePrices(article, (function(err, data) {
    //             if(err && err === 'next') {
    //                 console.log("logging err in onInsert: ", err);
    //                 return resolve();
    //             } else if(err) {
    //                 return reject(err);
    //             }
    //             counter++;
    //             console.log("compare done:", counter);
    //             return resolve(data);
    //         }));
    //     }).then(results => {
    //         return resolve(results);
    //     })
    //     .catch(error => {
    //         return reject(error);
    //     });
    // }));
}

// function insertCompare(obj, callback) {
//     arraypos++;
//     if(arraypos%2000 == 0){ console.log(arraypos/200 + "%");}
//     artikelDB.comparePrices(obj, (function(err, data) {
//         if(err && err === 'next') {
//             console.log("logging err in onInsert: ", err);
//             return callback(err);
//         }
//         callback(null, data);
//     }));
// };

function handleError(error, customMessage) {
  if(error === 11000) {
    console.error("@admin.service: " + customMessage);
    return 'duplicate. user compare instead of instert.';
  }
  return error;
}

module.exports = {
    compareFromFiles,
    insertFromFile,
    beginScan
}