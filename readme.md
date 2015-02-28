#The Unofficial Allegheny County Real Estate API
An unofficial API for retrieving property data from the Allegheny County Real Estate web service.
##Getting Started
	npm install acre-api
	
	var acreApi = require('acreApi');
	acreApi.getStreet('Liberty', function(err, houses) {
		if(err) {
			console.log(err);
		} else {
			// Prints a list of houses on the street
			console.log(houses);
		}
	});

##Streets
###getStreet
Get the first 20 houses on a particular street.The street name should not include St, Dr, or Ave.
	acreApi.getStreet('Liberty', function(err, houses) {	
		if(err) {
			console.log(err);
		} else {
			// Prints a list of houses on the street
			console.log(houses);
		}
	});
Example output:
	[ 
		{ 
			parcel_id: '0001-C-00200-0000-01',
			owner_name: 'PORT AUTHORITY OF ALLEGHENY COUNTY',
			address: 'LIBERTY AVE',
			municipality: 'PITTSBURGH - 1ST WARD',
			vacant: 'no' 
		},{ 
			parcel_id: '0001-C-00200-0000-00',
			owner_name: 'HERTZ GATEWAY CENTER LP',
			address: 'LIBERTY AVE',
			municipality: 'PITTSBURGH - 1ST WARD',
			vacant: 'no' 
		},{ 
			parcel_id: '0001-F-00048-0000-00',
			owner_name: 'COMMONWEALTH OF PENNSYLVANIA',
			address: 'LIBERTY AVE',
			municipality: 'PITTSBURGH - 1ST WARD',
			vacant: 'Yes' 
		}, ...
	]
##House:
###getParcel
Returns data on a specific Parcel ID. Parcel ID must be 5 parts, separated by dashes.

	acreApi.getParcel("0001-C-00200-0000-01", function(err, parcel) {
		if(err) {
			console.log(err);
		} else {
			// Prints information about the parcel
			console.log(parcel);
		}
	});
Example output:
	{
		parcel_id: '0001-C-00200-0000-01',
		municipality: '101  PITTSBURGH - 1ST WARD',
		address: 'LIBERTY AVEPITTSBURGH, PA 15222',
		owner_name: 'PORT AUTHORITY OF ALLEGHENY COUNTY',
		school: 'City Of Pittsburgh',
		tax_code: 'Exempt',
		owner_code: 'Corporation',
		state_code: 'Government',
		use_code: 'COUNTY GOVERNMENT',
		homestead: 'No',
		farmstead: 'No',
		neighborhood_code: '51C01',
		recording_date: 443768400000,
		sale_price: '$0',
		deed_book: '6495',
		deed_page: '289',
		abatement: 'No',
		lot_area: '5,768 SQFT',
		'2015_full_market_value': {
			 land_value: 346100,
			 building_value: 286300,
			 total_value: 632400
		},
		'2015_county_assessed_value': {
			 land_value: 346100,
			 building_value: 286300,
			 total_value: 632400
		},
		'2014_county_assessed_value': {
			 land_value: 346100,
			 building_value: 286300,
			 total_value: 632400
		}
	}
#Acknowledgements
The Allegheny County Real Estate API is maintained by [Dan Wilkerson]('http://danwilkerson.com') and is in no way associated with the government of Allegheny County, its affiliates, or its subsidiaries.
