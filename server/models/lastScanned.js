var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var scanSchema = new Schema({
    _id: Schema.Types.ObjectId,
    lastScanned: {type: Date, default: Date.now}
});


var collectionName = 'datescanned'; //to prevent mongoDB to add "s" to the collection
var Scan = mongoose.model('Scan', scanSchema, collectionName); 


module.exports = {
    Scan: Scan
};