var User        = require('../models/user').User;

exports.userCall = function(obj, next){
    var email = obj.email;
    
    console.log("obj in user.service: ", obj);
    console.log("obj.email in user.service: ", email + "value: ", obj.value);
    
    User.findOne({'email': email}, function (err, resource){
        if(err){
            next(err);
        }
        if(!resource){
            var newUser = new User({
                email: email,
                maxPrice: obj.value,
                  //minPrice: obj.minPrice,
                setPercentage: obj.setPercentage,
                                
            });    
                      
            newUser.save(function(err){
                if(err){
                    console.log("newUser.save: Error while saving: "+err);
                    return next(err);
                }
                return next(null);
            });
        }
        if(resource){
            console.log("user " + email + " found, updating...");
            resource.update(
                {$set : {
                    email: email,
                    maxPrice: obj.value,
                    //minPrice: obj.minPrice,
                    setPercentage: obj.setPercentage
                    }
                    
                },
                function(err){
                    if(err){
                        return next(err);
                    }else{
                        next(null);
                    }
                });
        }
    

    });

};

exports.getUser = function(obj, next){
    var email = obj;
   
    User.findOne({'email': email}, function (err, resource){
        if(err){
            return next(err);
        }if(resource){
            resource.lastLoggedOn = new Date();
            resource.markModified('lastLoggedOn');
            resource.save(function(err){
                if(err){
                    console.log("error in lastLoggedOn save: ", err);
                    return new Error(err);
                }
            });  
        }
        next(resource);
    });
};

exports.getUsers = function(obj, next){
    User.find( {maxPrice: { $gte: obj.NyttPris}, setPercentage: { $lte: obj.Procent } }, function (err, docs){
        if(err){
            return next(err);
        }
        next(null, docs);
    });
};