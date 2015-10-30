var nodemailer  = require('nodemailer');
var config      = require('./../../../config');
var smtpTransport = require('nodemailer-smtp-transport');

exports.emailService = function(products, user, callback){
    console.log(products, user);
    this.recipient = user;
    var sentOne = false;
    this.messageBody = products;
    
    // create reusable transporter object using SMTP transport
    var generator = require('xoauth2').createXOAuth2Generator({
        user: config.email.emailAddress,
        clientId: config.email.clientID,
        clientSecret: config.email.clientSecret,
        refreshToken: config.email.refreshToken
    });
    
    generator.on('token', function(token){
        console.log('New token for %s: %s', token.user, token.accessToken);
    });
    
    var transporter = nodemailer.createTransport(smtpTransport({
        service: 'gmail',
        auth: {
            xoauth2: generator
        }
    }));
    
    function setRecipient(data){
        this.recipient = data;
    }
    
    function setMessage(data){
        this.messageBody = data;    
    }
    var gradadverb = ["Otroligt", "Sanslöst", "Makalöst", "Osannolikt", "Ofattbart", "Obegripligt", "Absurdt", "Fantastiskt", "Sagolöst", "Häpnadsväckande", "Enormt", "Mirakulöst", "Underbart", "Fabulöst", "Sagolikt",
    "Vidunderligt", "Oerhört", "Makalöst", "Enastående", "Fenomenalt"];
    
    var message = "Här var det prissänkt! \n\n Det här mailet, om det kommer fram, innehåller sänkningar från maj månad och frammåt, detta innebär att flertalet produkter " 
    + "eventuellt redan har utgått från sortimentet. Förhoppningsvis kommer nästa mail vara en uppdatering om vilka viner vars pris som sänkts under det senaste dygnet.\n\n";
    for(var i = 0; i<products.length; i++){
        var rnd = Math.round(Math.random() * (gradadverb.length - 1) + 0);
        message += 
        "Namn: " + products[i].Namn + " ("+ products[i].Varugrupp + ")" +
        "\nArtikelnummer: " + products[i].Varnummer + 
        "\nNytt Pris: " + products[i].NyttPris + "\nTidigare Pris " + products[i].GammaltPris + "\n"
        +"\nVolym i ml: " + products[i].Volymiml + "\n\n";
        
        + "Det är alltså en sänkning med hela " + products[i].Procent + "%. \n\n" + gradadverb[rnd] + " billigt!\n\n ------------------------------------------ \n\n"; 
    }

    transporter.sendMail({
        from: 'systemetrea@gmail.com', // sender address
        to: this.recipient, // list of receivers
        subject: 'SystemetRea provar skicka mail ✔', // Subject line
        text: message

    }, function(err, response){
          if (err) {
            console.log(err);
            callback(err, null);
          } else {
            console.log(response);
            callback("succezz: ", response);
          }
    });
};

