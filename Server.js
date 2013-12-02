//setting up dependencies
var express = require('express');
var app = express();
var http = require('http');
var sh = require('./BL/StockHandler.js');
var stockDB = require('./DAO/StockDAO.js');
var baseDB = require('./DAO/BaseDAO.js');
var userDB = require('./DAO/UserDAO.js');
var auth = require('./BL/AuthenticationManager.js');

var tempPath = 'temp.csv';
var port = 1337;

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
	res.header('Access-Control-Allow-Origin', '*');
	stockDB.retrieveOptions(function(options){
		if(options){
			res.writeHead(200, {'Content-Type': 'application/json'});
			res.end(JSON.stringify(options));
		}
	});
});

// defines a web api method which returns a specific stock option's values.
app.get('/prize', function(req, res){
	res.header('Access-Control-Allow-Origin', '*');
	var id = req.param('id');
	var start = req.param('start');
	var end = req.param('end');
	if(id && id != null && id != ''){
		if(start && start != null && start != ''){
			if(end && end != null && end != ''){
				StockDB.retrieveStockValues(id, start, end, function(prizes){
					res.writeHead(200, {'Content-Type': 'application/json'});
					res.end(JSON.stringify(prizes));
				});
			}else{
				res.send(500, 'Illegal parameters passed! Make sure to pass both start and end!');
			}
		}else{
			StockDB.retrieveStockValues(id, null, null, function(prizes){
				res.writeHead(200, {'Content-Type': 'application/json'});
				res.end(JSON.stringify(prizes));
			});
		}
	}else{
		res.send(500, 'Illegal parameters passed! Missing id parameter!');
	}	
});

app.get('/users', function(req, res){
	res.header('Access-Control-Allow-Origin', '*');
	userDAO.retrieveUsers(function(users){
		if(users){
			res.writeHead(200, {'Content-Type': 'application/json'});
			res.end(JSON.stringify(users));
		}
	});
});

app.post('/users', function(req, res){
	var name = req.param('name');
	var pwd = req.param('pwd');
	auth.registerUser(name, pwd);
	res.send(200, 'user created');
});

app.put('/users', function(req, res){
	var id = req.param('id');
	var pwd = req.param('pwd');
	var type = req.param('type');
	
	if(pwd && pwd != null){
		auth.changeUserPassword(id, pwd);
	}
	
	if(type && type != null){
		auth.changeUserType(id, type);
	}
});