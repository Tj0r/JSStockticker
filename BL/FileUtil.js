var http = require('http');
var fs = require('fs');

exports.download = function(url, destination, callback) {
	var file = fs.createWriteStream(destination);
	var request = http.get(url, function(response) {
		response.pipe(file);
		file.on('finish', function() {
			file.close();
			callback(destination);
		});
	});
};