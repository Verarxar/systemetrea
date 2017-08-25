var fs = require('fs');
var url = require('url');
var https = require('https');
var xml2js = require('xml2object');
var FILE_PATH = './src/server/data/';
var FILE_NAME = 'sortimentfilen.xml';
var SORTIMENTFILEN = FILE_PATH + FILE_NAME;
const XmlFile = require ('../models/xml.model.js');

function getXml(callback) {

    var XML_URL = 'https://www.systembolaget.se/api/assortment/products/xml';
    var logstatus = "";

    var options = {
        host: url.parse(XML_URL).host,
        port: 443,
        path: url.parse(XML_URL).pathname,
        method: 'GET'
    };
    
    console.log("\nDownload path: " + SORTIMENTFILEN);
    console.log("Connecting to: " + options.host + options.path);
    

    const writeStream = fs.createWriteStream(SORTIMENTFILEN);

    // var fileWriter = function(response) {
    //     response.on('data', function(d) {
    //         console.log("here1?");
    //         ws.write(d);
    //     });

    //     response.on('end', function() {
    //         console.log("here2?");
    //         ws.end();
    //         console.log(FILE_NAME + ' downloaded to ' + FILE_PATH);
    //         return callback(null);
    //     });

    //     response.on('error', function(e){
    //         console.log('problem with request: ' + e.message);
    //     });
    // };
    writeStream.on('open', function(fd) {
        fs.existsSync(SORTIMENTFILEN);
        console.log("downloading... \n");
        var request = https.request(options);
        request.on('response', function(dataStream) {
            if(dataStream.statusCode !== 200) {
                console.log("err contacting systembolaget api.", err);
            }            
            dataStream.on('data', function (chunk) {
                writeStream.write(chunk);
            });
            dataStream.on('error', function(err){
                console.log("err with https.request: ", err);
                writeStream.end();
                return callback(err);
            });
            dataStream.on('end', function() {
                console.log("THE END!");
                writeStream.end();
                callback(null);
            });
        });
        request.on('error', function(err){
            console.log("handling error like a pro");
        });
        request.end();
    });
};

function deleteFile(fileName, callback) {
    var file = FILE_PATH + fileName;
    fs.stat(file, function(err, stats) {
        console.log("fileStats: ", stats);
        if(err) {
            console.log("error when attempting to delete file.");
            console.log("fileName: " + fileName);
            console.log("file path: " + file);
            console.log("err: "+ err);
            return callback(err);
        }
        fs.unlink(file, function(err) {
            if(err) return callback(err);
            XmlFile.find({name: fileName}).remove(function(err){
                if(err) console.log("Remove file err: ", err);
            });
            return callback(null, stats);
        });
    })
}

function renameFile(callback) {
    const stats = fs.statSync(SORTIMENTFILEN);
    var stream = fs.createReadStream(SORTIMENTFILEN);
    var parser = new xml2js(['skapad-tid'], stream);
    var fileData = {};

    parser.on('object', function(name, obj) {
        console.log('Found an object: %s', name);
        var dateString = new Date(obj['$t'] || obj['$text']);
        var date = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2);
        var newFileName = "sortimentfilen" + "_" + date + ".xml";
        console.log("obj is: ", obj);
        console.log("date is: ", date);
        fs.rename(FILE_PATH + FILE_NAME, FILE_PATH + newFileName, function(err) {
            if (err) {
                console.log("@xml.service.js: in err, fs.rename", err);
                return callback(err);
            }
            fileData.name = newFileName;
            fileData.size = stats.size;
            fileData.apiFileDate = date;
            fileData.hasBeenRun = false;
        });
    });
    // Bind to the file end event to tell when the file is done being streamed
    parser.on('end', function() {
        console.log('Finished parsing xml!');
        callback(null, fileData);
    });

    // Start parsing the input stream
    parser.start();
};

function readFileNames(callback) {
    console.log("hello");
    var fileArray = [];
    return new Promise((resolve, reject) => {
        fs.readdir(FILE_PATH, function(err, fileNames) {
            files.forEach(function(file){

                var file = {
                    name: file,
                }
            })

            if (err) return reject(err);
            return resolve(filenames);
        });
  });
}

function getFileStats(callback) {
    console.log("hello");
    var fileArray = [];
    return new Promise((resolve, reject) => {
        fs.readdir(FILE_PATH, function(err, fileNames) {
            promiseAllP(fileNames, function(fileName, index, resolve, reject) {
                var fileLocation = FILE_PATH + fileName;
                fs.stat(fileLocation, function(err, stats) {
                    if(err) return callback(err);
                    return resolve(
                        {
                            name: fileName, 
                            size: stats.size,
                            apiFileDate: fileName.split(/_(.+)/)[1].split(".").shift(),
                            hasBeenRun: false
                        });
                });
            }).then(results => {
                return resolve(results);
            })
            .catch(error => {
                return reject(error);
            });
        });
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

module.exports = {
    readFileNames,
    deleteFile,
    renameFile,
    getFileStats,
    getXml
}
