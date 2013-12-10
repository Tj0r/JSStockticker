var crypto = require('crypto')
	,key = 'sup3rS3cr3tK3yz';
var userDB = require('../DAO/UserDAO.js');


// registers a new user.
exports.registerUser = function(name, password)	{
	var cipher = crypto.createCipher('aes-256-cbc', key);
	cipher.update(name, 'utf-8', 'base64');
	var salt = cipher.final('base64');
	crypto.pbkdf2(password, salt, 10000, 512, function(err, key) {
		if(err)console.log(err);
		console.log('name: ' + name + 'key: ' + key);
		userDB.saveUser(name, key);
	});
};

// changes a user's password.
exports.changeUserPassword = function(id, password){
	// TODO: Implement
};

// finds a specific user
exports.findUser = function(username, password, callback) {
	var cipher = crypto.createCipher('aes-256-cbc', key);
	cipher.update(username, 'utf-8', 'base64');
	var salt = cipher.final('base64');
	crypto.pbkdf2(password, salt, 10000, 512, function(err, key) {
		if(err)console.log(err);
		userDB.findUser(username, key, callback);
	});
};

// creates a new session token for the currently logged in user
exports.createSession = function(name, callback) {
	var cipher = crypto.createCipher('aes-256-cbc', key);
	var date = new Date();
	var decrypted = name + date.getTime().toString();
	cipher.update(decrypted, 'utf-8', 'hex');
	var encrypted = cipher.final('hex');
	userDB.createSession(name, encrypted);
	callback(null, encrypted);
};

// destroys a specific user's session tokens
exports.destroySession = function(name) {
	userDB.deleteSessionByUserName(name);
};

// retrieves a session by it's token key
exports.findSessionByKey = function(key, callback) {
	userDB.findSession(key, callback);
};