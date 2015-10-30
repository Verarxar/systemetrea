var fs = require('fs');
var JSON_URL = './server/services/dataServices/data/db.json';
//var xml2object = require('xml2object');
var XmlStream = require('xml-stream');
var Artikel = require('./../../models/artikel').Artikel;

exports.convert = function(XML_URL, next) {
    
    var artikelStr = ({
        nr: "",
        Artikelid: "",
        Varnummer: "",
        Namn: "",
        Namn2: "",
        Prisinklmoms: "",
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
        RavarorBeskrivning: ""
    });
    var counter = 0;
    var stream = fs.createReadStream('./server/services/dataServices/data/' + XML_URL);
    //var writeStream = fs.createWriteStream(JSON_URL);
    //var anArray = ["artikel"];
    var parser = new XmlStream(stream);
    console.log("in here ok " + XML_URL);
    var artiklar = [];
    //var bulk = Artikel.collection.initializeUnorderedBulkOp();
    parser.on('endElement: artikel', function(obj) {

                var jsonObj = JSON.parse(JSON.stringify(obj));
                artikelStr.nr = jsonObj.nr||"";
                artikelStr.Artikelid = jsonObj.Artikelid||"";
                artikelStr.Varnummer = jsonObj.Varnummer||"";
                artikelStr.Namn = jsonObj.Namn||"";
                artikelStr.Namn2 = jsonObj.Namn2||"";
                artikelStr.Prisinklmoms = jsonObj.Prisinklmoms||"";
                artikelStr.Prishistorik = [{timestamp: Date(), pris:jsonObj.Prisinklmoms}];
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
                console.log(artikelStr);
                artiklar.push(artikelStr);
                //artikelStr = "";
//                
                counter = (counter + 1);
                
                //bulk.insert(artikelStr);
                //console.log(artikelStr);
                if (counter % 10 == 0 ) {
                    parser.pause();
                    console.log("in here!");
                    Artikel.collection.insert(artiklar, onInsert);
                    artiklar = [""];

                    /*bulk.execute({w:1}, function(err, bulkres) {
                        if(err){console.log(err.code);}
                        bulk = Artikel.collection.initializeUnorderedBulkOp();
                        
                    });*/
                }
                               
    });
    // Bind to the file end event to tell when the file is done being streamed
    parser.on('end', function() {
        
        if ( counter % 10 != 0 ) {
            Artikel.collection.insert(artiklar, onInsert);
            artiklar = [""];
            /*
            bulk.insert(artikelStr);
            bulk.execute(function(err,response) {
                if(err){
                    return (new Error("Error generated: "));
                }
                console.log("?????????????");
            });
            */
        }
        console.log( "I'm finished now") ;
        //writeStream.end();
        next(null);
    });
    
    function onInsert(err, docs){
        if (err){
            console.log("onInsert error", err);
        }
        else{
            console.log("shit was stored, this many: ", docs.length);
            parser.resume();
        }
    }
    //stream.pipe(parser.saxStream);

};

            /*
               
            
            var artikel = new Artikel(artikelStr);
            console.log("Saving...");
            artikel.save(function(err, result){
                if(err){
                    next(err);    
                }
                console.log("The result: ", result);
            });
            */
            
/* In case we need to transform the stream on the go (for mongoose): https://www.youtube.com/watch?v=yOSNQZm3Trw
        function xmlToJson () {
            Transform.call(this);
        }
        inherits(xmlToJson, Transform);
        
        xmlToJson.prototype._transform = function(chunk, enc, done){
            
        }
*/