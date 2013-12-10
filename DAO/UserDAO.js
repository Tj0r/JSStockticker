var baseDB = require('./BaseDAO.js');
var db = baseDB.getDB();

// creates a new user
exports.saveUser = function(name, password)	{
	db.serialize(function(){
		db.run('INSERT INTO users VALUES (?, ?)', [name, password]);
	});
};

// updates a user's password
exports.updatePassword = function(id, password)	{
	db.serialize(function(){
		db.all('UPDATE users SET pwd = ? where id = ?', [password, id]);
	});
};

// retrieves the user with given user name and password
exports.findUser = function(name, password, callback) {
	db.serialize(function(){
		db.all('SELECT name, pwd FROM users WHERE name = ? and pwd = ?', [name, password], function(error, data){
			if(error){
				console.log(error);
				callback(error, null);
			}
			if(data && data !=null){
				callback(null, data[0]);
			}else{
				callback(null, null);
			}
		});
	});
};

// retrieves a user identified by his or her name
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

// retrieves the current session for specific user
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

// retrieves the session with given session key
exports.findSession = function(key, callback) {
	db.serialize(function(){
		db.all('SELECT name, key FROM sessions WHERE key = ?', [key], function(error, data){
			if(error){
				console.log(error);
				callback(error, null);
			}
			callback(null, data[0]);
		});
	});
};

// deletes all session with given user name
exports.deleteSessionByUserName = function(name) {
	db.serialize(function(){
		db.run('DELETE FROM sessions WHERE name = ?', [name]);
	});
};

// creates a new session with given user name and session key
exports.createSession = function(name, key) {
	db.serialize(function(){
		db.run('INSERT INTO sessions VALUES (?, ?)', [name, key]);
	});
};