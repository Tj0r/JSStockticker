var express = require('express');
var app = express();

var http = require('http');
var fs = require('fs');
var db = require('./DBHandler.js');
var fileUtil = require('./FileUtil.js');
var parser = require('./CSVParser.js');
var tempPath = 'temp.csv';

var fetchStockPrizes = function(){
	console.log('downloading');
	fileUtil.download('http://www.indices.cc/download/compositions/files/atpx.csv', tempPath, function(data) {
		processFile(tempPath, function(processedData){
			processPrizes(processedData);
		});
	});
	console.log('downloading done');
};

var processFile = function(filePath, callback) {
	console.log('processing');
	fs.readFile(filePath, {encoding: 'utf-8'}, function(error, data){
		if(error)console.log('error in processFile: ' + error);
		if(data && data.length > 0){
			parser.processCSV(data, function(csvData){
				callback(csvData);
			});
		}	
	});
	console.log('processing done');	
};

var dbTest = function(){
	db.retrieveOptions(function(options){
		if(options){
			for(var i = 0; i < options.length; i++){
				console.log('dbtest id: ' + options[i].id);
			}
		}
	});
}

var processPrizes = function(prizes){
	if(prizes && prizes.length > 0){
		console.log('fetching options');
		db.retrieveOptions(function(options){
			if(options){
				console.log('options already exist');
			}else{
				for(var i = 0; i < prizes.length; i++){
					db.saveOption(prizes[i]);
				}
			}
			for(var i = 0; i < prizes.length; i++){
				db.saveStockValue(prizes[i]);
			}
		});
	}else{
		console.log('prizes are undefinded!');
	}
}

setInterval(function(){
	doStuff();
}, 5*60000);


var doStuff = function() {
	fetchStockPrizes();
	dbTest();
}

db.setupDB();

app.listen(1337);

app.get('/options', function(req, res){
	db.retrieveOptions(function(options){
		if(options){
			res.writeHead(200, {'Content-Type': 'application/json'});
			res.end(JSON.stringify(options));
		}
	});
});

app.get('/prize', function(req, res){
	var id = req.param('id');
	var start = req.param('start');
	var end = req.param('end');
	db.retrieveStockValue(id, start, end, function(prizes){
		res.writeHead(200, {'Content-Type': 'application/json'});
		res.end(JSON.stringify(prizes));
	});
});