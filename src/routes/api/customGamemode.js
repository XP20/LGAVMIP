const { Console } = require('console');
import { parseString } from 'xml2js';
import { promisify } from 'util';
import { Hono } from 'hono';
import { userLocations } from './locationStorage.js';
import { pregenSingle } from './location.js';
import { presetLocationStore } from './location.js';

const apiKML = new Hono();

const parseXMLString = promisify(parseString);

export async function parseKMLPolygonCoordinates(kmlString) {
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

apiKML.post('/', async (c) => {
  try {
    const formData = await c.req.formData();
    const kmlFile = formData.get('kmlFile');

    if (!kmlFile) {
      return c.json({ error: 'No KML file provided' }, 400);
    }
    const kmlString = await kmlFile.text();
    const coordinatesArr = await parseKMLPolygonCoordinates(kmlString);

    let latLngArray = []
    for (let index = 0; index < coordinatesArr.length; index++) {
      const lng = coordinatesArr[index][0];
      const lat = coordinatesArr[index][1];
      latLngArray[index] = {lng:lng, lat:lat}; //this sucks, parseKMLPolygonCoordinates should be made to return a latlngliteral array to begin with
    }

    const latitudeArr = [];
    const longitudeArr = [];
    
    for (let index = 0; index < coordinatesArr.length; index++) {
      [longitudeArr[index], latitudeArr[index]] = coordinatesArr[index];
    }
    
    const minimumLat = Math.min(...latitudeArr);
    const maximumLat = Math.max(...latitudeArr);
    const minimumLon = Math.min(...longitudeArr);
    const maximumLon = Math.max(...longitudeArr);
    let minMaxArray = [minimumLat, minimumLon, maximumLat, maximumLon];
    let gamemodeArray = [latLngArray, minMaxArray];
  } catch (error) {
    console.error('Error processing KML file:', error);
    return c.json({ error: 'Failed to process KML file' }, 500);
  }
});

export default apiKML;