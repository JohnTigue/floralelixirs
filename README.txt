This is a NPM package (as indicated by the package.json file) i.e. a bit of JavaScript toolery.

The goal is to update the map at http://floralelixir.com/locations/

Basically, this thing's job is to take a CSV (a *.csv file) and turn it into GeoJSON (a *.json file).
The input CSV contain zipcodes and this tool geocodes those i.e. turns zipcodes into latitude and longitude.
Then it turns the CSV into GeoJSON.


The code is in the src/ directory. It's a 2-step process so there are two programs:
1. zip2geo.js: reads a CSV and writes a CSV, along the way:
   1. reads the Zip column cell values
   2. geocodes Zip's cell values via a lookup 
      - zipcode.csv is the lookup with columns "zip","city","state","latitude","longitude","timezone","dst"
   3. stores the geocoding by adding two columns (Latitude and Longitude)
   4. writes out the enhanced table to a new CSV
   
2. csv2geojson.js: reads a CSV with "Latitude" and "Longitude" columns and translates/writes to GeoJSON
   1. Also adds info that will be needed for popups in the map:
      Street1, City, State, Zip, Website, Customer

More detailed documentation is to be found in src/zip2geo.js and src/csv2geojson.js.
So, CVS ==> zip2geo.js ==> CVS-geocoded ==> csv2geojson.js ==> elixir_locations.json
And elixir_locations.json gets uploaded to floralelixir.com

Give the above, the process to update the map is a follows

0. One time only, not upon every map update, in Terminal:
   1. "cd" (Change Directory) to the same directory as the one within which this file is located.
   2. Type:
      npm install

1. The data that will end up on the map originally lives in Excel.
   1. Export that Excel spreadsheet to CSV, say, website_map_data.csv
      - The CSV should have the following columns:
        Customer,Street1,City,State,Zip,Latitude,Longitude,Website
   2. Put that file in the same directory as this file.

2. In Terminal "cd" into the same directory as where this file is.

3. Type the following:
   node src/zip2geo.js website_map_data.csv website_map_data.geocoded.csv
   (i.e. perform the "CVS ==> zip2geo.js ==> CVS-geocoded" part)
   
4. Type the following:
   node src/csv2geojson.js website_map_data.geocoded.csv elixir_locations.json
   (i.e. perform the "CVS-geocoded ==> csv2geojson.js ==> elixir_locations.json")

5. FTP elixir_locations.json up to floralelixirs.com such that it can be found at
   http://www.floralelixir.com/assets/elixir_locations.json

6. Confirm the update has worked by visiting:
   http://www.floralelixir.com/locations/


Note, the files in the site/ directory are what is at floralelixirs.com/locations:
- index.html is the HTML page that loads as http://www.floralelixir.com/locations/
- cities.json, us-state-centroids.json, us.json are supporting files used to draw the map
- elixir_locations.json is the file produced, which will get stale over time
