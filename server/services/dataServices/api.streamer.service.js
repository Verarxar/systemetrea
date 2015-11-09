var fs = require('fs');
var artikelDB = require('./artikel.db.service');
var XmlStream = require('xml-stream');
var async = require('async');
var date = "";

exports.beginScan = function(file, next) {
    var stream = fs.createReadStream('./server/services/dataServices/data/' + file);
    var artiklar = [];

    var arr = [];
    var counter = 0;
    var artikelStr = {};
    var arraypos = 0;

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
        Slut: false,
        
    });
    
    var parser = new XmlStream(stream);
    parser.on('endElement: skapad-tid', function(obj) {
        date = new Date(obj['$text']);
        console.log("obj is: ", obj);
        console.log("obj['$text'] is: ", obj['$text']);
        console.log("date is: ", date);
        

    }); 
    
    parser.on('endElement: artikel', function(obj) {
        
        
        artikelStr.nr = obj["nr"];
        artikelStr.Artikelid = obj["Artikelid"]||"";
        artikelStr.Varnummer = obj["Varnummer"]||"";
        artikelStr.Namn = obj["Namn"]||"";
        artikelStr.Namn2 = obj["Namn2"]||"";
        artikelStr.Prisinklmoms = obj["Prisinklmoms"]||""; 
        artikelStr["Prishistorik"] = {timestamp: date, pris:obj["Prisinklmoms"]||""};
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
        artikelStr.lastFound = date;
        artiklar.push(JSON.parse(JSON.stringify(artikelStr)));
        
        counter = (counter + 1);
   
        if (counter % 100 == 0 ) {
  
            
            parser.pause();
            async.each(artiklar, onInsert, function(err){
                if(err){
                    console.log("err in async '.object': ", err);
                }
                artiklar.length = 0;
                parser.resume();
                
                
            });
        }

    });
    
    parser.on('endElement: artiklar', function(element){
        console.log("sending last stuff", counter);
        if (!(counter % 100 == 0)) {
            async.each(artiklar, onInsert, function(err){
                artiklar.length = 0;
                if(err){
                    console.log("err in async '.end': ", err);
                    
                }
                console.log('end of xml-file in api.streamer');
                console.log(arr);
                return next(null, arr);
            });
        }else{
            console.log("why on earth are you in here?");
        }
    });
    
    var onInsert = function(obj, callback){
        arraypos++;
        if(arraypos%2000 == 0){ console.log(arraypos/200 + "%");}
        artikelDB.comparePrices(obj, (function(err, data){
            if(err && err.localeCompare("next") != 0){
                console.log("logging err in onInsert: ", err);
                return callback(err);
            }
            if(data){
                arr.push(JSON.parse(JSON.stringify(data)));
            }
            callback(null);
        }));   
        
    };
    
};

