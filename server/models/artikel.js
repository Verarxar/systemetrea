var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var artikelSchema = new Schema({
    nr: {type: String, unique: true, index: true},
    Artikelid: String,
    Varnummer: String,
    Namn: String,
    Namn2: String,
    Prisinklmoms: Number,
    PrissanktProcent: Number,
    Prishistorik: [{timestamp:{type: Date}, pris: Number}],
    Volymiml: Number,
    PrisPerLiter: Number,
    Saljstart: Date,
    Slutlev: Date,
    Varugrupp: String,
    Forpackning: String,
    Forslutning: String,
    Ursprung: String,
    Ursprunglandnamn: String,
    Producent: String,
    Leverantor: String,
    Argang: String,
    Provadargang: String,
    Alkoholhalt: String,
    Sortiment: String,
    Ekologisk: String,
    Koscher: String,
    RavarorBeskrivning: String,
    created: {type: Date, default: Date.now},
    lastFound: {type: Date, default: Date.now}
});

var collectionName = 'artiklar'; //to prevent mongoDB to add "s" to the collection
 
var Artikel = mongoose.model('Artikel', artikelSchema, collectionName);

module.exports = {
    Artikel: Artikel
};