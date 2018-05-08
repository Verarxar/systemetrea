var fs = require('fs');
var url = require('url');
var http = require('http');
var Parser = require('node-xml-stream');
let parser = new Parser();
var FILE_NAME = 'sortimentfilen.xml';
exports.getXml = function(next) {

    var XML_URL = 'http://www.systembolaget.se/api/assortment/products/xml';
    var DOWNLOAD_DIR = './server/services/dataServices/data';

    var logstatus = "";

    var options = {
        host: url.parse(XML_URL).host,
        port: 80,
        path: url.parse(XML_URL).pathname,
        method: 'GET'
    };

    console.log("\nDownload path: " + DOWNLOAD_DIR + "/" + FILE_NAME);
    console.log("Connecting to: " + options.host + options.path);
    console.log("downloading... \n");

    var file = fs.createWriteStream(DOWNLOAD_DIR + "/" + FILE_NAME);


    var fileWriter = function(response) {
        response.on('data', function(d) {
            file.write(d);
        });

        response.on('end', function() {
            file.end();
            console.log(FILE_NAME + ' downloaded to ' + DOWNLOAD_DIR);
            return next(null);
        });

        response.on('error', function(e){
            console.log('problem with request: ' + e.message);
        });
    };
    http.request(options, fileWriter).end();



};

exports.renameXml = function(next) {
    let stream = fs.createReadStream('./server/services/dataServices/data/' + FILE_NAME);
    stream.pipe(parser);
    var date;
    parser.on('endElement: skapad-tid', function(obj) {
        date = new Date(obj['$text']);
        var newFileName = "sortimentfilen" + "_" + date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2) + ".xml";
        console.log("obj is: ", obj);
        console.log("obj['$text'] is: ", obj['$text']);
        console.log("date is: ", date);
        fs.rename('./server/services/dataServices/data/' + FILE_NAME, './server/services/dataServices/data/' + newFileName, function(err) {
            if ( err ) {
                console.log("@xml.service.js: in err, fs.rename", err);
                return next(err);
            }
            next(null, newFileName);
        });
    });
};
