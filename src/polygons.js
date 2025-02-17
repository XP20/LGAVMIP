const { Console } = require('console');
const fs = require('fs');
import { parseString } from 'xml2js';
import { promisify } from 'util';

const parseXMLString = promisify(parseString);

async function parseKMLPolygonCoordinates(kmlString) {
  try {
    const result = await parseXMLString(kmlString);
    
    // Navigate through the parsed object structure to find coordinates
    const coordinates = result.kml.Document[0].Placemark[0].Polygon[0]
      .outerBoundaryIs[0].LinearRing[0].coordinates[0];
    return coordinates
      .trim()
      .split(' ')
      .filter(coord => coord.trim())
      .map(coordSet => {
        const [lng, lat] = coordSet.split(',');
        return [parseFloat(lng), parseFloat(lat)]
      });
  } catch (error) {
    console.error('Error parsing KML:', error);
    throw error;
  }
}

fs.readFile('./src/locations_raw_data/Centrs.kml', 'utf8', async function (err, data)  {
    let string = data.toString();
    let coordinatesArr = await parseKMLPolygonCoordinates(string);
   // console.log(coords);

    let latitudeArr = [];
    let longitudeArr = [];
    for (let index = 0; index < coordinatesArr.length; index++) {
        [longitudeArr[index], latitudeArr[index]] = coordinatesArr[index];
    }
    let minimumLat = Math.min(...latitudeArr);
    let maximumLat = Math.max(...latitudeArr);
    let minimumLon = Math.min(...longitudeArr);
    let maximumLon = Math.max(...longitudeArr);
    let latLongLiteral = '[{'
    for (let index = 0; index < coordinatesArr.length; index++) {
        let coordinates = coordinatesArr[index];
        if (index < coordinatesArr.length-1) {
            latLongLiteral += ('lng: ' + coordinates[0] + ', lat: ' + coordinates[1] + '}, {');
        } else {
            latLongLiteral += ('lng: ' + coordinates[0] + ', lat: ' + coordinates[1] + '}]');
        }
    }
    //console.log(latitudeArr);
    console.log(latLongLiteral);
    console.log(minimumLat + ', ' + minimumLon+ ', ' + maximumLat+ ', ' + maximumLon);
});
