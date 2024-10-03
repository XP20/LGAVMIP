let panorama;
let sv;
let playerMarker = null;
let randomMarker = null;
let panoLocation;
let selctedPosition;
let distanceBetweenMarkers
let score = 0;
let roundCounter = 0;
let pano; //panorama data object
let resultMap;

let PinElementRef = null;
let AdvancedMarkerElementRef = null;

async function initialize() {
  const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");
  PinElementRef = PinElement;
  AdvancedMarkerElementRef = AdvancedMarkerElement;
  
  let map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 56.951941,  lng: 24.081368 }, //have the map always centered at the true origin of the world, independent of street view position
    zoom: 7,
    disableDefaultUI: true,
    clickableIcons: false,
    mapId: "map",
  });
  google.maps.event.addListener(map, "click", (event) => {
    console.log(event);
    if (playerMarker != null)
      playerMarker.setMap(null);
    selctedPosition = event.latLng
    playerMarker = new google.maps.Marker({
      position: event.latLng,
      label: 'A',
      map: map,
    });
  });
  resultMap = new google.maps.Map(document.getElementById("results-map"), {
    center: { lat: 56.951941,  lng: 24.081368 }, 
    zoom: 7,
    disableDefaultUI: true,
    clickableIcons: false,
    mapId: "resultMap"
  });
  initPano();
  doPanorama();
}

async function doPanorama() {
  pano = await getPanoData(); //get panorama data
  processSVData(pano);
  panoLocation = pano.data.location.latLng; //true initial location of pano
  const debugMap = new google.maps.Map(document.getElementById("debugMap"), { //debug map element that shows the true location of the found panorama
    center: panoLocation, 
    zoom: 11,
    mapId: "debugMap",
    streetViewControl: false,
    fullscreenControl: false,
  });
  playerMarker.setMap(null);
  document.getElementById('results-screen').classList.add('hidden');
}
window.initMap = initialize;

function computeScore(){
  const maxScore = 1000; //score value at 0 meters/100% accurate guess
  const punishmentFactor = 12; //controls how quickly the score drops off with inaccuracy, the closer to 0, the more punishing
  const distance = google.maps.geometry.spherical.computeDistanceBetween(playerMarker.position, panoLocation);
  tempScore = maxScore/((distance/(maxScore*punishmentFactor))+1); // asymptotically goes down to 0 as distance from real guess tends to infinity, gives too high of a score for shitty guesses so need a secondary factor to take care of far-guess edge cases
  tempScore = tempScore - Math.pow(distance, 5)*Math.pow(10, -2*punishmentFactor); // high-order power that pulls down the score at extreme distances
  if (tempScore<=0) {
    return 0;
  } else return Math.ceil(tempScore);
}

async function Submit() {
  score += computeScore();
  if (roundCounter < 4) {
    document.getElementById('score').innerHTML = score.toString();
    roundCounter+=1;
  } else {
    document.getElementById('score').innerHTML = "Final score: " + score.toString();
    roundCounter=0; //After 5 rounds, reset
    score=0;
  }
  document.getElementById('results-screen').classList.remove('hidden');
  resultMap.setCenter({ lat: 56.951941,  lng: 24.081368 }, 6);
   if (playerMarker != null)
    playerMarker.setMap(null);

   if (randomMarker != null)
    randomMarker.setMap(null)

   if (distanceBetweenMarkers != null)
    distanceBetweenMarkers.setMap(null)

   const pinPlayer = new PinElementRef({
    borderColor: "#d92eff",
    background: "#e77cf7",
    glyphColor: "white"
  })  

  const pinRandomSet = new PinElementRef ({
    borderColor: "#cc260c",
    background: "#ede324",
    glyphColor: "white",
  })

  const lineSymbol ={
    path: 'M 0,-1 0,1',
    strokeOpacity: 1,
    scale: 3
  };

   playerMarker = new AdvancedMarkerElementRef({
     position: selctedPosition,
     content: pinPlayer.element,
     map: resultMap,
  });

  randomMarker = new AdvancedMarkerElementRef({
    position: panoLocation,
    content: pinRandomSet.element,
    map: resultMap,
  });

  let coordinates = [
    panoLocation,
    selctedPosition
  ];

  distanceBetweenMarkers = new google.maps.Polyline({
    path: coordinates,
    strokeOpacity: 0,
    icons: [{
      icon: lineSymbol,
      offset: '0',
      repeat: '20px'
    }],
    map: resultMap
  });

  distanceBetweenMarkers.setMap(resultMap);
}

function toggleDebugMap() {
  document.getElementById('debugMap').classList.contains('hidden') ? document.getElementById('debugMap').classList.remove('hidden') : document.getElementById('debugMap').classList.add('hidden');
  document.getElementById('debugButton').classList.contains('hidden') ? document.getElementById('debugButton').classList.remove('hidden') : document.getElementById('debugButton').classList.add('hidden');
}

function initPano() {
  sv = new google.maps.StreetViewService();
  panorama = new google.maps.StreetViewPanorama(
    document.getElementById("pano"),
    {
      addressControl: false,
      enableCloseButton: false,
      fullscreenControl: false,
      zoomControl: false,
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
  panorama.setPano(location.pano);
  panorama.setVisible(true);
}

window.initialize = initialize;
