var db = require('../DAO/StockDAO.js');

exports.processCSV = function(data, callback){
	var arrayData = CSVToArray(data, ',');
	ArrayToJSON(arrayData, function(jsonData){
		callback(jsonData);
	});
};

// parses a CSV file's content and transforms it into an array for further processing.
var CSVToArray = function ( strData, strDelimiter ){
	strDelimiter = (strDelimiter || ",");
	var objPattern = new RegExp(
		(
			// Delimiters.
			"(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

			// Quoted fields.
			"(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

			// Standard fields.
			"([^\"\\" + strDelimiter + "\\r\\n]*))"
		),
		"gi"
		);
	var arrData = [[]];
	var arrMatches = null;
	while (arrMatches = objPattern.exec( strData )){
		var strMatchedDelimiter = arrMatches[ 1 ];
		if (strMatchedDelimiter.length &&
			(strMatchedDelimiter != strDelimiter)){
			arrData.push( [] );
		}
		if (arrMatches[ 2 ]){
			var strMatchedValue = arrMatches[ 2 ].replace(
				new RegExp( "\"\"", "g" ),
				"\""
				);
		} else {
			var strMatchedValue = arrMatches[ 3 ];
		}
		arrData[ arrData.length - 1 ].push( strMatchedValue );
	}

	// Return the parsed data.
	return( arrData );
}

// transforms the output of the CSVtoArray function into JSON format.
var ArrayToJSON = function(array, callback){
	db.retrieveOptions(function(options){
		if(options){
			var list = new Array();
			var time = new Date();
			time = time.getTime();
			console.log(array.length);
			for(var i = 0; i < options.length; i++){
				if(array[i][0] === options[i].symbol){
					list.push({id: options[i].id, name: options[i].name, prize: array[i][1], time: time});	
				}else{
					console.log('an error occured during parsing, object id is '  + array[i][0] + ' but should be ' + options[i].symbol);
				}
			}
		}
		callback(list);
	});
};