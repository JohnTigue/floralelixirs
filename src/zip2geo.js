/* This reads a CSV and writes a CSV.
 * 
 * Along the way it:
 * 1. reads the Zip column cell values
 * 2. geocodes Zip's cell values via a lookup 
 * 3. stores the geocoding by adding two columns (Latitude and Longitude)
 *
 * The Zip => (Lat, Long) lookup is provided by the zipcode.csv file. 
 *
 * Usage:
 *   node src/zip2geo.js website_map_data.csv website_map_data.geocoded.csv
 */

(()=>{
'use strict';
  
let fs   = require('fs');
let d3   = require('d3');
let _    = require('lodash');
let path = require('path');
  
let inputFilename  = path.resolve(process.cwd(), process.argv[2]);
let outputFilename = path.resolve(process.cwd(), process.argv[3]);
console.log('Input file:\n  ' + inputFilename + '\n\nOutput file:\n  ' + outputFilename + '\n');
  
let geocodes = {};

// Read in all zipcodes into a lookup map (zip to coords)
fs.readFile(path.resolve(__dirname, 'zipcode.csv'), 'utf8', function(error, data) {
  data = d3.csvParseRows(data, (d,i) => {
    let zipcode = d[0];//parseInt(d[0]);
    geocodes[zipcode] = [d[3], d[4]];
    //console.log(d);
    //console.log(geocodes[zipcode]);
    return {};
    });
  //verbose: console.log(JSON.stringify(data));
  //console.log(data.length);
  //console.log(geocodes.length);
  //console.log(Object.keys(geocodes).length);
  //console.log('98122=' + geocodes['98122']);

  fs.readFile(inputFilename, 'utf8', function(error, data) {
    let locations = d3.csvParse(data);

    //console.log(locations);

    let locsGeocoded = locations.map((aLoc)=>{
      //console.log('aLoc.Zip=' + aLoc.Zip);
      let geocode = geocodes[aLoc.Zip];
      //console.log(aLoc.Zip + '=' + geocode);
      if(geocode){
        aLoc.Latitude = geocode[0];
        aLoc.Longitude = geocode[1];      
        } else {
  	  console.log('Bad zipcode:' + aLoc.Zip);
	  console.log(aLoc);
          }
      return aLoc;
      });
    
    var fileContentString = d3.csvFormat(locsGeocoded, ['Customer','Street1','City','State','Zip','Latitude','Longitude','Website']);

    fs.writeFile(outputFilename, fileContentString, function(err) {
      console.log("\n\nOutput file written. Number of locations = " + locsGeocoded.length);
      });
    
  });

  });

})();
