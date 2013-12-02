var baseDB = require('./DAO/BaseDAO.js');
var db = baseDB.getDB();

exports.retrieveUsers(callback){
	db.serialize(function(){
		db.all('SELECT id, name, type FROM users', function(data, error){
			if(error)console.log('error occured while fetching users: ' + error);
			callback(data);
		});
	});
};

exports.saveUser(id, name, password){
	db.serialize(function(){
		db.run('INSERT INTO users VALUES (?, ?, ?, 1)', [id, name, password]);
	});
};

exports.updatePassword(id, password){
	db.serialize(function(){
		db.all('UPDATE users SET pwd = ? where id = ?', [password, id]);
	});
};

exports.updateType(id, type){
	db.serialize(function(){
		db.all('UPDATE users SET type = ? where id = ?', [type, id]);
	});
};