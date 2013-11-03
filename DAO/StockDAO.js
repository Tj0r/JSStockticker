//setting up dependencies
var fs = require('fs');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('stock.db');

// sets up the database by running ddl scripts.
exports.setupDB = function() {
	console.log('setting up database');
	var fileData = fs.readFile('./resources/ddl_options.sql', {encoding: 'utf-8'}, function(error, data){
		if(error)console.log(error);
		db.serialize(function() {
			//db.run('drop table options');
			//db.run('drop table stockvalue');
			db.run(data);
			console.log('creating table options');
		});
		exports.retrieveOptions(function(op){
			console.log('after-serialize-length: ' + op.length);
		});
	});
	var fileData = fs.readFile('./resources/ddl_stockvalues.sql', {encoding: 'utf-8'}, function(error, data){
		if(error)console.log(error);
		db.serialize(function() {
			db.run(data);
			console.log('creating table stockvalues');
		});
	});
	var fileData = fs.readFile('./resources/dml_options.sql', {encoding: 'utf-8'}, function(error, data){
		if(error)console.log(error);
		data = data.replace('\n', '');
		var lines = data.split(';');
		for(var i = 0; i < lines.length; i++){
			db.serialize(function(){
				console.log('line: ' +  lines[i].toString());
				var query = lines[i].toString();
				if(query != '')db.run(query);				
			});
		}
	});
	console.log('setup finished');
};

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