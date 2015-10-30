var mail = require('./mail.service');
var userDB = require('./../user.service');
var async = require ('async');
var _ = require('underscore')._;

exports.fetchUsers = function(data, callback) {
//    console.log("Content of arg1: ", data);
    var recipients = [];
//    console.log("Content of data.NyttPris + data.Procent in fetchUsers: ", data.NyttPris, " ", data.Procent);
    userDB.getUsers(data, function(err, users){
        if(err){
            callback(new Error(err));
        }else{
            for(var i in users){
               recipients.push(users[i].email);
            }
            callback(null, recipients);
        }
    });
};


exports.prepareMail = function(mailPacket, callback) {
    var str = '"' + "mailtoper@gmail.com" + '"';
    var count = 0;
    for(var key in mailPacket){
        if(key.valueOf() == str.valueOf()){
            mail.emailService(mailPacket[key], key, function(err, res){
                if(err){
                    return callback(err);
                }else{
                    count ++;
                }
                if(mailPacket.length === 1){
                   callback(null, res);
                }
            });
        }
    }


};

    
    
