// Mainly translates a CSV with lat and long columns and translates to geojson, one point geo-feature for each row in the CVS.
//
// Usage:
//   node csv2geojson.js website_map_data.geocoded.csv elixir_locations.json
//
// CSV Headers:
//   Customer,Street1,City,State,Zip,Latitude,Longitude,Website
//
// This also sets GeoJSON properties of the location for use in info tooltip popups:
//   Street1
//   City
//   State
//   Zip
//   Website
//   Customer
(()=>{
'use strict';
  
let fs = require('fs');
let d3 = require('d3');
let _  = require('lodash');

let inputFilename = process.argv[2];
let outputFilename = process.argv[3];
  console.log(inputFilename + ' to ' + outputFilename);
  
let geocodes = {};


fs.readFile(inputFilename, 'utf8', function(error, data) {
  let locations = d3.csvParse(data);

  //console.log(locations);

  let locsGeojsoned = locations.map((aLoc, i)=>{
    let aFeature = {
      type : 'Feature',
      id : i,
      geometry: {
	type: 'Point',
	coordinates: [ aLoc.Longitude, aLoc.Latitude ]
        },
      properties: {
	streetAddr: aLoc.Street1,
	city: aLoc.City,
	state: aLoc.State,
	zipcode: aLoc.Zip,
	website: aLoc.Website,
	bizName: aLoc.Customer
        }
      };
    return aFeature;
    });
    
  let geo = {
    type: 'FeatureCollection',
    features: locsGeojsoned
    };

  fs.writeFile(outputFilename, JSON.stringify(geo), function(err) {
    console.log("file written. Complete without errors.");
    });    
  });


})();
