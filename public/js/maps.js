let panorama;
let sv;
let marker = null;

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function getCoords() {
  const latitude = parseFloat(getRndInteger(56450000, 57500000))/1000000;
  const longitude = parseFloat(getRndInteger(21000000, 27400000))/1000000; 
  return {lat: latitude, lng: longitude};
}

async function initialize() {
  let map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 56.951941,  lng: 24.081368 }, //have the map always centered at the true origin of the world, independent of street view position
    zoom: 7,
    mapId: "DEMO_MAP_ID",
    disableDefaultUI: true,
    clickableIcons: false
  });
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
  initPano();
  doPanorama();
}

async function doPanorama() {
  const pano = await getPanoData(); //get panorama data
  processSVData(pano);
  const panoLocation = pano.data.location.latLng; //true initial location of pano
  const debugMap = new google.maps.Map(document.getElementById("debugMap"), { //debug map element that shows the true location of the found panorama
    center: panoLocation, 
    zoom: 15,
    mapId: "debugMap",
    streetViewControl: false,
    fullscreenControl: false,
  });
}
window.initMap = initialize;


function Submit() {
  console.log(marker.position, )
}

function toggleDebugMap() {
  document.getElementById('debugMap').classList.contains('hidden') ? document.getElementById('debugMap').classList.remove('hidden') : document.getElementById('debugMap').classList.add('hidden')
}

function initPano() {
  sv = new google.maps.StreetViewService();
  panorama = new google.maps.StreetViewPanorama(
    document.getElementById("pano"),
    {
      addressControl: false,
      enableCloseButton: false,
      fullscreenControl: false,
      disableDefaultUI: true,
      showRoadLabels: false
    },
  );
}

async function getPanoData() {
  const pos = getCoords();
  const result = await sv.getPanorama({location: pos, radius: 5000, source: "outdoor"}).catch((e) => 
    getPanoData(), //hacky solution, if pano isn't found, recursively generate new location
  );
  return result;
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
}

window.initialize = initialize;
