var fs = require('fs');
var url = require('url');
var http = require('http');


exports.getXml = function(next) {

    //      var XML_URL = 'http://www.w3schools.com/xml/note.xml';
    //      var FILE_URL = 'http://www.systembolaget.se/api/assortment/products/xml';
    var XML_URL = 'http://www.systembolaget.se/api/assortment/products/xml';
    var DOWNLOAD_DIR = './server/services/dataServices/data';
    var FILE_NAME = 'sortimentfilen.xml';
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
    //var FILE_NAME = url.parse(xml_url).pathname.split('/').pop();
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