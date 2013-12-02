//setting up dependencies
var express = require('express');
var app = express();
var http = require('http');
var sh = require('./BL/StockHandler.js');
var db = require('./DAO/StockDAO.js');

var tempPath = 'temp.csv';
var port = 1337;

app.listen(port);
db.setupDB();
sh.fetchStockPrizes();

// starts a timer which continuously querys for the current stock prizes
setInterval(function(){
	console.log('timer running now');
	sh.fetchStockPrizes();
}, 5*60000);

// defines a web api method which returns the currently stored stock options.
app.get('/options', function(req, res){
	res.header('Access-Control-Allow-Origin', '*');
	db.retrieveOptions(function(options){
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
				db.retrieveStockValues(id, start, end, function(prizes){
					res.writeHead(200, {'Content-Type': 'application/json'});
					res.end(JSON.stringify(prizes));
				});
			}else{
				res.send(500, 'Illegal parameters passed! Make sure to pass both start and end!');
			}
		}else{
			db.retrieveStockValues(id, null, null, function(prizes){
				res.writeHead(200, {'Content-Type': 'application/json'});
				res.end(JSON.stringify(prizes));
			});
		}
	}else{
		res.send(500, 'Illegal parameters passed! Missing id parameter!');
	}	
});