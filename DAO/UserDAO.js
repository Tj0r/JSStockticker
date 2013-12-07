var baseDB = require('./BaseDAO.js');
var db = baseDB.getDB();

exports.saveUser = function(name, password)	{
	db.serialize(function(){
		db.run('INSERT INTO users VALUES (?, ?)', [name, password]);
	});
};

exports.updatePassword = function(id, password)	{
	db.serialize(function(){
		db.all('UPDATE users SET pwd = ? where id = ?', [password, id]);
	});
};

exports.findUser = function(name, password, callback) {
	db.serialize(function(){
		db.all('SELECT name, pwd FROM users WHERE name = ? and pwd = ?', [name, password], function(error, data){
			if(error){
				console.log(error);
				callback(error, null);
			}
			callback(null, data[0]);
		});
	});
};

exports.findUserByName = function(name, callback) {
	db.serialize(function(){
		db.all('SELECT name, pwd FROM users WHERE name = ?', [name], function(error, data){
			if(error){
				console.log(error);
				callback(error, null);
			}
			callback(null, data[0]);
		});
	});
};

exports.findSessionByUserName = function(name, callback) {
	db.serialize(function(){
		console.log('findSessionByUserName called');
		db.all('SELECT name, key FROM sessions WHERE name = ?', [name], function(error, data){
			if(error){
				console.log(error);
				callback(error, null);
			}
			callback(null, data[0]);
		});
	});
};

exports.findSession = function(key, callback) {
	db.serialize(function(){
		console.log('findSession called');
		db.all('SELECT name, key FROM sessions WHERE key = ?', [key], function(error, data){
			if(error){
				console.log(error);
				callback(error, null);
			}
			callback(null, data[0]);
		});
	});
};


exports.deleteSessionByUserName = function(name) {
	db.serialize(function(){
		console.log('deleteSession called');
		db.run('DELETE FROM sessions WHERE name = ?', [name]);
	});
};

exports.createSession = function(name, key) {
	db.serialize(function(){
		console.log('createSession called');
		db.run('INSERT INTO sessions VALUES (?, ?)', [name, key]);
	});
};