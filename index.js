var cheerio = require('cheerio');
var needle = require('needle');
var credentials = (function() {
        var credentials = {};
        var privateCredentials;
        credentials.get = function(callback) {
                if(typeof privateCredentials !== 'undefined') {
			callback(null, privateCredentials);
		} else {
			callAcre('GET', function(err, html) {
				if(err) console.log(err);
			parseSessionData(html, function(err, data) {
					if(err) {
						callback(err);
					} else {			
						
						privateCredentials = data;
						callback(null, privateCredentials);
					}
				});
			});
		}
	}
	credentials.set = function(html, callback) {
		parseSessionData(html, function(err, data) {
			if(err){
				callback(err);
			} else {
				privateCredentials = data;
				callback(null, data);
			}
		});
	}
	return credentials;
})();

function parseSessionData(html, callback) {
	try {
		var $ = cheerio.load(html);
		var data = {};
		$('input').each(function(){
			data[$(this).attr('name')] = $(this).val();
		});
		callback(null, data);
	} catch(err) {
		callback(err);
	}
}

function callAcre(type, options, callback) {
	if(typeof options === 'function') {
		callback = options;
	}
	try {
		if(type === 'GET') {
			needle.get('http://www2.county.allegheny.pa.us/RealEstate/Search.aspx', function(err, res) {
				if(err){
					callback(err);
				} else {
					callback(null, res.body);
				}
			});
		}
		if(type === 'POST') {
			needle.post('http://www2.county.allegheny.pa.us/RealEstate/Search.aspx', options, void(0), function(err, res) {
				if(err) {
					callback(err);
				} else {
					callback(null, res.body);
				}
			}); 
		}
	} catch(e) {
		callback(e);
	}
}

exports.getStreet = function(streetName, callback) {
	credentials.get(function(err, credentials) {
		if(err)console.log(err);	
		credentials.txtStreetName = streetName;
		callAcre('POST', credentials, function(err, html) {
			if(err)console.log(err);
			var removeSpaces = html.replace(/\s\s+/g, ' ');
			var $ = cheerio.load(removeSpaces);
			var json = [];
			$('#dgSearchResults tr').each(function($index) { 
				if($index > 0 && $index < $('#dgSearchResults tr').length - 1) { 
					var fields = $(this).children('td');
					var house = {
						'parcel_id': $(fields[0]).text().trim(), 
						'owner_name': $(fields[1]).text().trim(), 
						'address': $(fields[2]).text().trim(), 
						'municipality': $(fields[3]).text().trim(),
						'vacant': ($(fields[4]).text().trim() === '' ? 'no' : $(fields[4]).text().trim()) 
					};
					json.push(house);
				}
			});
			callback(json);
		});
	});
}

exports.getParcel = function(parcelId, callback) {
	var parcelParts = parcelId.split('-');
	if(parcelParts !== 5) {
		var err = new Error();
		err.message = "Parcel ID must be 5 sections long, separated by '-'";
		callback(err);
	}
	needle.get("http://www2.county.allegheny.pa.us/RealEstate/GeneralInfo.aspx?ParcelID=" + parcelParts.join(''), function(err, html) {
		if(err)callback(err);
		var removeSpaces = html.replace(/\s\s+/g, ' ');
		var $ = cheerio.load(removeSpaces);
		// REFACTOR THIS WITH GET HOUSE LATER ON
		var json = [];
		var house = {
			'':
		}
		callback(null, house);
	}
}
