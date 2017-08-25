const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const siteDataSchema = new Schema(
  {
    pricePercent: Number,
    priceHistory: [{timestamp:{type: Date}, pris: Number}],
    created: {type: Date, default: Date.now},
    lastFound: {type: Date, default: Date.now},
    exists: { type: Boolean, default: true },
    previousNames: [String]
  }
);

const articleSchema = new Schema(
  {
    nr: { type: Number, required: true, unique: true, dropDups: true },
    artikelid: String,
    varnummer: String,
    namn: String,
    namn2: String,
    prisinklmoms: Number,
    volymiml: Number,
    prisperliter: Number,
    saljstart: String,
    utgatt: String,
    varugrupp: String,
    typ: String,
    stil: String,
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
    sortimenttext: String,
    ekologisk: String,
    etiskt: String,
    koscher: String,
    ravarorbeskrivning: String,
    siteData: siteDataSchema
  },
  {
    collection: 'articles',
    read: 'nearest'
  }
);
articleSchema.set('autoIndex', true);
articleSchema.set('emitIndexErrors', false);
articleSchema.on('error', function(error) {
  console.log("articleSchema err:", error);
  // gets an error whenever index build fails
});

module.exports = mongoose.model('Article', articleSchema);
