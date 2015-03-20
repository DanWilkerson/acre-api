var cheerio = require('cheerio');
var needle  = require('needle');

// Manage our requests to prevent overloading the server
var Connections = (function Connections(){
	
	var _Connections        = {};
	var _queue             = [];
	var currentConnections = 0; 
	var maxConnections     = 20;

	var check = function ConnectionsCheck() {

		if(currentConnections < maxConnections) {

			var availableConnections = maxConnections - currentConnections < _queue.length ? maxConnections - currentConnections : _queue.length; 
			process(availableConnections);

		}

	};

	var process = function ConnectionsProcess(num) {

		var i;
	
		for(i = 0; i < num; i++){

			_queue[0]();
			_queue.splice(0, 1);
			currentConnections++;

		}

	};

	_Connections.add = function ConnectionsAdd(item) {

		_queue.push(item);
		check();

	};

	_Connections.remove = function ConnectionsRemove() {

		currentConnections--;
		check();

	};

	return _Connections;

})();

var Parser = (function Parser(){

	var _Parser = {};

	function _dollarsToNumber(dollarsStr) {

		var dollars      = dollarsStr.replace(/[$\,]/g, '');
		var dollarsFloat = parseFloat(dollars); 
		var dollarsDec   = Math.round(dollarsFloat * 100) / 100;

		return dollarsDec;

	}

	function _squareFootageToNumber(squareFootage) {

		var squareFootageStr = squareFootage.replace(',', '');
		var squareFootageNum = parseInt(squareFootageStr);
		
		return squareFootageNum;

	}

	_Parser.generalInfo = function(html) {

		var removeSpaces = html.replace(/\s\s+/g, ' ');
		var $ = cheerio.load(removeSpaces);
		
		var parcelId      = $('#BasicInfo1_lblParcelID').text().trim();
		var municipality  = $('#BasicInfo1_lblMuni').text().trim();
		var address       = $('#BasicInfo1_lblAddress').html() ? $('#BasicInfo1_lblAddress').html().replace(/(<br>|&#xA0;|&nbsp;|\s)/g, ' ') : ''; 
		var ownerName     = $('#BasicInfo1_lblOwner').text().trim();
		var school        = $('#lblSchool').text().trim();
		var taxCode       = $('#lblTax').text().trim();
		var ownerCode     = $('#lblOwnerCode').text().trim();
		var stateCode     = $('#lblState').text().trim();
		var useCode       = $('#lblUse').text().trim();
		var homestead     = $('#lblHomestead').text().trim();
		var farmstead     = $('#lblFarmstead').text().trim();
		var nghCode       = $('#lblNeighbor').text().trim();
		var recordingDate = $('#lblSaleDate').text().trim();
		var salePrice     = _dollarsToNumber( $('#lblSalePrice').text().trim() );
		var deedBook      = $('#lblDeedBook').text().trim();
		var deedPage      = $('#lblDeedPage').text().trim();
		var abatement     = $('#lblAbatement').text().trim();
		var lotArea       = _squareFootageToNumber( $('#lblLot').text().trim() );

		var twentyFifteenFmv = {};
		    twentyFifteenFmv.landValue      = _dollarsToNumber( $('#lblFullLand').text() ); 
		    twentyFifteenFmv.buildingValue  = _dollarsToNumber( $('#lblFullBuild').text() );
		    twentyFifteenFmv.totalValue     = _dollarsToNumber( $('#lblFullTot').text() );

		var twentyFifteenCav = {};	
		    twentyFifteenCav.landValue      = _dollarsToNumber( $('#lblCountyLand').text() );
		    twentyFifteenCav.buildingValue  = _dollarsToNumber( $('#lblCountyBuild').text() );
		    twentyFifteenCav.totalValue     = _dollarsToNumber( $('#lblCountyTot').text() );

		var twentyFourteenFmv = {};
		    twentyFourteenFmv.landValue     = _dollarsToNumber( $('#lblFullLand12').text() );
		    twentyFourteenFmv.buildingValue = _dollarsToNumber( $('#lblfullBuild12').text() );
		    twentyFourteenFmv.totalValue    = _dollarsToNumber( $('#lblFullTot12').text() );
		
		var twentyFourteenCav = {};
		    twentyFourteenCav.landValue     = _dollarsToNumber( $('#lblCountyLand12').text() );
		    twentyFourteenCav.buildingValue = _dollarsToNumber( $('#lblCountyBuild12').text() );
		    twentyFourteenCav.totalValue    = _dollarsToNumber( $('#lblCountyTot12').text() );

		var parcel = {
			'parcelId'        : parcelId,
			'municipality'    : municipality,
			'address'         : address,
			'ownerName'       : ownerName,
			'school'          : school,
			'taxCode'         : taxCode,
			'ownerCode'       : ownerCode,
			'stateCode'       : stateCode,
			'useCode'         : useCode,
			'homestead'       : homestead,
			'farmstead'       : farmstead,
			'neighborhoodCode': nghCode,
			'recordingDate'   : recordingDate,
			'salePrice'       : salePrice,
			'deedBook'        : deedBook,
			'deedPage'        : deedPage,
			'abatement'       : abatement,
			'lotArea'         : lotArea,
			'twentyFifteenFullMarketValue'     : twentyFifteenFmv,
			'twentyFifteenCountyAssessedValue' : twentyFifteenCav,
			'twentyFourteenFullMarketValue'    : twentyFourteenFmv,
			'twentyFourteenCountyAssessedValue': twentyFourteenCav
		};
		
		return parcel;

	};

	_Parser.buildingInfo = function ParserBuildingInfo(html) {

		var removeSpaces = html.replace(/\s\s+/g, ' ');
		var $ = cheerio.load(removeSpaces);
		
		var parcelId     = $('#BasicInfo1_lblParcelID').text().trim();
		var municipality = $('#BasicInfo1_lblMuni').text().trim();
		var address      = $('#BasicInfo1_lblAddress').html().replace(/(<br>|&#xA0;|&nbsp;|\s)/g, ' '); 
		var ownerName    = $('#BasicInfo1_lblOwner').text().trim();
		var useType      = $('#lblUse').text().trim();
		var totalRooms   = parseInt( 0 + $('#lblResTotRooms').text().trim() );
		var basement     = $('#lblResBasement').text().trim();
		var style        = $('#lblResStyle').text().trim();
		var bedrooms     = parseInt( 0 + $('#lblResBedrooms').text().trim() );
		var grade        = $('#lblGrade').text().trim();
		var stories      = parseInt( 0 + $('#lblResStories').text().trim() );
		var fullBaths    = parseInt( 0 + $('#lblResFullBath').text().trim() );
		var condition    = $('#lblResCondition').text().trim();
		var yearBuilt    = $('#lblResYearBuilt').text().trim();
		var halfBaths    = parseInt( 0 + $('#lblResHalfBath').text().trim() );
		var fireplaces   = parseInt( 0 + $('#lblFireplace').text().trim() );
		var exterior     = $('#lblResExtFinish').text().trim();
		var heat         = $('#lblResHeat').text().trim();
		var garages      = parseInt( 0 + $('#lblResGarage').text().trim() );
		var roof         = $('#lblResRoofType').text().trim();
		var cooling      = $('#lblResCool').text().trim();
		var livableSqFt  = _squareFootageToNumber( $('#lblResLiveArea').text().trim() );

		var parcel = {
			parcelId         : parcelId,
			municipality     : municipality,
			address          : address,
			ownerName        : ownerName,
			useType          : useType,
			totalRooms       : totalRooms,
			basement         : basement,
			style            : style,
			bedrooms         : bedrooms,
			grade            : grade,
			stories          : stories,
			fullBaths        : fullBaths,
			condition        : condition,
			yearBuilt        : yearBuilt,
			halfBaths        : halfBaths,
			fireplaces       : fireplaces,
			exterior         : exterior,
			heat             : heat,
			garages          : garages,
			roof             : roof,
			cooling          : cooling,
			livableSquareFeet: livableSqFt
		};

		return parcel;

	};

	_Parser.taxInfo = function ParserTaxInfo(html) {

		var removeSpaces = html.replace(/\s\s+/g, ' ');
		var $ = cheerio.load(removeSpaces);
		
		var parcelId             = $('#BasicInfo1_lblParcelID').text().trim();
		var municipality         = $('#BasicInfo1_lblMuni').text().trim();
		var address              = $('#BasicInfo1_lblAddress').html().replace(/(<br>|&#xA0;|&nbsp;|\s)/g, ' '); 
		var ownerName            = $('#BasicInfo1_lblOwner').text().trim();
		var taxBillAddr          = $('#lblMortgage').text().trim();
		var netTaxDueThisMonth   = _dollarsToNumber( $('#lblNetTax').text().trim() );
		var grossTaxDueNextMonth = _dollarsToNumber( $('#lblGrossTax').text().trim() );
		var taxValue             = _dollarsToNumber( $('#lblTaxValue').text().trim() );
		var millageRate          = Math.round( parseFloat( $('#Label10').text().trim() ) * 100 ) / 100;
	
		var taxHistory = {};

                $('#lblTaxInfo tr').each( function($index) {

                        if($index > 0) {

                                var fields = $(this).children('td');
                                var year   = fields.eq(0).text().trim();
                                var info   = { 
                                        paidStatus: fields.eq(1).text().trim(),
                                        tax       : _dollarsToNumber( fields.eq(2).text().trim() ),
                                        penalty   : _dollarsToNumber( fields.eq(3).text().trim() ),
                                        interest  : _dollarsToNumber( fields.eq(4).text().trim() ),
                                        total     : _dollarsToNumber( fields.eq(5).text().trim() ),
                                        datePaid  : fields.eq(6).text().trim()
                                };  

                                taxHistory[year] = info;
                             
                        }   

                }); 	

		var parcel = {
			parcelId            : parcelId,
			municipality        : municipality,
			address             : address,
			ownerName           : ownerName,
			taxBillAddr         : taxBillAddr,
			netTaxDueThisMonth  : netTaxDueThisMonth,
			grossTaxDueNextMonth: grossTaxDueNextMonth,
			taxValue            : taxValue,
			millageRate         : millageRate,
			taxHistory          : taxHistory
		};
	
		return parcel;

	};
	
	_Parser.ownerHistory = function ParserOwnerHistory(html) {

		var removeSpaces = html.replace(/\s\s+/g, ' ');
		var $ = cheerio.load(removeSpaces);
		
		var parcelId     = $('#BasicInfo1_lblParcelID').text().trim();
		var municipality = $('#BasicInfo1_lblMuni').text().trim();
		var address      = $('#BasicInfo1_lblAddress').html().replace(/(<br>|&#xA0;|&nbsp;|\s)/g, ' '); 
		var ownerName    = $('#BasicInfo1_lblOwner').text().trim();
		var deedBook     = $('#lblDeedBook').text().trim();
		var deedPage     = $('#lblDeedPage').text().trim();
		var ownerHistory = [];
	
		_parseOwners(1);

		function _parseOwners(n) {

			if( $('#lblPrevOwner' + n).length > 0 ) {

				var owner     = $('#lblPrevOwner' + n).text().trim();
				var saleDate  = $('#lblSaleDate' + n).text().trim();
				var ownerInfo = {
					owner   : owner,
					saleDate: saleDate
				};

				_parseOwners(n + 1);
				ownerHistory.push(ownerInfo);

			}

		}

		var parcel = {
			parcelId    : parcelId,
			municipality: municipality,
			address     : address,
			ownerName   : ownerName,
			deedBook    : deedBook,
			deedPage    : deedPage,
			ownerHistory: ownerHistory
		};

		return parcel;

	};

	_Parser.image = function ParserImage(html) {

		var removeSpaces = html.replace(/\s\s+/g, ' ');
		var $ = cheerio.load(removeSpaces);
		
		var parcelId     = $('#BasicInfo1_lblParcelID').text().trim();
		var municipality = $('#BasicInfo1_lblMuni').text().trim();
		var address      = $('#BasicInfo1_lblAddress').html().replace(/(<br>|&#xA0;|&nbsp;|\s)/g, ' '); 
		var ownerName    = $('#BasicInfo1_lblOwner').text().trim();
		var image        = $('#imgPicture').attr('src');

		var parcel = {
			parcelId    : parcelId,
			municipality: municipality,
			address     : address,
			ownerName   : ownerName,
			image       : image
		};

		return parcel;

	};

	_Parser.comps = function ParserComps(html) {
	
		var removeSpaces = html.replace(/\s\s+/g, ' ');
		var $ = cheerio.load(removeSpaces);
		
		var parcelId     = $('#BasicInfo1_lblParcelID').text().trim();
		var municipality = $('#BasicInfo1_lblMuni').text().trim();
		var address      = $('#BasicInfo1_lblAddress').html().replace(/(<br>|&#xA0;|&nbsp;|\s)/g, ' '); 
		var ownerName    = $('#BasicInfo1_lblOwner').text().trim();
		var comps        = [];

		_parseCompDetails(0);

		function _parseCompDetails(n) {
			
			if( $('#lblAddress' + n).length > 0 ) {
		
				var address     = $('#lblAddress' + n).text().replace(/\s+/g, ' ');
				var yearBuilt   = $('#lblYearBuilt' + n).text().trim();
				var parcelId    = n === 0 ? $('#lblParcelID' + n).text().trim() : $('#btnParcelID' + n).text().trim();
				var salePrice   = _dollarsToNumber( $('#lblSalePrice' + n).text().trim() );
				var saleDate    = $('#lblSaleDate' + n).text().trim();
				var livableSqFt = _squareFootageToNumber( $('#lblFinLiv' + n).text().trim() );
				var landValue   = _dollarsToNumber( $('#lblLand' + n).text().trim() );
				var bldgValue   = _dollarsToNumber( $('#lblBuild' + n).text().trim() );
				var totalValue  = _dollarsToNumber( $('#lblTotal' + n).text().trim() );
			
				var comp = {
					address          : address,
					yearBuilt        : yearBuilt,
					parcelId         : parcelId,
					salePrice        : salePrice,
					saleDate         : saleDate,
					livableSquareFeet: livableSqFt,
					landValue        : landValue,
					bldgValue        : bldgValue,
					totalValue       : totalValue
				};

				comps.push(comp);
				_parseCompDetails(n + 1);			

			}
		
		}

		var parcel = {
			parcelId    : parcelId,
			municipality: municipality,
			address     : address,
			ownerName   : ownerName,
			comps       : comps
		};

		return parcel;

	};

	_Parser.searchResults = function(html) {

		var removeSpaces = html.replace(/\s\s+/g, ' ');
		var $ = cheerio.load(removeSpaces);
		var parcels = [];

		$('#dgSearchResults tr').each(function($index) { 

			if($index > 0 && $index < $('#dgSearchResults tr').length - 1) {

				var fields       = $(this).children('td');
				var parcelId     = $(fields[0]).text().trim(); 
				var ownerName    = $(fields[1]).text().trim(); 
				var address      = $(fields[2]).text().trim(); 
				var municipality = $(fields[3]).text().trim();
				var vacant       = $(fields[4]).text().trim(); 

				var parcel = {
					'parcel_id'   : parcelId, 
					'owner_name'  : ownerName, 
					'address'     : address, 
					'municipality': municipality,
					'vacant'      : vacant === '' ? 'no' : vacant 
				};

				parcels.push(parcel);

			}

		});

		return parcels;

	};

	_Parser.pagination = function(html) {

		var $ = cheerio.load(html);
		var resultsPages = $('a[href^="javascript:__doPostBack"]');
		var pageUrls = {};

		resultsPages.each(function() { 

			var anchorText = $(this).text();
			var link       = $(this).attr('href');
			var ctlNum     = link.match(/dgSearchResults\$_ctl19\$_ctl\d+/)[0];
			
			if(ctlNum !== 'dgSearchResults$_ctl19$_ctl0') {

				pageUrls[anchorText] = ctlNum;

			}

		});

		return pageUrls;

	};

	_Parser.stateData = function(html) {

			var $ = cheerio.load(html);
			var stateData = {};

			$('input').each(function(){
				
				var $this = $(this);
				var inputName = $this.attr('name');
				var inputVal  = $this.val() || '';

				stateData[inputName] = inputVal;

			});

			return stateData;

	};

	return _Parser;

})();

var State = (function() {

        var _State = {};
        var _storedState;

        _State.get = function StateGet(callback) {

                if(typeof _storedState !== 'undefined') {

			callback(null, _storedState);

		} else {

			callAcre('get', 'search', {}, function(err, html) {

				if(err) { 

					callback(err);

				} else {

					_storedState = Parser.stateData(html);
					callback(null, _storedState);

				}

			});

		}

	};

	_State.set = function(state) {

		_storedState = state;

	};

	return _State;

})();

var callAcre = (function(){

	var _hostname  = 'http://www2.county.allegheny.pa.us';
	var _endpoints = {
		search      : '/RealEstate/Search.aspx',
		generalInfo : '/RealEstate/GeneralInfo.aspx',
		buildingInfo: '/RealEstate/Building.aspx',
		taxInfo     : '/RealEstate/Tax.aspx',
		ownerHistory: '/RealEstate/Sales.aspx',
		image       : '/RealEstate/Images.aspx',
		comps       : '/RealEstate/Comps.aspx'
	};
	
	var _callAcre = function(type, endpoint, payload, callback) {

		Connections.add(function() {

			needle.request(type, _hostname + _endpoints[endpoint], payload, {'follow':true}, function(err, res) {

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

		callAcre('GET', endpoint, params, function(err, html) { 

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

					callAcre('POST', 'search', _state, function(err, html) {

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
			delete state['Header1:btnLogInOut'];
			delete state['Header1:Button1'];

			return state;

		}

		function _getResultsPage(state, callback) {

			callAcre('POST', 'search', state, function(err, html) {

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

				callAcre('POST', 'search', _state, function(err, html) {

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

			for(key in pages) {
				
				if(pages.hasOwnProperty(key)) {

					reqCounter++;

					_state.__EVENTTARGET = pages[key];
					_getResultsPage(_state, function(err, parcels) {

						if(err) {

							callback(err);

						} else {

							_parcels = _parcels.concat(parcels);
							reqCounter--;

							if(reqCounter === 0 && finishedPagination ) {

								callback(null, _parcels);

							}

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

	var muniIndex = {
		'Aleppo': 901,
		'Aspinwall': 801,
		'Avalon': 802,
		'Baldwin Boro': 877,
		'Baldwin Twp': 902,
		'Bell Acres': 883,
		'Bellevue': 803,
		'Ben Avon': 804,
		'Ben Avon Heights': 805,
		'Bethel Park': 876,
		'Blawnox': 806,
		'Brackenridge': 807,
		'Braddock': 808,
		'Braddock Hills': 872,
		'Bradford Woods': 809,
		'Brentwood': 810,
		'Bridgeville': 811,
		'Carnegie': 812,
		'Castle Shannon': 813,
		'Chalfant': 814,
		'Cheswick': 815,
		'Churchill': 816,
		'Clairton -     All Wards': 2,
		'Clairton - 1st Ward': 201,
		'Clairton - 2nd Ward': 202,
		'Collier': 905,
		'Coraopolis': 817,
		'Crafton': 818,
		'Crescent': 906,
		'Dormont': 819,
		'Dravosburg': 820,
		'Duquesne - All Wards': 3,
		'Duquesne - 1st Ward': 301,
		'Duquesne - 2nd Ward': 302,
		'Duquesne - 3rd Ward': 303,
		'East Deer': 907,
		'East McKeesport': 821,
		'East Pittsburgh': 822,
		'Edgewood': 823,
		'Edgeworth': 824,
		'Elizabeth Boro': 825,
		'Elizabeth Twp': 908,
		'Emsworth': 826,
		'Etna': 827,
		'Fawn': 909,
		'Findlay': 910,
		'Forest Hills': 828,
		'Forward': 911,
		'Fox Chapel': 868,
		'Franklin Park': 884,
		'Frazer': 913,
		'Glassport': 829,
		'Glen Osborne': 846,
		'Glenfield': 830,
		'Green Tree': 831,
		'Hampton': 914,
		'Harmar': 915,
		'Harrison': 916,
		'Haysville': 832,
		'Heidelberg': 833,
		'Homestead': 834,
		'Indiana': 917,
		'Ingram': 835,
		'Jefferson Hills': 878,
		'Kennedy': 919,
		'Kilbuck': 920,
		'Leet': 921,
		'Leetsdale': 836,
		'Liberty': 837,
		'Lincoln': 881,
		'Marshall': 923,
		'McCandless': 927,
		'McDonald': 841,
		'McKees Rocks': 842,
		'McKeesport - All Wards': 4,
		'McKeesport - 1st Ward': 401,
		'McKeesport - 2nd Ward': 402,
		'McKeesport - 3rd Ward': 403,
		'McKeesport - 4th Ward': 404,
		'McKeespore - 5th Ward': 405,
		'McKeesport - 6th Ward': 406,
		'McKeesport - 7th Ward': 407,
		'McKeesport - 8th Ward': 408,
		'McKeesport - 9th Ward': 409,
		'McKeesport - 10th Ward': 410,
		'McKeesport - 11th Ward': 411,
		'McKeesport - 12th Ward': 412,
		'Millvale': 838,
		'Monroeville': 879,
		'Moon': 925,
		'Mt. Lebanon': 926,
		'Mt. Oliver': 839,
		'Munhall': 840,
		'Neville': 928,
		'North Braddock': 843,
		'North Fayette': 929,
		'North Versailles': 930,
		'Oakdale': 844,
		'Oakmont': 845,
		'OHara': 931,
		'Ohio': 932,
		'Penn Hills': 934,
		'Pennsbury Village': 871,
		'Pine': 935,
		'Pitcairn': 847,
		'Pittsburgh - All Wards': 1,
		'Pittsburgh - 1st Ward': 101,
		'Pittsburgh - 2nd Ward': 102,
		'Pittsburgh - 3rd Ward': 103,
		'Pittsburgh - 4th Ward': 104,
		'Pittsburgh - 5th Ward': 105,
		'Pittsburgh - 6th Ward': 106,
		'Pittsburgh - 7th Ward': 107,
		'Pittsburgh - 8th Ward': 108,
		'Pittsburgh - 9th Ward': 109,
		'Pittsburgh - 10th Ward': 110,
		'Pittsburgh - 11th Ward': 111,
		'Pittsburgh - 12th Ward': 112,
		'Pittsburgh - 13th Ward': 113,
		'Pittsburgh - 14th Ward': 114,
		'Pittsburgh - 15th Ward': 115,
		'Pittsburgh - 16th Ward': 116,
		'Pittsburgh - 17th Ward': 117,
		'Pittsburgh - 18th Ward': 118,
		'Pittsburgh - 19th Ward': 119,
		'Pittsburgh - 20th Ward': 120,
		'Pittsburgh - 21st Ward': 121,
		'Pittsburgh - 22nd Ward': 122,
		'Pittsburgh - 23rd Ward': 123,
		'Pittsburgh - 24th Ward': 124,
		'Pittsburgh - 25th Ward': 125,
		'Pittsburgh - 26th Ward': 126,
		'Pittsburgh - 27th Ward': 127,
		'Pittsburgh - 28th Ward': 128,
		'Pittsburgh - 29th Ward': 129,
		'Pittsburgh - 30th Ward': 130,
		'Pittsburgh - 31st Ward': 131,
		'Pittsburgh - 32nd Ward': 132,
		'Pleasant Hills': 873,
		'Plum': 880,
		'Port Vue': 848,
		'Rankin': 849,
		'Reserve': 937,
		'Richland': 938,
		'Robinson': 939,
		'Ross': 940,
		'Rosslyn Farms': 850,
		'Scott': 941,
		'Sewickley': 851,
		'Sewickley Heights': 869,
		'Sewickley Hills': 882,
		'Shaler': 944,
		'Sharpsburg': 852,
		'South Fayette': 946,
		'South Park': 945,
		'South Versailles': 947,
		'Springdale Boro': 853,
		'Springdale Twp': 948,
		'Stowe': 949,
		'Swissvale': 854,
		'Tarentum': 855,
		'Thornburg': 856,
		'Trafford': 857,
		'Turtle Creek': 858,
		'Upper St. Clair': 950,
		'Verona': 859,
		'Versailles': 860,
		'Wall': 861,
		'West Elizabeth': 862,
		'West Deer': 952,
		'West Homestead': 863,
		'West Mifflin': 870,
		'West View': 864,
		'Whitaker': 865,
		'White Oak': 875,
		'Whitehall': 874,
		'Wilkins': 953,
		'Wilkinsburg': 866,
		'Wilmerding': 867
	};

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
