var Artikel = require('./../../models/artikel').Artikel;

exports.findAndCompare = function(obj, callback){
    var converted = JSON.parse(JSON.stringify(obj));
    var nr = converted.nr;
    var Prisinklmoms = converted.Prisinklmoms;
    
    Artikel.findOne({'nr': nr, 'Prisinklmoms': {$gt:Prisinklmoms}}, function(err, doc) {
        if(err) {
            return callback(err);
        }else if(typeof doc == 'undefined' || !doc){
            return callback(true, doc);
        }else{
            callback(null, doc);     
        }
    });
};
exports.updateArticle = function(arg1, Prisinklmoms, callback){
    console.log(arg1.nr + " pris är sänkt till: " + Prisinklmoms);
            arg1.update(
                {$push : {
                    'Prishistorik' : { 
                        $each: [{timestamp: Date(), pris : Prisinklmoms}],
                        $position: 0 }
                    }
                },
                {upsert: true }, 
                function(err, doc) {
                    if (err){
                        return callback(err);
                    }
                    Artikel.findById(arg1["id"], function(err, doc){
                        if(err){
                            return callback(err, doc);
                        }if(doc){
                            doc.Prisinklmoms  = Prisinklmoms;
                            doc.save(callback);
                        }

                    });
                    callback(null, arg1);
                }
            );
};

