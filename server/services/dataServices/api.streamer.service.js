var fs = require('fs');
var artikelDB = require('./artikel.db.service');
var XmlStream = require('xml-stream');
var async = require('async');

exports.beginScan = function(next) {
    //var write_URL = './server/services/dataServices/data/' + 'db.json';
    //var writer = fs.createWriteStream('../server/data/' + 'db.json',{flags: 'a'});
    var stream = fs.createReadStream('./server/services/dataServices/data/' + 'sortimentfilen.xml');
    var artiklar = [];
    var pushNotifications = 0;
    var arr = [];
    var counter = 0;
    var artikelStr = {};
    /*
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
        lastFound: new Date()
    });
*/
    var parser = new XmlStream(stream);
    
    
    parser.on('endElement: artikel', function(obj) {
        
        
        artikelStr.nr = obj["nr"];
        artikelStr.Artikelid = obj["Artikelid"]||"";
        artikelStr.Varnummer = obj["Varnummer"]||"";
        artikelStr.Namn = obj["Namn"]||"";
        artikelStr.Namn2 = obj["Namn2"]||"";
        artikelStr.Prisinklmoms = obj["Prisinklmoms"]||""; 
        artikelStr["Prishistorik"] = {timestamp: new Date(), pris:obj["Prisinklmoms"]||""};
        artikelStr.Volymiml = obj["Volymiml"]||"";
        artikelStr.PrisPerLiter = obj["PrisPerLiter"]||"";
        artikelStr.Saljstart = obj["Saljstart"]||"";
        artikelStr.Slutlev = obj["Slutlev"]||"";
        artikelStr.Varugrupp = obj["Varugrupp"]||"";
        artikelStr.Forpackning = obj["Forpackning"]||"";
        artikelStr.Forslutning = obj["Forslutning"]||"";
        artikelStr.Ursprung = obj["Ursprung"]||"";
        artikelStr.Ursprunglandnamn = obj["Ursprunglandnamn"]||"";
        artikelStr.Producent = obj["Producent"]||"";
        artikelStr.Leverantor = obj["Leverantor"]||"";
        artikelStr.Argang = obj["Argang"]||"";
        artikelStr.Provadargang = obj["Provadargang"]||"";
        artikelStr.Alkoholhalt = obj["Alkoholhalt"]||"";
        artikelStr.Sortiment = obj["Sortiment"]||"";
        artikelStr.Ekologisk = obj["Ekologisk"]||"";
        artikelStr.Koscher = obj["Koscher"]||"";
        artikelStr.RavarorBeskrivning = obj["RavarorBeskrivning"]||"";
        
        
        
        
        var newObj = JSON.parse(JSON.stringify(artikelStr));

        artiklar.push(newObj);
        counter = (counter + 1);
   
        if (counter % 100 == 0 ) {
            console.log("sending stuff", counter);
            parser.pause();
            async.each(artiklar, onInsert, function(err){
                parser.resume();
                artiklar.length = 0;
                if(err){
                    console.log("err in async '.object': ", err);
                }
            });
        }

    });
    
    parser.on('endElement: artiklar', function(element){

        if ( counter % 100 != 0 ) {
            console.log("sending stuff", counter);
            async.each(artiklar, onInsert, function(err){
                artiklar.length = 0;
                if(err){
                    console.log("err in async '.end': ", err);
                    
                }
            });
            
        }
        console.log('end of xml-file in api.streamer');
        console.log(arr);
        return next(null, arr);
    });
    
    var onInsert = function(obj, callback){

        artikelDB.comparePrices(obj, (function(err, data){
            if(err && err != "next"){
                console.log("logging err in onInsert: ", err);
                return callback(err);
            }
            if(data){
                //console.log("type of Data inside .on('object'): ", typeof data);
                //console.log("@.on('obj'), data: ", JSON.parse(JSON.stringify(data)));
                arr.push(JSON.parse(JSON.stringify(data)));
            }
            callback(null);
        }));         
    };
    

        
    //stream.pipe(parser.saxStream); 
    
};

