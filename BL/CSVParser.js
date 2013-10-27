exports.processCSV = function(data, callback){
	var arrayData = CSVToArray(data, ';');
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
	var list = new Array();
	var time = new Date();
	time = time.getTime();
	for(var i = 0; i < array.length; i++){
		if(array[i][3] === 'AT'){
			list.push({id: array[i][1], name: array[i][0], prize: array[i][10], time: time});
		}
	}
	callback(list);
};