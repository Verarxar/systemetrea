var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    email: {type: String, unique: true, required: true},
    created: {type: Date, default: Date.now},
    lastLoggedOn: {type: Date, default: Date.now},
    maxPrice: {type: Number, required: true},
    setPercentage: {type: Number, min:5, max: 75, required: true}
});

var User = mongoose.model('User', userSchema);

module.exports = {
    User: User
};