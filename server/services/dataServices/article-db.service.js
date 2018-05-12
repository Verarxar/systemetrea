var Article = require('../../models/artikel');
var async = require('async');
var numberOfArticlesHandled = 0;
function comparePrices(obj, next){
    var compareResponse = {
        total: 0,
        new: 0,
        warning: [],
        reduced: []
    };
    numberOfArticlesHandled++;
    console.log("Article #: ", numberOfArticlesHandled);
    var lastAddedArticle = "";
    var date = obj.siteData.lastFound;
    var reduced = [];
    async.waterfall([
        function(callback) {
            console.log("obj.nr", obj.nr);
            console.log("******************************");
            Article.find({'nr': obj.nr}, function(err, doc) {
                if(err) {
                    console.log("ERR findOne: ", err);
                    return callback(err);
                }
                var article = doc[0];
                console.log("******************************");
                if(!article ) {
                    console.log("We didn't find anything: ", doc);
                    var newArticle = new Article(obj);
                    Article.create(newArticle, function(err) {
                        if(err){
                          console.log("error in !doc.save: ", err.code, "when attempting to save: ", newArticle.nr);
                          return callback(err);
                        }
                        lastAddedArticle = newArticle.nr;
                        console.log("Article: ", newArticle.nr, "saved. Should not continue");
                        compareResponse.new++;
                        return callback("next", null);

                    });
                }
                else{
                    callback(null, article);
                }
            }, function(err){
                console.log("result- err: ", err);
                return callback(err);
            });
        },
        function(doc, callback)  {
                if(lastAddedArticle){
                    console.log("Number should now be " + lastAddedArticle, ". nr received: ", doc.nr);
                }
                    /*
                    *   When a name change on an article, it's usually one of three scenarios: Spelling error being corrected, the name was simply changed entirely or slightly adjusted,
                    *   or it's an entirely new product that has replaced the previous article's "Varunummer".
                    *   This checks wether there is any similarity of the new and old name. If not, object is completely removed.
                    */
                if(!(obj.namn.toLowerCase().indexOf(doc.namn.toLowerCase()) >=0) && !(doc.namn.toLowerCase().indexOf(obj.namn.toLowerCase()) >=0) ){
                    if(doc.namn2.length != 0){
                        var res = doc.namn2.localeCompare(obj.namn2);
                        console.log("comparing doc.namn2 with namn2",res);
                    }else{
                        console.log("Namn2.length == 0");
                    }
                    console.log(namn + " is not even a part of ", doc.namn + " which is currenty in database");

                    /*
                    *   Reached when "nr" of an old article has been replaced with a new article.
                    *   Previous article is no longer in systembolagets product range. Old article is removed.
                    */
                    doc.remove(function(err){
                        if(err){
                            console.log("Error when attempting to remove document: ", err);
                            callback(err);
                        }
                        /*
                        *   Old article with "nr": (obj.nr), removed.
                        *   New article added to database. Callback "next" to skip ahead, new article means no price change.
                        */
                        var artikel = new Article(obj);
                        artikel.save(function(err){
                            if(err){
                              console.log("error in !doc.save: ", err);
                              callback(err);
                            }

                            console.log("file saved, prolly");
                            callback("next", null);

                        });
                    });

                }else if(!(doc.namn.localeCompare(obj.namn) === 0)) {
                    console.log("But-", namn + "- does not equal-", doc.namn + "- stored in information place");
                    doc.namn = obj.namn;
                    doc.namn2 = obj.namn2;
                    compareResponse.warning.push({oldArticle: doc, obj: obj, message: "Name differ."});
                }
                doc.siteData.lastFound = date;
                //doc.siteData.exists = false;
                doc.save(function(err, res, numAffected){
                    if(err){
                        callback(err);
                    }
                    console.log("okidoky! last seen should've been updated: ", res.nr);
                    callback(null, res);
                });
        },
        function(arg1, callback){
            if(typeof arg1 == 'undefined' || !arg1){
                //console.log("article with a lower price not found. callback(next, null)");
                callback("next", null);
            }else if(arg1.prisinklmoms > obj.prisinklmoms){
                callback(null, arg1);
            }else{
                callback("next", null);
            }
        },
        //SEE https://blog.serverdensity.com/checking-if-a-document-exists-mongodb-slow-findone-vs-find/ --- CHANGE TO FIND INSTEAD OF FINDONE?
        function(arg1, callback){
            if(arg1){
                console.log(arg1.nr + " pris är sänkt från ", arg1.prisinklmoms ,"till: " + obj.prisinklmoms);
                var pricePercent = ((100*(1 - ((obj.prisinklmoms) / (arg1.prisinklmoms)))).toFixed(1) );
                console.log(pricePercent);
                arg1.siteData.priceHistory.unshift({timestamp: date, pris : obj.prisinklmoms});
                arg1.siteData.pricePercent = pricePercent;
                arg1.prisinklmoms  = obj.prisinklmoms;
                arg1.save(function (err, doc){
                    if (err){
                        callback(err);
                    }
                    reduced.push(doc);
                    callback(null, arg1);
                });
            }else{
                console.log("article-db.service: waterfall, pris är sänkt från, !args. - shouldn't be reached");
                callback(null, null);
            }
        },
    ], function(err, result){
        if(err){
            if(err == "next"){
                console.log("next('next')");
                //do nothing
            }else{
                console.log("next(err)");
                return next(err);
            }
        }
        console.log("next(null, result)");
        next(null, result);
    });
};

function getLeastFive(next){
    Article.find({ pricePercent : { $gte : 5 }}, function(err, data){
        if(err){
            return next(err);
        }
        next(null, data);
    });

};

function getDateChanged(date, next){

    // Corresponding MongoDB shell syntax:
    // db.artiklar.count({ $and: [    { pricePercent: {$gte: 5}}, { 'Prishistorik.timestamp' : {  $gte: new Date("2015-10-06")}}]})
    Article.find({ $and: [    { pricePercent: {$gte: 5}}, { 'Prishistorik.timestamp' : {  $gte: new Date("2015-10-06")}}]}, function(err, data) {
        if(err){
            return next(err);
        }
        next(data);
    });
};

function getRom (next){
    Article.find({Varugrupp: "Rom"}, function(err, data){
        if(err){
            return next(err);
        }
        next(null, data);
    });
};

function getLastDate(next){
    Article.findOne({},{}, { sort: { "siteData.lastFound" : -1 }},function(err, doc){
        if(err){
            console.log(err);
            return next(err);
        }if(doc){
            return next(null, doc.siteData.lastFound);
        }
    });
};
//Checks for articles not updated during the last scan and deletes them
function updateDatabase (next){
    var date;
    console.log("hi1");
    //MongoDB shell: db.artiklar.find({}).sort({ siteData.lastFound: -1 }).limit(1).pretty()
    Article.findOne({},{}, { sort: { "siteData.lastFound" : -1 } }, function(err, doc){
        if(err){
            console.log("hi2");
            return next(err);
        }if(doc){
            console.log(doc);
            var date = new Date(doc.siteData.lastFound);
            var yesterday = new Date(date.setDate(date.getDate()-2));

            var vm = {
                "artiklar": []
            };
            console.log(yesterday);

            Article.count({ 'siteData.lastFound' : {  $lte: yesterday}},  function(err, docs){
                if(err){
                    console.log(err);
                }
                console.log(docs);
            });
            var stream = Article.find({'siteData.lastFound': { $lte: yesterday}}).stream();
            stream.on("data", function(doc){

                doc.update(
                {$set:
                    {
                         'Slut' : true
                    }
                },
                function(err, doc) {
                    if (err){
                        return next(err);
                    }else{

                        vm.artiklar.push(doc);
                    }
                });
            }).on('error', function(err){
                console.log("error in !doc.save: ", err);
                return next(err);
            }).on('close', function(){
                console.log("Stream is closed");
            });

        }
        next(null, vm);

    });
};

function getArticlesCount(callback) {
     Article.count({}, function(err, stats) {
          if(err) {
               console.log("err counting articles: ", err);
               return callback(err);
          }
          console.log('getArticlesCount', stats);
          return callback(null, stats);
     });
}

module.exports = {
     comparePrices,
     getLeastFive,
     getDateChanged,
     getRom,
     getLastDate,
     updateDatabase,
     getArticlesCount
};
