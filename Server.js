//setting up dependencies
var express = require('express'),
	http = require('http'),
	passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	sh = require('./BL/StockHandler.js'),
	stockDB = require('./DAO/StockDAO.js'),
	baseDB = require('./DAO/BaseDAO.js'),
	userDB = require('./DAO/UserDAO.js'),
	auth = require('./BL/AuthenticationManager.js'),
	app = express(),
	tempPath = 'temp.csv',
	port = 1337;

passport.use(new LocalStrategy(
	function(username, password, done){
		console.log('authorize//name: ' + username + ' pwd: ' + password);
		auth.findUser(username, password, function(error, user){
			if(error){
				console.log(error);
				return done(error);
			}
			if(!user){
				console.log('no user found');
				return done(null, false, {message: 'wrong user name or password'});
			} else {
				console.log('user found key: ' + user.pwd);
				auth.createSession(user.name, function(error, data){
					if(error)return done(error)
					user.pwd = data
					return done(null, user);
				});
			}
		});
	}
));

passport.serializeUser(function(user, done){
	done(null, user.pwd);
});

passport.deserializeUser(function(id, done){
	auth.findSessionByKey(id, function(error, user){
		if(error)done(error, null);
		done(null, user);
	});
});

app.configure(function() {
	app.use(express.static('public'));
	app.use(express.cookieParser());
	app.use(express.bodyParser());
	app.use(express.session({ secret: 'd4tTr0llStockT1ck3r' }));
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(app.router);
});

app.listen(port);
baseDB.setupDB();
sh.fetchStockPrizes();

// starts a timer which continuously querys for the current stock prizes
setInterval(function(){
	console.log('timer running now');
	sh.fetchStockPrizes();
}, 5*60000);

// defines a web api method which returns the currently stored stock options.
app.get('/options', function(req, res){
	stockDB.retrieveOptions(function(options){
		sendData(res, options);
	});
});

// defines a web api method which returns a specific stock option's values.
app.get('/prize/:id', function(req, res){
	var id = req.params.id;
	var start = req.param('start');
	var end = req.param('end');
	if(id && id != null && id != ''){
		if(start && start != null && start != ''){
			if(end && end != null && end != ''){
				stockDB.retrieveStockValues(id, start, end, function(prizes){
					sendData(res, prizes);
				});
			}else{
				res.send(500, 'Illegal parameters passed! Make sure to pass both start and end!');
			}
		}else{
			stockDB.retrieveStockValues(id, null, null, function(prizes){
				sendData(res, prizes);
			});
		}
	}else{
		res.send(500, 'Illegal parameters passed! Missing id parameter!');
	}	
});

app.get('/login', passport.authenticate('local'), function(req, res){
	var name = req.param('name');
	var pwd = req.param('pwd');
	console.log(name)
	console.log(pwd);
	if(req.user && req.user != null){
		res.send(200, 'Successfully logged in. Take a seat, have a cookie.');
	}else{
		res.send(403, 'Login failed!');
	}
});

app.post('/login', function(req, res){
	var name = req.body['name'];
	var pwd = req.body['pwd'];
	console.log(name);
	console.log(pwd);
	if(name && pwd){
		auth.registerUser(name, pwd);
		res.send(200, 'user created');
	}else{
		res.send(500, 'Missing parameters');
	}
	
});

app.get('/logout', function(req, res){
	if(req.user.name && req.user.name != null){
		auth.destroySession(req.user.name);
		res.send(200, 'Logout sucessful');
	}else{
		res.send(403, null);
	}
});

app.get('/preferences', function(req, res){
	if(req.user && req.user != null){
		stockDB.retrievePreferences(req.user.name, function(error, data){
			sendData(res, data);
		});
	}else{
		res.send(403, null);
	}
});

app.post('/preferences', function(req, res){
	if(req.user && req.user != null){
		var preferences = eval(req.body);
		stockDB.deletePreferences(req.user.name);
		for(var i = 0; i < preferences.length; i++){
			stockDB.savePreferences(preferences[i].id, req.user.name);
		}
	}else{
		res.send(403, null);
	}
});

var sendData = function(response, data){
	response.header('Access-Control-Allow-Origin', '*');
	if(data && data != null){
		response.writeHead(200, {'Content-Type': 'application/json'});
		response.end(JSON.stringify(data));
	}else{
		response.send(404, 'No such resource found');
	}
};