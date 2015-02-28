var cheerio = require('cheerio');
var needle = require('needle');
/*
* Converts a dollar-formatted string into a number
*
* @param dollars string
* @return float rounded to two decimals
*/
function dollarsToNumber(dollars) {
	var dollarsStr = dollars.replace(/[$\,]/g, '');
	return Math.round( parseFloat(dollarsStr) * 100 ) / 100;
}

/**
 * Class credentials
 *
 * Retrieves and stores ASPX state information
 * for our queries
 *
 * @namespace credentials
 */
var credentials = (function() {
        var credentials = {};
        var privateCredentials;
	/**
	 * Get ASPX credentials; if none are stored, request
	 * new ones
	 *
	 * @param callback errback
	 *
	 * @public
	 */
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
	/**
	 * Set ASPX credentials from passed HTML
	 *
	 * @param html raw html string
	 * @param callback errback
	 *
	 * @public
	 */
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
	
	/**
	 * Parses ASPX credentials from server response 
	 *
	 * @param string html raw HTML response from server
	 * @callback function errback
	 *
	 * @private
	 */
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

	return credentials;
})();
/**
 * Request page from the web server
 *
 * @param type string type of request ('GET' or 'POST')
 * @param payload object with parameters to POST
 * @callback function errback
 *
 * @private
 */
function callAcre(type, payload, callback) {
	if(typeof payload === 'function') {
		callback = payload;
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
			needle.post('http://www2.county.allegheny.pa.us/RealEstate/Search.aspx', payload, void(0), function(err, res) {
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
/**
 * Method that gets the first twenty
 * houses on a given street and passes
 * the data as an array to the callback
 *
 * @param streetName string name of the street
 * @param callback function errback
 *
 * @public
 */
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
			callback(null, json); });
	});
}
/**
 * Method that passes the data about a specific
 * parcel ID to the callback
 *
 * @param parcelId string in format XXXX-XXXX-XXXX-XXXX-XXXX
 * @param callback function errback
 *
 * @public
 */
exports.getParcel = function(parcelId, callback) {
	var parcelParts = parcelId.split('-');
	if(parcelParts.length !== 5) {
		var err = new Error();
		err.message = "Parcel ID must be 5 sections long, separated by '-'";
		callback(err);
	}
	needle.get("http://www2.county.allegheny.pa.us/RealEstate/GeneralInfo.aspx?ParcelID=" + parcelParts.join(''), function(err, html) {
		if(err)callback(err);
		var removeSpaces = html.body.replace(/\s\s+/g, ' ');
		var $ = cheerio.load(removeSpaces);
		// REFACTOR THIS WITH GET HOUSE LATER ON
		var house = {
			'parcel_id': $('#BasicInfo1_lblParcelID').text().trim(),
			'municipality': $('#BasicInfo1_lblMuni').text().trim(),
			'address': $('#BasicInfo1_lblAddress').text().trim(),
			'owner_name': $('#BasicInfo1_lblOwner').text().trim(),
			'school': $('#lblSchool').text().trim(),
			'tax_code': $('#lblTax').text().trim(),
			'owner_code': $('#lblOwnerCode').text().trim(),
			'state_code': $('#lblState').text().trim(),
			'use_code': $('#lblUse').text().trim(),
			'homestead': $('#lblHomestead').text().trim(),
			'farmstead': $('#lblFarmstead').text().trim(),
			'neighborhood_code': $('#lblNeighbor').text().trim(),
			'recording_date': new Date( $('#lblSaleDate').text().trim() ).getTime(),
			'sale_price': $('#lblSalePrice').text().trim(),
			'deed_book': $('#lblDeedBook').text().trim(),
			'deed_page': $('#lblDeedPage').text().trim(),
			'abatement': $('#lblAbatement').text().trim(),
			'lot_area': $('#lblLot').text().trim(),
			'2015_full_market_value': {
				'land_value': dollarsToNumber( $('#lblFullLand').text() ),
				'building_value': dollarsToNumber( $('#lblFullBuild').text() ),
				'total_value': dollarsToNumber( $('#lblFullTot').text() )
			},
			'2015_county_assessed_value': {
				'land_value': dollarsToNumber( $('#lblCountyLand').text() ),
				'building_value': dollarsToNumber( $('#lblCountyBuild').text() ),
				'total_value': dollarsToNumber( $('#lblCountyTot').text() )
			},
			'2014_county_assessed_value': {
				'land_value': dollarsToNumber( $('#lblFullLand12').text() ),
				'building_value': dollarsToNumber( $('#lblFullBuild12').text() ),
				'total_value': dollarsToNumber( $('#lblFullTot12').text() )
			},
			'2014_county_assessed_value': {
				'land_value': dollarsToNumber( $('#lblCountyLand12').text() ),
				'building_value': dollarsToNumber( $('#lblCountyBuild12').text() ),
				'total_value': dollarsToNumber( $('#lblCountyTot12').text() )
			}
		};
		callback(null, house);
	});
}
