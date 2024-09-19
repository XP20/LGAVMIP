function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function getCoords() {
  const latitude = parseFloat(getRndInteger(56500000, 57000000))/1000000;
  const longitude = parseFloat(getRndInteger(23000000, 24000000))/1000000; 
  return {lat: latitude, lng: longitude};
}

let marker = null;
async function initialize() {
  const {AdvancedMarkerElement} = await google.maps.importLibrary("marker");
  const pos = getCoords();
  const userGuessPos = { lat: 0,  lng: 0 };
  let map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 56.951941,  lng: 24.081368 }, //have the map always centered at the true origin of the world, independent of street view position
    zoom: 7,
    mapId: "DEMO_MAP_ID",
    disableDefaultUI: true,
    clickableIcons: false
  });
  const panorama = new google.maps.StreetViewPanorama(
    document.getElementById("pano"),
    {
      position: pos,
      pov: {
        heading: 180,
        pitch: 10,
      },
      addressControl: false,
      disableDefaultUI: true
    },
  );
  google.maps.event.addListener(map, "click", (event) => {
    console.log(event);
    if (marker != null)
      marker.setMap(null);
    marker = new google.maps.Marker({
      position: event.latLng,
      label: 'A',
      map: map,
    });
  });
}
window.initMap = initialize;


function toggleMap() {
  document.getElementById('map').classList.contains('hidden') ? document.getElementById('map').classList.remove('hidden') : document.getElementById('map').classList.add('hidden')
}
