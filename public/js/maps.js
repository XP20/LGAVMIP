let panorama;

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function getCoords() {
  const latitude = parseFloat(getRndInteger(56500000, 57000000))/1000000;
  const longitude = parseFloat(getRndInteger(23000000, 24000000))/1000000; 
  return {lat: latitude, lng: longitude};
}

async function initialize() {
  const pos = getCoords();
  const userGuessPos = { lat: 0,  lng: 0 };
  const sv = new google.maps.StreetViewService();
  const map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 56.951941,  lng: 24.081368 }, //have the map always centered at the true origin of the world, independent of street view position
    zoom: 7,
    mapId: "DEMO_MAP_ID",
    streetViewControl: false,
  });
  panorama = new google.maps.StreetViewPanorama(document.getElementById("pano"));
  sv.getPanorama({location: pos, radius: 5000}).then(processSVData);
}

function processSVData({ data }) {
  const location = data.location;
  const marker = new google.maps.Marker({
    position: location.latLng,
    map,
    title: location.description,
  });

  panorama.setPano(location.pano);
  panorama.setPov({
    heading: 270,
    pitch: 0,
  });
  panorama.setVisible(true);
  marker.addListener("click", () => {
    const markerPanoID = location.pano;

    // Set the Pano to use the passed panoID.
    panorama.setPano(markerPanoID);
    panorama.setPov({
      heading: 270,
      pitch: 0,
    });
    panorama.setVisible(true);
  });
}

window.initialize = initialize;