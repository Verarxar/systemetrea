var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var articleSchema = new Schema(
  {
    nr: String,
    artikelid: {type: String, unique: true, index: true},
    varnummer: String,
    namn: String,
    namn2: String,
    prisinklmoms: Number,
    prissanktProcent: Number,
    prisHistorik: [{datum:{type: Date}, pris: Number}],
    volymiml: Number,
    prisPerLiter: Number,
    saljstart: Date,
    slutlev: Date,
    varugrupp: String,
    forpackning: String,
    forslutning: String,
    ursprung: String,
    ursprunglandnamn: String,
    producent: String,
    leverantor: String,
    argang: String,
    provadargang: String,
    alkoholhalt: String,
    sortiment: String,
    ekologisk: String,
    koscher: String,
    slut: false,
    ravarorBeskrivning: String,
    created: {type: Date, default: Date.now},
    lastModified: {type: Date, default: Date.now}
  },
  {
    collection: 'articles',
    read: 'nearest'
  }
);

articleSchema.set('toObject', { virtuals: true, getters: true })

mongoose.model('Article', articleSchema);
