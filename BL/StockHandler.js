//setting up dependencies
var fs = require('fs');
var db = require('../DAO/StockDAO.js');
var fileUtil = require('./FileUtil.js');
var parser = require('./CSVParser.js');
var tempPath = 'temp.csv';

stockURL = 'http://www.indices.cc/download/compositions/files/atpx.csv';

// fetches the current stock prizes from the vienna stock exchange.
var fetchStockPrizes = function(){
	console.log('downloading');
	fileUtil.download(stockURL, tempPath, function(data) {
		processFile(tempPath, function(processedData){
			processPrizes(processedData);
		});
	});
	console.log('downloading done');
};

// reads the file passed through the filePath parameter, passes it through CSV parsing and passes the parsed data to the callback function.
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

// store the stock prizes in the database. if no options exist in the database, they are stored before storing the prizes.
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



