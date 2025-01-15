const fs = require('fs');

fs.readFile('./src/locations_raw_data/Dobele.geojson', 'utf8', function (err, data) {
    let place = JSON.parse(data);
    coordinatesArr = [...place.features[0].geometry.coordinates, ...place.features[1].geometry.coordinates, ...place.features[2].geometry.coordinates, ...place.features[3].geometry.coordinates];
    //console.log(coordinatesArr);
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
        coordinates = coordinatesArr[index];
        if (index < coordinatesArr.length-1) {
            latLongLiteral += ('lng: ' + coordinates[0] + ', lat: ' + coordinates[1] + '}, {');
        } else {
            latLongLiteral += ('lng: ' + coordinates[0] + ', lat: ' + coordinates[1] + '}]');
        }
    }
    //console.log(latitudeArr);
    console.log(latLongLiteral);
    console.log(minimumLat, minimumLon, maximumLat, maximumLon);
});
