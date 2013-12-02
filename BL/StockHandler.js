//setting up dependencies
var fs = require('fs');
var db = require('../DAO/StockDAO.js');
var fileUtil = require('./FileUtil.js');
var parser = require('./CSVParser.js');
var tempPath = 'temp.csv';

var stockURL = 'http://download.finance.yahoo.com/d/quotes.csv?s=';//'http://www.indices.cc/download/compositions/files/atpx.csv';
var stockParams = '&f=sl1t1';

// fetches the current stock prizes from yahoo! finance.
exports.fetchStockPrizes = function(){
	console.log('downloading');
	db.retrieveOptions(function(options){
		if(options){
			var url = stockURL
			for(var i = 0; i < options.length; i++){
				url += options[i].symbol;
				if(i < options.length-1){
					url += '+';
				}
			}
			url = url + stockParams;
			console.log('URL: ' + url);
			fileUtil.download(url, tempPath, function(data) {
				processFile(tempPath, options, function(processedData){
					processPrizes(processedData);
					console.log('downloading done');
				});
			});	
		}else{
			console.log('ERROR: no options found in database');
		}
	});
};

// reads the file passed through the filePath parameter, passes it through CSV parsing and passes the parsed data to the callback function.
var processFile = function(filePath, options, callback) {
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