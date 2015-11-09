var fs = require('fs');
//var xml2object = require('xml2object');
var XmlStream = require('xml-stream');
var Artikel = require('./../../models/artikel').Artikel;
var async = require('async');
var date;

/***********************
*   No longer used...  *
/***********************    
*/
exports.convert = function(XML_URL, next) {
    var artiklar = [];
    var artikelStr = ({
        nr: "",
        Artikelid: "",
        Varnummer: "",
        Namn: "",
        Namn2: "",
        Prisinklmoms: "",
        PrissanktProcent: "",
        Prishistorik: [{timestamp:"", pris:""}],
        Volymiml: "",
        PrisPerLiter: "",
        Saljstart: "",
        Slutlev: "",
        Varugrupp: "",
        Forpackning: "",
        Forslutning: "",
        Ursprung: "",
        Ursprunglandnamn: "",
        Producent: "",
        Leverantor: "",
        Argang: "",
        Provadargang: "",
        Alkoholhalt: "",
        Sortiment: "",
        Ekologisk: "", 
        Koscher: "",
        RavarorBeskrivning: "",
        Slut: false
    });
    var counter = 0;
    var stream = fs.createReadStream('./server/services/dataServices/data/' + XML_URL);
    var duplicates = 0;
    var parser = new XmlStream(stream);
    console.log("Scanning: " + XML_URL);
    parser.on('endElement: skapad-tid', function(obj) {
        date = new Date(obj['$text']);
        console.log("obj is: ", obj);
        console.log("obj['$text'] is: ", obj['$text']);
        console.log("date is: ", date);
    }); 
    
    
    parser.on('endElement: artikel', function(obj) {

        insertValues(obj, function(callback) {} );
        var artikel = new Artikel(artikelStr);
        artiklar.push(artikel);

        counter = (counter + 1);
        if (counter % 100 == 0 ) {
            parser.pause();
            async.each(artiklar, onInsert, function(err){
                if(err){
                    console.log("err in async: ", err);
                }
                if(counter % 2000 === 0){
                    console.log(counter / 200 + "%");
                }
                artiklar.length = 0;
                parser.resume();
            });
        }
    });

            
    // Bind to the file end event to tell when the file is done being streamed
    parser.on('endElement: artiklar', function() {
        

            async.each(artiklar, onInsert, function(err){
                artiklar.length = 0;
                if(err){
                    console.log("err in async: ", err);
                }
                console.log("Stored ", counter + " articles");
                console.log( "I'm finished now. Duplicates found: ", duplicates);
                next(null);                
            });
    });
    
    function insertValues(jsonObj, callback){
        
        artikelStr.nr = jsonObj.nr;
        artikelStr.Artikelid = jsonObj.Artikelid||"";
        artikelStr.Varnummer = jsonObj.Varnummer||"";
        artikelStr.Namn = jsonObj.Namn||"";
        artikelStr.Namn2 = jsonObj.Namn2||"";
        artikelStr.Prisinklmoms = jsonObj.Prisinklmoms||""; 
        artikelStr["Prishistorik"] = {timestamp: Date(), pris:jsonObj.Prisinklmoms||""};
        artikelStr.Volymiml = jsonObj.Volymiml||"";
        artikelStr.PrisPerLiter = jsonObj.PrisPerLiter||"";
        artikelStr.Saljstart = jsonObj.Saljstart||"";
        artikelStr.Slutlev = jsonObj.Slutlev||"";
        artikelStr.Varugrupp = jsonObj.Varugrupp||"";
        artikelStr.Forpackning = jsonObj.Forpackning||"";
        artikelStr.Forslutning = jsonObj.Forslutning||"";
        artikelStr.Ursprung = jsonObj.Ursprung||"";
        artikelStr.Ursprunglandnamn = jsonObj.Ursprunglandnamn||"";
        artikelStr.Producent = jsonObj.Producent||"";
        artikelStr.Leverantor = jsonObj.Leverantor||"";
        artikelStr.Argang = jsonObj.Argang||"";
        artikelStr.Provadargang = jsonObj.Provadargang||"";
        artikelStr.Alkoholhalt = jsonObj.Alkoholhalt||"";
        artikelStr.Sortiment = jsonObj.Sortiment||"";
        artikelStr.Ekologisk = jsonObj.Ekologisk||"";
        artikelStr.Koscher = jsonObj.Koscher||"";
        artikelStr.RavarorBeskrivning = jsonObj.RavarorBeskrivning||"";
        artikelStr.lastFound = date;
        callback(null);

    }
    //I probably have to rewrite this to something like the following: 
    /*
    Artikel.findOneAndUpdate({ Varnummer: Varnummer, timestamp: { $gte: startOfToday } }, 
    {Varnummer: Varnummer, Namn: Namn, Namn2: Namn2, timestamp: Date.now()},
    {upsert: true, sort: {timestamp: -1}}, 
    function(err, doc) {
        //do something with the results
    });
    
    */

    var onInsert = function(obj, callback){
    //http://javascriptplayground.com/blog/2013/06/think-async/
        obj.save(function(err){
            if(err.code === 11000){
                duplicates++;
            }
            else if(err){
                console.log("big error in  json.service2, on insert!");
                console.log(err);
                return callback(err);
            }

            callback();         
        });
    };
};

 /*
        for(var i in jsonObj){
            switch(i){
                case "nr": artikelStr.nr = jsonObj.nr||"";
                case "Artikelid": artikelStr.Artikelid = jsonObj.Artikelid||"";
                case "Varnummer": artikelStr.Varnummer = jsonObj.Varnummer||"";
                case "Namn": artikelStr.Namn = jsonObj.Namn||"";
                case "Namn2": artikelStr.Namn2 = jsonObj.Namn2||"";
                case "Prisinklmoms": artikelStr.Prisinklmoms = jsonObj.Prisinklmoms||""; artikelStr.Prishistorik = [{timestamp: Date(), pris:jsonObj.Prisinklmoms||""}]; break;
                case "Volymiml": artikelStr.Volymiml = jsonObj.Volymiml||"";
                case "PrisPerLiter": artikelStr.PrisPerLiter = jsonObj.PrisPerLiter||"";
                case "Saljstart": artikelStr.Saljstart = jsonObj.Saljstart||"";
                case "Slutlev": artikelStr.Slutlev = jsonObj.Slutlev||"";
                case "Varugrupp": artikelStr.Varugrupp = jsonObj.Varugrupp||"";
                case "Forpackning": artikelStr.Forpackning = jsonObj.Forpackning||"";
                case "Forslutning": artikelStr.Forslutning = jsonObj.Forslutning||"";
                case "Ursprung": artikelStr.Ursprung = jsonObj.Ursprung||"";
                case "Ursprunglandnamn": artikelStr.Ursprunglandnamn = jsonObj.Ursprunglandnamn||"";
                case "Producent": artikelStr.Producent = jsonObj.Producent||"";
                case "Leverantor": artikelStr.Leverantor = jsonObj.Leverantor||"";
                case "Argang": artikelStr.Argang = jsonObj.Argang||"";
                case "Provadargang": artikelStr.Provadargang = jsonObj.Provadargang||"";
                case "Alkoholhalt": artikelStr.Alkoholhalt = jsonObj.Alkoholhalt||"";
                case "Sortiment": artikelStr.Sortiment = jsonObj.Sortiment||"";
                case "Ekologisk": artikelStr.Ekologisk = jsonObj.Ekologisk||"";
                case "Koscher": artikelStr.Koscher = jsonObj.Koscher||"";
                case "RavarorBeskrivning": artikelStr.RavarorBeskrivning = jsonObj.RavarorBeskrivning||"";
            }
            
        }
 */      