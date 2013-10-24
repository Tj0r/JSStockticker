exports.processCSV = function(data, callback){
	var arrayData = CSVToArray(data, ';');
	console.log('csv to array after return: ' + arrayData.length);
	ArrayToJSON(arrayData, function(jsonData){
		console.log('processed csv data! length: ' + jsonData.length);
		callback(jsonData);
	});
};

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
	console.log('csv to array done: ' + arrData.length);
	return( arrData );
}

var ArrayToJSON = function(array, callback){
	console.log('array to json array length:' + array.length);
	var list = new Array();
	var time = new Date();
	time = time.getTime();
	for(var i = 0; i < array.length; i++){
		console.log(array[i]);
		if(array[i][3] === 'AT'){
			console.log('match found for conditions: ' +array[i][1]);
			list.push({id: array[i][1], name: array[i][0], prize: array[i][10], time: time});
		}else{
			console.log(array[i][0] != '' && array[i][1] != 'ISIN' && array[3] === 'AT' && array[i][1] != '' && array[i][10] != '');
			console.log(array[i][0] != '');
			console.log(array[i][0] != 'ISIN');
			console.log(array[i][3] == 'AT'),
			console.log(array[i][1] != ''); 
			console.log(array[i][10] != '');
			console.log('no match! id: ' + array[i][1] + ' name: ' + array[i][0] + ' prize: ' + array[i][10] +  'time: ' + time);
		}
	}
	console.log('array to json list length: ' + list.length);
	callback(list);
};