var Connections = require('./Connections.js');
var needle = require('needle');

var callAcre = (function(){

	var _hostname  = 'http://www2.alleghenycounty.us';
	var _endpoints = {
		search      : '/RealEstate/Search.aspx',
		generalInfo : '/RealEstate/GeneralInfo.aspx',
		buildingInfo: '/RealEstate/Building.aspx',
		taxInfo     : '/RealEstate/Tax.aspx',
		ownerHistory: '/RealEstate/Sales.aspx',
		image       : '/RealEstate/Images.aspx',
		comps       : '/RealEstate/Comps.aspx'
	};
	
	var n  = 0;
	var _callAcre = function(type, endpoint, payload, callback) {

		Connections.add(function() {

			needle.request(type, _hostname + _endpoints[endpoint], Object.assign({}, payload), {follow_max: 10}, function(err, res) {

				_handleResponseOrRecurse(err, res, type, endpoint, payload, callback);

			});

		});

	};

	function _handleResponseOrRecurse(err, res, type, endpoint, payload, callback) {

		Connections.remove();

		if(err) {

			if(err.code === 'ECONNRESET') {

				console.log(err);
				console.log('Connection reset - restarting...');
				setTimeout(function() {

					callAcre(type, endpoint, payload, callback);

				}, 500);

			} else {

				callback(err);

			}

		} else {

			callback(null, res.body);

		}

	}

	return _callAcre;

})();

module.exports = callAcre;
