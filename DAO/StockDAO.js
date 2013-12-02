//setting up dependencies
var fs = require('fs');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('stock.db');

exports.saveOption = function(option){
	db.serialize(function(){
		console.log('saving option, id: ' + option.id);
		db.run('INSERT INTO options VALUES (?, ?, ?)', [option.id, option.name, options.symbol]);
	});
};

exports.retrieveOptions = function(callback){
	db.serialize(function(){
		db.all('SELECT id, name, symbol FROM options', function(error, data){
			if(error)console.log('error in retrieveOptions: ' + error);
			callback(data);
		});
	});
};

exports.saveStockValue = function(stockvalue) {
	db.serialize(function(){
		console.log('saving stock value, id: ' + stockvalue.id + ' time: ' + stockvalue.time);
		db.run('INSERT INTO stockvalue VALUES (?, ?, ?)', [stockvalue.id, stockvalue.prize, stockvalue.time]);
	});	
};

exports.retrieveStockValues = function(id, from, to, callback) {
	if(from != null && to != null){
		db.serialize(function(){
			db.all('SELECT optionid as id, price, time FROM stockvalue where id = ? and time between ? and ?', [id, from, to], function(error, data){
				if(error)console.log('error in retrieveOptions: ' + error);
				callback(data);
			});
		});	
	}else{
		db.serialize(function(){
			db.all('SELECT optionid as id, price, time FROM stockvalue where id = ?', [id], function(error, data){
				if(error)console.log('error in retrieveOptions: ' + error);
				callback(data);
			});
		});
	}
};