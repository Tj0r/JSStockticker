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
	var options = db.retrieveOptions(function(options){
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

var nrOfCalls = 0;

var doStuff = function() {
	if(nrOfCalls == 0){
		fetchStockPrizes();
		dbTest();
	}
	nrOfCalls++;
}

db.setupDB();

http.createServer(function (req, res) {
  doStuff();
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
}).listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');





