var Parser = require(__dirname + '/lib/Parser.js');
var State = require(__dirname + '/lib/State.js');
var Api = require(__dirname + '/lib/Api.js');
var municipalities = require(__dirname + '/lib/municipalities.json');

var search = (function(){
	
	var _search = function(houseNumber, streetName, callback) {

		if(typeof houseNumber === 'undefined' || typeof streetName === 'undefined') {

			var err = new ReferenceError();
			err.message = (houseNumber ? 'streetName' : 'houseNumber') + 'is not defined';
			callback(err);

		} else {

			State.get(function(err, state) {

				if(err) {

					callback(err);
				
				} else {

					_callApi(state);

				}

			});

		}

		function _callApi(state) {
			
			state.radio1 = 'Address';
			state.txtStreetName = streetName;
			state.txtStreetNum = houseNumber;
      state.hiddenInputToUpdateATBuffer_CommonToolkitScripts = 1;

			callAcre('POST', 'search', state, function(err, html) {

				if(err) {

					callback(err);

				} else {

					_handleResponse(html);

				}

			});
		}

		function _handleResponse(html) {

			var parcel = Parser.generalInfo(html);
			callback(null, parcel);

		}

	};

	return _search;

})();

var parcel = (function(){

	var _parcel = {};

	function _checkDetails(parcelId, endpoint, callback) {

		if(typeof Parser[endpoint] === 'undefined') {

			var err = new ReferenceError();
			err.message = 'Endpoint ' + endpoint + ' is not defined.';
			callback(err);

		} else {
			
			var parcelParts = (parcelId || '').split('-');

			if(parcelParts.length !== 5) {

				var err = new TypeError();
				err.message = "Parcel ID must be 5 sections long, separated by '-'";
				callback(err);

			} else {

				_fetchData(parcelParts, endpoint, callback);

			}

		}

	}

	function _fetchData(parcelParts, endpoint, callback) {

		var params = {
			parcelId: parcelParts.join('')
		};

		Api('GET', endpoint, params, function(err, html) { 

			if(err) {

				callback(err);

			} else {

				var parcelData = Parser[endpoint](html);
				callback(null, parcelData);

			}

		});

	}

	_parcel.generalInfo = function parcelGeneralInfo(parcelId, callback) {

		_checkDetails(parcelId, 'generalInfo', callback);

	};

	_parcel.buildingInfo = function parcelBuildingInfo(parcelId, callback) {

		_checkDetails(parcelId, 'buildingInfo', callback);

	};

	_parcel.taxInfo = function parcelTaxInfo(parcelId, callback) {

		_checkDetails(parcelId, 'taxInfo', callback);

	};
	
	_parcel.ownerHistory = function parcelOwnerHistory(parcelId, callback) {

		_checkDetails(parcelId, 'ownerHistory', callback);

	};

	_parcel.image = function parcelImage(parcelId, callback) {

		_checkDetails(parcelId, 'image', callback);

	};

	_parcel.comps = function parcelComps(parcelId, callback) {

		_checkDetails(parcelId, 'comps', callback);

	};
	
	return _parcel;

})();

var street = (function(){

	var _street = {};
	
	_street.street = function streetStreet(streetName, municipality, callback) {

		var _parcels  = [];
		var reqCounter = 0;
		var finishedPagination = false;
		var _municipality = municipalities.search(municipality);

		if(!_municipality) {

			var err = new Error();
			err.message = 'Municipality not found.';
			callback(err);

		} else {

			State.get(function(err, state) {
				
				if(err) {
					
					callback(err);

				} else {
					
					var _state = _formatState(state);

					Api('POST', 'search', _state, function(err, html) {

						if(err) {

							callback(err);

						} else {

							var parcels = Parser.searchResults(html);
							_parcels = _parcels.concat(parcels);
							_paginationHandler(html, callback);

						}

					});

				}

			});

		}

		function _formatState(state) {
			state.ddlMuniCode     = _municipality;
			state.txtStreetName   = streetName;
			state.radio1          = 'Address';
			state.__LASTFOCUS     = '';
			state.__EVENTARGUMENT = '';

			delete state.undefined;
			delete state.btnSearch;
			delete state.TextBox2;
			delete state['Header1$btnLogInOut'];
			delete state['Header1$Button1'];

			return state;

		}

		function _getResultsPage(state, callback) {

			Api('POST', 'search', state, function(err, html) {

				if(err) {	

					callback(err);

				} else {

					var parcels = Parser.searchResults(html);
					callback(null, parcels);

				}

			});

		}

		function _paginationHandler(html, callback) {

			var state = Parser.stateData(html);
			var pages = Parser.pagination(html);
			var _state = _formatState(state);
			var key;

			if(pages['...']) {

				reqCounter++;
				_state.__EVENTTARGET = pages['...'];

				Api('POST', 'search', _state, function(err, html) {

					reqCounter--;

					if(err) {

						callback(err);

					} else {

						var parcels = Parser.searchResults(html);
						_parcels = _parcels.concat(parcels);
						_paginationHandler(html, callback);	

					}

				});

				delete pages['...'];

			} else {

				finishedPagination = true;

			}

      // If we have no results, just call our callback
      if(Object.keys(pages).length === 0) {

        return callback(null, _parcels);

      }

			for(key in pages) {
				
				if(pages.hasOwnProperty(key)) {

					reqCounter++;

					_state.__EVENTTARGET = pages[key];
					_getResultsPage(_state, function(err, parcels) {

						if(err) return callback(err);

            _parcels = _parcels.concat(parcels);
            reqCounter--;

            if(reqCounter === 0 && finishedPagination ) {

              return callback(null, _parcels);

						}

					});

				}

			}

		}

	};

	_street.block = function streetBlock(blockNumber, streetName, callback) {
		
		var _parcels    = [];
		var counter     = 100;
		var houseNumber = parseInt(blockNumber);
		
		if(isNaN(houseNumber)) {
		
			var err = new TypeError();
			err.message = 'Argument \'blockNumber\' in Street.block() must be a number';
			callback(err);

		}
		
		if(houseNumber < 100) {

			houseNumber = 0;

		} else { 

			houseNumber = parseInt( houseNumber.toString().slice(0,-2) + "00" ); 

		}


		var i;

		for(i = 0; i < 100; i++) {
			
			search(houseNumber, streetName, function(err, parcel) {	

				if(err) {

					callback(err);

				} else {

					if(parcel.parcelId === '') {

						counter--;

					} else {

						_parcels.push(parcel);

					}

					if(_parcels.length === counter) {

						callback(null, _parcels);

					}

				}

			});

			houseNumber++;

		}

	};

	return _street;

})();

var municipalities = (function() {

	var _municipalities = {};

	var muniIndex = municipalities; 
	_municipalities.search = function municipalitySearch(municipality) {
		if(muniIndex[municipality]) {
			return muniIndex[municipality];
		} else {
			return false;
		}
	};

	_municipalities.all = function() {
		return muniIndex;
	};

	return _municipalities;

})();

module.exports = {
	municipalities: municipalities,
	parcel: parcel,
	street: street,
	search: search
};
