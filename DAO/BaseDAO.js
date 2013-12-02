//setting up dependencies
var fs = require('fs');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('stock.db');

exports.getDB = function(){
	return db;
}
// sets up the database by running ddl scripts.
exports.setupDB = function() {
	console.log('setting up database');
	setupDDL('./resources/ddl_options.sql');
	setupDDL('./resources/ddl_stockvalues.sql');
	setupDDL('./resources/ddl_users.sql');
	setupDDL('./resources/ddl_preferences.sql');
	
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

var setupDDL(fileLocation) {
	var fileData = fs.readFile(fileLocation, {encoding: 'utf-8'}, function(error, data){
		if(error)console.log(error);
		db.serialize(function() {
			db.run(data);
			console.log('creating table at' + fileLocation);
		});
	});
};