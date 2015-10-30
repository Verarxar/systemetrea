var express      = require('express');
var app          = express();
var bodyParser   = require('body-parser');
var logger       = require('morgan');
var path         = require('path');
var cookieParser = require('cookie-parser');
// Configuration \\
var config       = require('./config');
// Routes \\
var index        = require('./server/routes/index');
var user         = require('./server/routes/user');
var tests        = require('./server/routes/tests');
var articles     = require('./server/routes/articles');
var errorHandler = require('./server/errorHandler');
var db 			 = require('./server/models/db');
var fs 			 = require('fs');

// Middlewares \\ 
	app.use(bodyParser.urlencoded({extended: true}));
	app.use(bodyParser.json()); 
	app.use(cookieParser());
	app.use(express.static(path.join(__dirname, '/public')));
	app.use(logger('dev'));

	// this middleware goes last to catches anything left
	// in the pipeline and reports to client as an error
	app.use(errorHandler);
	var ip;
	var header_ip;
// middleware to use for all requests
	var mrcurious = function(req, res, next){

				console.log(req.body);


		ip = req.connection.remoteAddress;
		header_ip = req.headers['x-forwarded-for'];
		console.log(" @: ", new Date());
		console.log(" ip: ", ip);
		console.log(" if Proxy: ", header_ip);
		fs.appendFile("./log.txt", new Date() + "\r\n" + "ip: " + ip + "\r\n" + "x-forwarded-for: " + header_ip + "\r\n \r\n", function(err) {
	    if(err) {
	        return console.log(err);
	    }
			console.log("The file was saved!");
		});
		next();
	};
	
	app.use(mrcurious);

	// Register all /api calls and reruote to user.js \\
	app.use('/api', user);
	app.use('/test', tests);
	app.use('/articles', articles);
	app.get('/', index); 

	// Garbage collectors, end-of-the-line error handlers \\
	app.use(function(req, res, next){
		var err = new Error('Not Found');
		err.status = 404;
		next(err);
	});

	if(app.get('end') === 'development'){
		app.use(function(err, req, res, next){
			console.log(req.body);
			res.status(err.status || 500);
			res.write('error', {
				message: err.message,
				error: err
			});
			res.end();
		});
	}



// Host server \\
var port = config.port;
app.listen(port, function(err){
  if(err){
    console.log(err);
  }else{
    console.log('Listening on port ' + port);  
  }
});


