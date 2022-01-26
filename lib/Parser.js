var cheerio = require('cheerio');
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

		var thisYearFmv = {};
		    thisYearFmv.landValue      = _dollarsToNumber( $('#lblFullLand').text() ); 
		    thisYearFmv.buildingValue  = _dollarsToNumber( $('#lblFullBuild').text() );
		    thisYearFmv.totalValue     = _dollarsToNumber( $('#lblFullTot').text() );

		var thisYearCav = {};	
		    thisYearCav.landValue      = _dollarsToNumber( $('#lblCountyLand').text() );
		    thisYearCav.buildingValue  = _dollarsToNumber( $('#lblCountyBuild').text() );
		    thisYearCav.totalValue     = _dollarsToNumber( $('#lblCountyTot').text() );

		var lastYearFmv = {};
		    lastYearFmv.landValue     = _dollarsToNumber( $('#lblFullLand12').text() );
		    lastYearFmv.buildingValue = _dollarsToNumber( $('#lblfullBuild12').text() );
		    lastYearFmv.totalValue    = _dollarsToNumber( $('#lblFullTot12').text() );
		
		var lastYearCav = {};
		    lastYearCav.landValue     = _dollarsToNumber( $('#lblCountyLand12').text() );
		    lastYearCav.buildingValue = _dollarsToNumber( $('#lblCountyBuild12').text() );
		    lastYearCav.totalValue    = _dollarsToNumber( $('#lblCountyTot12').text() );

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
			'fullMarketValues'    : {
				'this_year' : thisYearFmv,
				'last_year' : lastYearFmv
			},
			'countyAssessedValues' : {
				'this_year' : thisYearCav,
				'last_year' : lastYearFmv
			}
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
																};
																if (info.paidStatus == 'PAID') {
																				info = Object.assign(info, {
																							penalty   : _dollarsToNumber( fields.eq(3).text().trim() ),
																							interest  : _dollarsToNumber( fields.eq(4).text().trim() ),
																							total     : _dollarsToNumber( fields.eq(5).text().trim() ),
																							datePaid  : fields.eq(6).text().trim()
																				});  
																}

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
        var salePrice = Number($('#lblSalePrice' + n).text().replace(/[$,]/g, ''));
				var ownerInfo = {
					owner   : owner,
					saleDate: saleDate,
          salePrice: salePrice
				};

				// Ignore if we have no information
				if (owner || saleDate || salePrice) {
					ownerHistory.push(ownerInfo);
					_parseOwners(n + 1);
				}

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

				// Ignore empty values
				if (address || yearBuilt || parcelId || salePrice || saleDate || 
					  livableSqFt || landValue || bldgValue || totalValue) {
					comps.push(comp);
					_parseCompDetails(n + 1);			
				}

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
			var ctlNum     = link.match(/dgSearchResults\$ctl1[09]\$ctl\d+/);
			
			if(ctlNum && ctlNum[0].split('').pop() !== '0') {

				pageUrls[anchorText] = ctlNum[0];

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

module.exports = Parser;
